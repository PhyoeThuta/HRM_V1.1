import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { supabaseAdmin } from '../../../lib/supabase.js';
import { emitInquiryUpdated, emitInquiryMessage } from '../../../lib/crmRealtime.js';

export async function triggerAIAnalysis(inquiryId, conversationId = null) {
  if (!process.env.GEMINI_API_KEY) {
    await supabaseAdmin.schema('crm').from('inquiries').update({ updated_at: new Date() }).eq('id', inquiryId);
    return;
  }
  
  try {
    // Fetch History & Packages Concurrently
    const [historyRes, packagesRes] = await Promise.all([
      supabaseAdmin.schema('crm').from('inquiries_messages')
        .select('sender_type, message_text')
        .eq('inquiry_id', inquiryId)
        .order('created_at', { ascending: true })
        .limit(15),
      supabaseAdmin.schema('crm').from('packages').select('*')
    ]);

    const history = historyRes.data;
    if (!history || history.length === 0) return;
      
    const chatHistory = history.map(m => `${m.sender_type.toUpperCase()}: ${m.message_text}`).join('\n');
    const paymentInfo = process.env.PAYMENT_INFO_TEXT || 'KBZ Pay: 09XXXXXXX';
    
    // Format Packages into a readable string
    let activePackages = 'No active packages found.';
    if (packagesRes.data && packagesRes.data.length > 0) {
      activePackages = packagesRes.data.map(p => `- ${p.name} (${p.duration}): ${p.price} THB`).join('\n');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            intent: { type: SchemaType.STRING, description: "e.g., pricing_inquiry, general_question, complaint, ready_to_buy" },
            sentiment: { type: SchemaType.STRING, description: "e.g., positive, curious, neutral, frustrated" },
            recommended_action: { type: SchemaType.STRING, description: "1-2 sentences of what the admin should reply in Myanmar language / Burmese." },
            confidence_score: { type: SchemaType.INTEGER, description: "0 to 100 representing likelihood to purchase" },
            pipeline_status: { type: SchemaType.STRING, description: "Must be EXACTLY one of: 'new', 'in_progress', 'pending', 'converted', 'lost'. Set 'in_progress' for follow-up stage. Set 'pending' ONLY if prospect asks to buy/pay/transfer money now. Set 'new' for brief initial greetings." },
            auto_reply_text: { type: SchemaType.STRING, nullable: true, description: "The auto reply text or null if no reply needed." }
          },
          required: ["intent", "sentiment", "recommended_action", "confidence_score", "pipeline_status"]
        }
      }
    });
    
    const prompt = `
You are BBD Enterprise's elite Sales Executive AI Copilot. 
Analyze the following conversation history between a PROSPECT and our ADMIN.

AVAILABLE PACKAGES:
${activePackages}

PAYMENT DETAILS:
${paymentInfo}

CHAT HISTORY:
${chatHistory}

TASK:
Provide the JSON response according to the schema.
CRITICAL "BOSS" TONE RULE: For "auto_reply_text", you MUST reply in a highly premium, polite, and confident "Boss" style. Address the prospect respectfully as "Boss" (e.g., "မင်္ဂလာပါ Boss", "Boss လိုအပ်တဲ့ Package လေးက..."). Explain the packages clearly using the AVAILABLE PACKAGES data if they ask for prices or options.
CRITICAL REPLY RULE: Do NOT send payment info unless the prospect explicitly asks 'How to pay?', 'Where to transfer?', or says they are ready to transfer money now. If they just say 'thank you' or 'ok', return null for auto_reply_text.
    `;
    
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();
    const aiJson = JSON.parse(aiText);
    
    // Check existing inquiry state first
    const { data: existingInq } = await supabaseAdmin.schema('crm').from('inquiries').select('customer_id, status').eq('id', inquiryId).single();

    const updatePayload = { 
      updated_at: new Date().toISOString(),
      ai_analysis_result: {
        intent: aiJson.intent,
        sentiment: aiJson.sentiment,
        recommended_action: aiJson.recommended_action
      },
      service_interest_confidence: aiJson.confidence_score
    };

    // Only update pipeline status if not already an enrolled customer
    if (!existingInq?.customer_id && existingInq?.status !== 'converted') {
      updatePayload.status = aiJson.pipeline_status || 'new';
    }

    const { data: updated } = await supabaseAdmin.schema('crm').from('inquiries')
      .update(updatePayload)
      .eq('id', inquiryId)
      .select()
      .single();

    if (updated) emitInquiryUpdated(updated);

    // Auto-Reply Logic
    if (aiJson.auto_reply_text && conversationId && process.env.ZERNIO_API_KEY) {
      try {
        const zernioUrl = `https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`;
        await fetch(zernioUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`
          },
          body: JSON.stringify({
            accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
            message: aiJson.auto_reply_text
          })
        });
        
        const { data: newMsg } = await supabaseAdmin.schema('crm')
          .from('inquiries_messages')
          .insert({
            inquiry_id: inquiryId,
            message_text: aiJson.auto_reply_text,
            sender_type: 'ai_bot',
            metadata: { auto_reply: true, conversationId }
          })
          .select().single();
          
        if (newMsg) emitInquiryMessage(inquiryId, newMsg);
      } catch (err) {
        console.error('[CRM AI AUTO REPLY ERROR]', err);
        throw err;
      }
    }
  } catch (aiErr) {
    console.error('[CRM AI ANALYSIS ERROR]', aiErr);
    throw aiErr;
  }
}
