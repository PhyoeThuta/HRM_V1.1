import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseAdmin } from '../../../lib/supabase.js';

export async function processAiAssistantQuery(query, user) {
  if (!query) throw new Error('Query is required');
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const userId = user?.id || 'guest_admin';
  const userRole = user?.role || 'admin';
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Database Quota Enforcement (Max 5 AI Agentic Tasks per day)
  let currentUsed = 0;
  let quotaId = null;

  try {
    const { data: quotaRow, error: quotaErr } = await supabaseAdmin.schema('crm')
      .from('ai_quotas')
      .select('id, used_tasks')
      .eq('user_id', userId)
      .eq('date', todayStr)
      .maybeSingle();

    if (quotaErr && quotaErr.code !== '42P01') { // Ignore table not found temporarily
      console.warn('[AI Quota DB Read Error]', quotaErr);
    }
    
    if (quotaRow) {
      currentUsed = quotaRow.used_tasks;
      quotaId = quotaRow.id;
    }
  } catch (err) {
    console.warn('[AI Quota Check Error]', err);
  }

  if (currentUsed >= 5) {
    throw new Error('⚠️ **နေ့စဉ် AI ခိုင်းစေနိုင်သည့် ပမာဏ ပြည့်သွားပါပြီ!**\n\nတစ်နေ့လျှင် AI Copilot ထံ Agentic Tasks **(၅) ခု** သာ ခိုင်းစေခွင့် ပြုထားပါသည်။ ဒီနေ့အတွက် ခိုင်းစေမှု (၅/၅) မျိုး ပြည့်သွားပြီဖြစ်၍ မနက်ဖြန်မှ ထပ်မံ ခိုင်းစေနိုင်မည် ဖြစ်ပါသည်။ (မှတ်ချက် - စည်းကမ်းချက်များအား Strict ရေးဆွဲထားပါသည်)');
  }

  const remainingTasks = 5 - (currentUsed + 1);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const tools = [{
    functionDeclarations: [
      {
        name: "execute_analytics_query",
        description: "Execute a dynamic Read-Only SQL (PostgreSQL) query to get EXACT data from crm schema (crm.customers, crm.customer_health, crm.customer_lifestyle, crm.customer_packages, crm.inquiries, crm.feedbacks, crm.level_settings, etc.).",
        parameters: {
          type: "OBJECT",
          properties: {
            sql_query: { type: "STRING", description: "Read-only PostgreSQL SELECT query." }
          },
          required: ["sql_query"]
        }
      },
      {
        name: "search_customer_full_memory",
        description: "Search for a customer by name, phone, or ID and automatically return their full dossier (customer profile, health allergies, medical history, lifestyle preferences, active/past diet packages, and feedback history).",
        parameters: {
          type: "OBJECT",
          properties: {
            search_term: { type: "STRING", description: "Customer name, phone number, or numeric ID" }
          },
          required: ["search_term"]
        }
      },
      {
        name: "get_crm_metrics",
        description: "Fetches overall CRM metrics: total active customers, inactive/churned customers, leads count, active packages count.",
        parameters: { type: "OBJECT", properties: { dummy: { type: "STRING" } } }
      },
      {
        name: "agentic_update_customer_note",
        description: "Agentic action: Update or add a special customer care note or allergy rule directly into the database on behalf of the Admin/Boss.",
        parameters: {
          type: "OBJECT",
          properties: {
            customer_id: { type: "NUMBER", description: "Customer numeric ID" },
            allergies: { type: "STRING", description: "Updated allergy list or special food rules" },
            special_requests: { type: "STRING", description: "Special requests or care notes" }
          },
          required: ["customer_id"]
        }
      }
    ]
  }];

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", tools });

  const systemPrompt = `You are BBD Admin CRM AI Copilot, the omniscient and AGENTIC CRM assistant for Busy Boss Diet (BBD).
BILINGUAL INSTRUCTION: Reply in Myanmar (Burmese script) with a professional, helpful, and precise tone.

STRICT PRIVACY & SECURITY RULES:
- User Role: ${userRole}
- FINANCIAL REPORT PRIVACY RULE: Comprehensive Financial Revenue, Profit Margins, and Executive Financial Reports are STRICTLY CONFIDENTIAL and reserved FOR THE BOSS ONLY (userRole === 'boss'). If a non-boss user asks for total revenue/financial profits, politely inform them: "⚠️ ဘဏ္ဍာရေး အစီရင်ခံစာများနှင့် ဝင်ငွေအချက်အလက်များသည် 'Boss' (သူဌေး) တစ်ဦးတည်းသာ ကြည့်ရှုခွင့်ရှိသော Strict Confidential Data ဖြစ်ပါသည်။"

DAILY TASK QUOTA CONTEXT:
- Remaining Tasks Today for this User: ${remainingTasks} of 5 tasks remaining. Mention this remaining quota politely at the end of your response.

AGENTIC CAPABILITIES:
- You can execute SQL queries, search customer histories, and perform database actions (like updating health notes) when instructed.

WHEN A CUSTOMER IS LOOKED UP OR RETRIEVED:
1. Provide a clean summary of their profile and status.
2. Recall their Historical Memory & Preferences (e.g. allergies, beef avoidance, medical notes, target weight).
3. Include clickable Markdown action links:
   - [View Customer Profile](/crm/customers/<id>)
   - [Customer Welcome Dossier](/welcome/<id>)
   - [Re-enrollment Form](/enroll)
4. Auto-generate a warm, personalized Burmese "Welcome Back" message ready to copy & send to the customer.

=== ADMIN QUERY ===
${query}
=== END QUERY ===`;

  let history = [{ role: 'user', parts: [{ text: systemPrompt }] }];
  let finalResponseText = "";
  let toolCallCount = 0;

  while (toolCallCount < 6) {
    const result = await model.generateContent({ contents: history });
    const response = result.response;
    const modelParts = response.candidates?.[0]?.content?.parts || [];
    history.push({ role: 'model', parts: modelParts });

    const functionCalls = response.functionCalls();
    if (!functionCalls || functionCalls.length === 0) {
      if (response.text()) {
        finalResponseText = response.text();
      } else {
        throw new Error("AI returned an empty response.");
      }
      break;
    }

    const call = functionCalls[0];
    let apiRes = {};

    try {
      if (call.name === "execute_analytics_query") {
        const { sql_query } = call.args;
        const { data, error } = await supabaseAdmin.rpc('execute_read_only_sql', { query_text: sql_query });
        if (error) {
          apiRes = { error: error.message || error };
        } else {
          apiRes = { data: data || [] };
        }
      } else if (call.name === "search_customer_full_memory") {
        const { search_term } = call.args;
        const term = String(search_term).trim();
        let isNum = !isNaN(term);

        let q = supabaseAdmin.schema('crm').from('customers').select('*');
        if (isNum) {
          q = q.or(`id.eq.${term},phone.ilike.%${term}%,full_name.ilike.%${term}%`);
        } else {
          q = q.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%`);
        }

        const { data: custs } = await q.limit(5);
        if (custs && custs.length > 0) {
          const cust = custs[0];
          const [hRes, lRes, pRes, fRes] = await Promise.all([
            supabaseAdmin.schema('crm').from('customer_health').select('*').eq('customer_id', cust.id).maybeSingle(),
            supabaseAdmin.schema('crm').from('customer_lifestyle').select('*').eq('customer_id', cust.id).maybeSingle(),
            supabaseAdmin.schema('crm').from('customer_packages').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }),
            supabaseAdmin.schema('crm').from('feedbacks').select('*').eq('customer_id', cust.id).order('created_at', { ascending: false }).limit(5)
          ]);

          apiRes = {
            customer: cust,
            health: hRes.data || null,
            lifestyle: lRes.data || null,
            packages: pRes.data || [],
            recent_feedbacks: fRes.data || []
          };
        } else {
          apiRes = { message: `No customer found matching '${term}'` };
        }
      } else if (call.name === "get_crm_metrics") {
        const today = new Date().toISOString().split('T')[0];
        const [
          { count: totalCust },
          { count: activeCust },
          { count: totalLeads },
          { count: activePkgs }
        ] = await Promise.all([
          supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true }),
          supabaseAdmin.schema('crm').from('customer_packages').select('customer_id', { count: 'exact', head: true }).gte('expires_at', today),
          supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact', head: true }).neq('status', 'converted'),
          supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact', head: true }).gte('expires_at', today)
        ]);

        apiRes = {
          total_customers: totalCust || 0,
          active_customers: activeCust || 0,
          inactive_customers: (totalCust || 0) - (activeCust || 0),
          total_leads: totalLeads || 0,
          active_packages: activePkgs || 0
        };
      } else if (call.name === "agentic_update_customer_note") {
        const { customer_id, allergies, special_requests } = call.args;
        const { data: existing } = await supabaseAdmin.schema('crm').from('customer_health').select('id').eq('customer_id', customer_id).maybeSingle();

        let updateErr = null;
        if (existing) {
          const { error } = await supabaseAdmin.schema('crm').from('customer_health')
            .update({ allergies, special_requests })
            .eq('customer_id', customer_id);
          updateErr = error;
        } else {
          const { error } = await supabaseAdmin.schema('crm').from('customer_health')
            .insert({ customer_id, allergies, special_requests });
          updateErr = error;
        }

        if (updateErr) {
          apiRes = { error: updateErr.message };
        } else {
          apiRes = { success: true, message: `Successfully updated customer #${customer_id} health notes & allergies.` };
        }
      }
    } catch (err) {
      apiRes = { error: err.message };
    }

    history.push({ role: 'user', parts: [{ functionResponse: { name: call.name, response: apiRes } }] });
    toolCallCount++;
  }

  if (!finalResponseText) {
    history.push({ role: 'user', parts: [{ text: "Present your full response in Burmese." }] });
    const forced = await model.generateContent({ contents: history });
    finalResponseText = forced.response.text();
    if (!finalResponseText) {
      throw new Error("Failed to generate final response from AI.");
    }
  }

  // 2. Update DB Quota on success
  try {
    if (quotaId) {
      await supabaseAdmin.schema('crm').from('ai_quotas')
        .update({ used_tasks: currentUsed + 1, updated_at: new Date().toISOString() })
        .eq('id', quotaId);
    } else {
      await supabaseAdmin.schema('crm').from('ai_quotas')
        .insert({ user_id: userId, date: todayStr, used_tasks: 1 });
    }
  } catch (err) {
    console.error('[AI Quota Update Error]', err);
  }

  return {
    success: true,
    quota: { remaining: remainingTasks, limit: 5 },
    response: finalResponseText
  };
}
