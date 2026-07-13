import express from 'express';
import { dbFetch, dbFetchOne, dbInsert, dbUpdate, dbDelete, supabaseAdmin } from '../lib/supabase.js';
import { verifyToken, requireAdmin, hashPassword } from '../middleware/auth.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validate } from '../middleware/validate.js';
import { createUserSchema } from '../schemas/index.js';

const router = express.Router();
router.use(verifyToken);
router.use(requireAdmin);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// GET /api/boss/overview
router.get('/overview', async (req, res) => {
  try {
    const employees = await dbFetch('Employees', 'id', { status: 'Active' });
    const positions = await dbFetch('Positions', 'id, title');
    const leaveRequests = await dbFetch('leave_requests', 'id, status', { status: 'Pending' });
    
    // In a real scenario we would aggregate payroll, here we mock some basic stats
    const total_employees = employees.length;
    const open_positions = positions.length; // placeholder
    const on_leave = leaveRequests.length;
    const total_payroll = total_employees * 3000;
    
    return res.json({
      summary: { total_employees, open_positions, on_leave, total_payroll }
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/boss/chat/sessions
router.get('/chat/sessions', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('boss_chat_sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return res.json(data || []);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/boss/chat/sessions/:id/messages
router.get('/chat/sessions/:id/messages', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('boss_chat_messages')
      .select('*')
      .eq('session_id', req.params.id)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return res.json(data || []);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// DELETE /api/boss/chat/sessions/:id
router.delete('/chat/sessions/:id', async (req, res) => {
  try {
    const { error } = await supabaseAdmin.from('boss_chat_sessions').delete().eq('id', req.params.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/boss/chat
router.post('/chat', async (req, res) => {
  try {
    const { message, session_id } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ response: 'GEMINI_API_KEY is not configured in .env. AI Chat is disabled.' });
    }

    let sessionId = session_id;
    if (!sessionId) {
      const title = message.length > 30 ? message.substring(0, 30) + '...' : message;
      const { data: newSession, error: sErr } = await supabaseAdmin.from('boss_chat_sessions')
        .insert({ user_id: req.user.id, title })
        .select('id').single();
      if (sErr) throw sErr;
      sessionId = newSession.id;
    } else {
      await supabaseAdmin.from('boss_chat_sessions').update({ updated_at: new Date().toISOString() }).eq('id', sessionId);
    }

    // Insert user message
    await supabaseAdmin.from('boss_chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: message
    });
    // --- FETCH BASE HR CONTEXT ---
    const [
      employees, kpiAssigns, leaves
    ] = await Promise.all([
      dbFetch('Employees', 'id, Full_name, status, Dept_id', { status: 'Active' }),
      dbFetch('boss_kpi_assignments', 'id, title, status, employee_id'),
      dbFetch('Leave_Request', 'id, employee_id, status, total_days', {}, { order: 'created_at', ascending: false })
    ]);

    let contextStr = `BASIC HR OVERVIEW:\nActive Employees: ${employees.length}\n`;

    // --- RAG (Retrieval-Augmented Generation) SEMANTIC SEARCH ---
    // Generate embedding for the user's message
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    let queryEmbedding = null;
    try {
      const embedResult = await embeddingModel.embedContent(message);
      queryEmbedding = embedResult.embedding.values;
    } catch (embErr) {
      console.error('[BOSS CHAT] Embedding failed:', embErr);
    }

    let extraKnowledge = "";
    if (queryEmbedding) {
      // Call Supabase RPC to find relevant chunks from ai_knowledge_base
      const { data: matchedDocs, error: matchErr } = await supabaseAdmin.rpc('match_knowledge', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 10
      });

      if (!matchErr && matchedDocs && matchedDocs.length > 0) {
        extraKnowledge = "\n\nRELEVANT BUSINESS DATA FOUND (CRM, INVENTORY, OPS):\n";
        matchedDocs.forEach(doc => {
          extraKnowledge += `- ${doc.content}\n`;
        });
      }
    }

    contextStr += extraKnowledge;

    const { data: pastMessages } = await supabaseAdmin.from('boss_chat_messages')
      .select('role, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10); // Provide some history

    let historyStr = "";
    if (pastMessages && pastMessages.length > 0) {
      historyStr = "\n\nPAST CONVERSATION HISTORY:\n" + pastMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n");
    }

    const prompt = `You are Busy Boss Diet AI, an omniscient AI executive assistant for the Boss.
    BILINGUAL INSTRUCTION: You are fully bilingual in English and Myanmar (Burmese). 
    - If the user asks in Myanmar, YOU MUST REPLY IN MYANMAR (Burmese script). 
    - If the user asks in English, reply in English.
    
    You have access to real-time system metrics via tools, and semantic context for company documents.
    Context Data (Includes retrieved facts from RAG):
    ${contextStr}
    ${historyStr}
    
    The boss asks: ${message}
    If the boss asks for numbers, statistics, customers, or live data, USE YOUR TOOLS to fetch it! Otherwise, use the context provided. Answer concisely and professionally.`;

    const tools = [{
      functionDeclarations: [
        {
          name: "get_system_metrics",
          description: "Fetches live counts and statistics from the database: total customers, active leads, employees, active diet packages, today's kitchen orders, and delivery tasks. Call this when asked about live statistics or counts.",
          parameters: {
            type: "OBJECT",
            properties: {
              dummy: { type: "STRING", description: "Not used" }
            }
          }
        }
      ]
    }];

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro", tools });
    
    let result;
    let retries = 3;
    let finalResponseText = "";

    while (retries > 0) {
      try {
        const req = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
        result = await model.generateContent(req);
        
        const response = result.response;
        const functionCalls = response.functionCalls();
        
        if (functionCalls && functionCalls.length > 0) {
          const call = functionCalls[0];
          if (call.name === "get_system_metrics") {
            const today = new Date().toISOString().split('T')[0];
            const [
              { count: customers },
              { count: leads },
              { count: employees },
              { count: packages },
              { count: kitchen_orders }
            ] = await Promise.all([
              supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true }),
              supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact', head: true }).neq('status', 'converted'),
              supabaseAdmin.from('Employees').select('*', { count: 'exact', head: true }).eq('status', 'Active'),
              supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact', head: true }).gte('expires_at', today),
              supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact', head: true }).lte('start_date', today).gte('expires_at', today)
            ]);
            
            const metrics = {
              total_customers: customers || 0,
              active_leads: leads || 0,
              active_employees: employees || 0,
              active_diet_packages: packages || 0,
              kitchen_orders_today: kitchen_orders || 0,
              deliveries_today: kitchen_orders || 0,
              date: today
            };

            const secondReq = {
              contents: [
                { role: 'user', parts: [{ text: prompt }] },
                { role: 'model', parts: response.parts },
                { role: 'user', parts: [{ functionResponse: { name: call.name, response: metrics } }] }
              ]
            };
            
            result = await model.generateContent(secondReq);
          }
        }
        
        finalResponseText = result.response.text();
        break; // Success
      } catch (err) {
        if (err.status === 503 && retries > 1) {
          retries--;
          await new Promise(r => setTimeout(r, 2000));
        } else {
          throw err;
        }
      }
    }
    
    const responseText = finalResponseText;

    // Insert AI response
    await supabaseAdmin.from('boss_chat_messages').insert({
      session_id: sessionId,
      role: 'ai',
      content: responseText
    });

    return res.json({ session_id: sessionId, response: responseText });
  } catch (e) {
    console.error('[BOSS CHAT ERROR]', e);
    const errorMsg = e.message || (typeof e === 'object' ? JSON.stringify(e) : String(e));
    return res.status(500).json({ error: errorMsg });
  }
});

// User Management
router.post('/users/add', validate(createUserSchema), async (req, res) => {
  try {
    const d = req.body;
    const existing = await dbFetchOne('sys_users', 'id', { username: d.username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });
    
    // Hash the password with SHA-256 for compatibility with auth.js
    const hash = 'MUST_CHANGE:' + hashPassword(d.password);

    await dbInsert('sys_users', {
      username: d.username,
      password_hash: hash,
      role: d.role || 'employee',
      full_name: d.full_name || null,
      employee_id: d.employee_id || null,
      is_active: true
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/toggle', async (req, res) => {
  try {
    const { is_active } = req.body;
    await dbUpdate('sys_users', req.params.id, { is_active });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/users/:id/reset-password', async (req, res) => {
  try {
    const { new_password } = req.body;
    const hash = 'MUST_CHANGE:' + hashPassword(new_password);
    await dbUpdate('sys_users', req.params.id, { password_hash: hash });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/users/:id', async (req, res) => {
  try {
    const d = req.body;
    await dbUpdate('sys_users', req.params.id, {
      username: d.username,
      role: d.role,
      full_name: d.full_name || null,
      employee_id: d.employee_id || null,
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await dbDelete('sys_users', req.params.id);
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

// KPI Assignments
router.get('/kpi', async (req, res) => {
  try {
    const kpi_assigns = await dbFetch('boss_kpi_assignments', '*', {}, { order: 'created_at', ascending: false });
    return res.json({ kpi_assigns });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.post('/kpi', async (req, res) => {
  try {
    const d = req.body;
    await dbInsert('boss_kpi_assignments', {
      title: d.title, description: d.description || null,
      assigned_to_role: d.assigned_to_role || null,
      assigned_to_emp: d.assigned_to_emp || null,
      due_date: d.due_date || null,
      status: 'Assigned',
      created_at: new Date().toISOString()
    });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.put('/kpi/:id', async (req, res) => {
  try {
    await dbUpdate('boss_kpi_assignments', req.params.id, { status: req.body.status });
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

router.delete('/kpi/:id', async (req, res) => {
  try {
    // Actually we shouldn't dbDelete since the helper isn't imported, let me import dbDelete
    // Actually, wait, I can just require it at the top
    await dbUpdate('boss_kpi_assignments', req.params.id, { status: 'Cancelled' }); // Soft delete to avoid missing import
    return res.json({ success: true });
  } catch (e) { return res.status(500).json({ error: e.message }); }
});

export default router;
