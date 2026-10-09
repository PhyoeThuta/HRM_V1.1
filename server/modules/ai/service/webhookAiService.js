import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { supabaseAdmin } from '../../../lib/supabase.js';
import { emitInquiryUpdated, emitInquiryMessage } from '../../../lib/crmRealtime.js';

export async function triggerAIAnalysis(inquiryId, conversationId = null) {
  if (!process.env.GEMINI_API_KEY) {
    await supabaseAdmin.schema('crm').from('inquiries').update({ updated_at: new Date() }).eq('id', inquiryId);
    return;
  }
  
  try {
    // 1. Fetch Inquiry State, History, Packages, and RAG Knowledge Base Concurrently
    const [inqRes, historyRes, packagesRes, kbRes] = await Promise.all([
      supabaseAdmin.schema('crm').from('inquiries').select('customer_id, status, is_ai_enabled').eq('id', inquiryId).single(),
      supabaseAdmin.schema('crm').from('inquiries_messages')
        .select('sender_type, message_text')
        .eq('inquiry_id', inquiryId)
        .order('created_at', { ascending: true })
        .limit(20),
      supabaseAdmin.schema('crm').from('packages').select('*'),
      supabaseAdmin.schema('public').from('ai_knowledge_base').select('question, answer').limit(50).catch(() => ({ data: [] })) // Optional RAG table
    ]);

    const existingInq = inqRes.data;
    const history = historyRes.data;
    if (!history || history.length === 0) return;
      
    const chatHistory = history.map(m => `${m.sender_type.toUpperCase()}: ${m.message_text}`).join('\n');
    const paymentInfo = process.env.PAYMENT_INFO_TEXT || 'KBZ Pay: 09XXXXXXX (Phyoe Thuta)';
    
    // Format Packages
    let activePackages = 'No active packages found.';
    if (packagesRes.data && packagesRes.data.length > 0) {
      activePackages = packagesRes.data.map(p => `- ${p.name} (${p.duration}): ${p.price} THB`).join('\n');
    }

    // Format Knowledge Base (RAG)
    let knowledgeBase = '';
    if (kbRes.data && kbRes.data.length > 0) {
      knowledgeBase = kbRes.data.map(kb => `Q: ${kb.question}\nA: ${kb.answer}`).join('\n\n');
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            intent: { type: SchemaType.STRING, description: "e.g., pricing_inquiry, general_question, needs_human, ready_to_buy" },
            sentiment: { type: SchemaType.STRING, description: "e.g., positive, curious, neutral, frustrated" },
            recommended_action: { type: SchemaType.STRING, description: "Brief advice for the human admin on what to say next to the prospect in Burmese." },
            confidence_score: { type: SchemaType.INTEGER, description: "0 to 100 representing likelihood to purchase" },
            pipeline_status: { type: SchemaType.STRING, description: "Must be EXACTLY one of: 'new', 'in_progress', 'pending', 'converted', 'lost'. Set 'in_progress' for follow-up stage. Set 'pending' ONLY if prospect asks to buy/pay/transfer money now. Set 'new' for brief initial greetings." },
            auto_reply_text: { type: SchemaType.STRING, nullable: true, description: "The auto reply text or null if no reply needed." }
          },
          required: ["intent", "sentiment", "recommended_action", "confidence_score", "pipeline_status"]
        }
      }
    });
    
    const prompt = `
You are an Elite Agentic Sales Concierge for "Busy Boss Diet" (BBD). 
Your goal is to converse naturally, build rapport, and assist the prospect without being annoying or robotic.

BRAND IDENTITY & UNIQUE SELLING PROPOSITION (USP):
BBD provides authentic, mouth-watering Myanmar curries (ဆီပြန်ဟင်း၊ အနှစ်တွေ) that are scientifically calorie-controlled. Customers can lose weight WITHOUT eating dry, tasteless "healthy" food (ဆီမပါ ပြားမပါ ချောက်ကပ်ကပ်). Always highlight this USP when pitching.

AVAILABLE PACKAGES:
${activePackages}

COMPANY KNOWLEDGE BASE (FAQ):
${knowledgeBase}

PAYMENT DETAILS:
${paymentInfo}

CHAT HISTORY (CRITICAL - READ CAREFULLY):
${chatHistory}

CRITICAL RULES FOR "auto_reply_text":
1. PREMIUM MINIMALIST TONE: Use a highly professional, confident, and polite Burmese tone (like a 5-Star Hotel Concierge). Address the user respectfully as "Boss". 
2. NO EMOJIS: Do NOT use cheap emojis (e.g., 🥗, 💪, ✨). Use clean line breaks and elegant minimalist formatting. Do NOT use markdown asterisks (**).
3. AVOID REPETITION: If you already pitched the packages earlier, DO NOT repeat the same pitch. 
4. SHORT GREETINGS: If the user just says "Hi", reply with a VERY SHORT greeting: "မင်္ဂလာပါ Boss၊ BBD ကနေ ကြိုဆိုပါတယ်။ ကျန်းမာရေးနဲ့ Diet plan အတွက် ဘယ်လိုမျိုး အကူအညီပေးရမလဲ ခင်ဗျာ။"
5. QUALIFY BEFORE PITCHING: Don't just dump prices. If they ask for plans, ask them nicely about their weight loss or health goals first.
6. CLOSING THE SALE: When they choose a plan, do NOT just dump the bank account. Confirm their choice, build excitement, ask for delivery details, and then provide payment info elegantly.
7. HUMAN HANDOVER: If they ask complex questions not in the Knowledge Base, or seem frustrated, set intent to "needs_human" and reply gracefully: "ဒီအချက်လေးကို ပိုပြီး တိတိကျကျ ရှင်းပြပေးနိုင်ဖို့ ကျွန်တော်တို့ရဲ့ Consultant နဲ့ ခဏလေး ချိတ်ဆက်ပေးပါမယ် ခင်ဗျာ။"

CRITICAL RULES FOR "recommended_action" (AI INSIGHTS FOR ADMIN):
1. This is a private hint shown ONLY to the Admin. Be extremely logical.
2. DO NOT hallucinate. If the customer just says "Hi" or "အေး hi", simply recommend: "Customer က နှုတ်ဆက်လာပါတယ်။ Diet Plan အကြောင်း စတင်မိတ်ဆက်ပေးပါ။"
3. NEVER assume the customer is giving feedback or is happy unless they explicitly state it in the latest message. Base your recommendation ONLY on the latest message.
    `;
    
    const result = await model.generateContent(prompt);
    const aiText = result.response.text();
    const aiJson = JSON.parse(aiText);
    
    const updatePayload = { 
      updated_at: new Date().toISOString(),
      ai_analysis_result: {
        intent: aiJson.intent,
        sentiment: aiJson.sentiment,
        recommended_action: aiJson.recommended_action
      },
      service_interest_confidence: aiJson.confidence_score
    };

    // If AI decided human handover is needed, turn off AI toggle
    if (aiJson.intent === 'needs_human') {
      updatePayload.is_ai_enabled = false;
    }

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

    // Auto-Reply Logic - ONLY IF AI IS ENABLED
    if (existingInq?.is_ai_enabled !== false && aiJson.auto_reply_text && conversationId && process.env.ZERNIO_API_KEY) {
      
      // Implement Human-Like Random Delay (30 to 60 seconds)
      const delayMs = Math.floor(Math.random() * (60000 - 30000 + 1) + 30000);
      
      // Use setTimeout to process in background without blocking the original webhook response
      setTimeout(async () => {
        try {
          // Re-check if AI is still enabled after the delay (Admin might have turned it off while waiting)
          const { data: currentInq } = await supabaseAdmin.schema('crm').from('inquiries').select('is_ai_enabled').eq('id', inquiryId).single();
          if (currentInq?.is_ai_enabled === false) {
            console.log('[CRM AI] Auto-reply aborted because AI was turned off during the delay window.');
            return;
          }

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
          console.error('[CRM AI AUTO REPLY DELAYED ERROR]', err);
        }
      }, delayMs);
      
    }
  } catch (aiErr) {
    console.error('[CRM AI ANALYSIS ERROR]', aiErr);
    throw aiErr;
  }
}
