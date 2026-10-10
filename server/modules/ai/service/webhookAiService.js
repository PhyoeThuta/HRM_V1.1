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
        .order('created_at', { ascending: false })
        .limit(30),
      supabaseAdmin.schema('crm').from('packages').select('*'),
      supabaseAdmin.schema('public').from('ai_knowledge_base').select('question, answer').limit(50) // Supabase returns {data, error}, no need to catch()
    ]);

    const existingInq = inqRes.data;
    const history = historyRes.data;
    if (!history || history.length === 0) return;
      
    // Reverse so the oldest is first, newest is last
    const chatHistory = history.reverse().map(m => `${m.sender_type.toUpperCase()}: ${m.message_text}`).join('\n');
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
            auto_reply_text: { type: SchemaType.STRING, description: "The auto reply text. NEVER be null. Always reply gracefully even if the user just says ok." }
          },
          required: ["intent", "sentiment", "recommended_action", "confidence_score", "pipeline_status", "auto_reply_text"]
        }
      }
    });
    
    const prompt = `
You are an Elite Agentic Sales Concierge for "Busy Boss Diet" (BBD). 
Your goal is to converse naturally, build rapport, and close sales with a soft, gentle, patient, and highly persuasive tone (လေပြေးအေးလေးနဲ့ အိညှောင့် အိညှောင့်). NEVER scold, lecture, or act condescending. Always be sweet, comforting, and emotionally supportive.

BRAND IDENTITY & UNIQUE SELLING PROPOSITION (USP):
BBD provides authentic, mouth-watering Myanmar curries (ဆီပြန်ဟင်း၊ အနှစ်တွေ) that are scientifically calorie-controlled. Customers can lose weight while still eating delicious curries instead of dry, tasteless diet food. Mention this naturally, but DO NOT use robotic repeated phrases. Be highly conversational.

AVAILABLE PACKAGES:
${activePackages}

COMPANY KNOWLEDGE BASE (FAQ):
${knowledgeBase}

PAYMENT DETAILS:
${paymentInfo}

CHAT HISTORY (CRITICAL - READ CAREFULLY):
${chatHistory}

CRITICAL RULES FOR "auto_reply_text":
1. PREMIUM MASCULINE/NEUTRAL TONE: You MUST end polite sentences with "ခင်ဗျာ" or "ပါ" (e.g. ဟုတ်ကဲ့ပါ ခင်ဗျာ). NEVER use female markers like "ရှင်" or "မ" or "နော်". Address the prospect as "Boss" respectfully.
2. SHORT & EMPATHETIC (CRITICAL): Keep replies CONCISE and punchy. DO NOT write long essays. Act like a friendly, caring human giving a great emotional vibe.
3. NO ROBOTIC GREETINGS: DO NOT say "မင်္ဂလာပါ" in every message. If they are already talking, just answer them directly.
4. BURMESE FOOD KNOWLEDGE: You have full knowledge of Burmese food, nutrition, and food combinations (e.g., whether beef and mushroom are safe together). If they ask general health/food questions, answer them sweet and confidently using your own knowledge! DO NOT hand over to human for these questions.
5. DISCOUNT REQUESTS: Confidently explain that BBD uses premium ingredients and scientific calorie counting, so the price is fixed, but the results are 100% worth it. Use your gentle persuasive tone.
6. NO EMOJIS: Do NOT use emojis (e.g., 🥗, 💪, ✨). Use clean line breaks. Do NOT use markdown asterisks (**).
7. AVOID REPETITION: NEVER repeat the exact same sentence or USP phrasing you just said. 
8. QUALIFY & LISTEN BEFORE PITCHING: If they mention health issues, acknowledge their problem empathetically BEFORE pitching.
9. CLOSING THE SALE: When they choose a plan, confirm their choice, ask for delivery details, and provide payment info elegantly.
10. HUMAN HANDOVER: ONLY if they ask about custom unlisted prices or very specific admin policies NOT in the Knowledge Base, OR if they are extremely angry, set intent to "needs_human" and reply: "ဒီအချက်လေးကို ပိုပြီး တိတိကျကျ ဆွေးနွေးပေးနိုင်ဖို့ ကျွန်တော်တို့ရဲ့ Consultant နဲ့ ခဏလေး ချိတ်ဆက်ပေးပါမယ် ခင်ဗျာ။"

CRITICAL RULES FOR "recommended_action" (AI INSIGHTS FOR ADMIN):
1. This is a private hint shown ONLY to the Admin. Be extremely logical.
2. DO NOT hallucinate. Base your recommendation ONLY on the latest message.
3. If they are angry, recommend: "Customer ဒေါသထွက်နေပါသည်။ Admin ကိုယ်တိုင် ချက်ချင်း ဝင်ရောက် ဖြေရှင်းပေးပါ။"
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

    // Only update pipeline status if not already an enrolled customer
    if (!existingInq?.customer_id && existingInq?.status !== 'converted') {
      const validStatuses = ['new', 'in_progress', 'pending', 'converted', 'lost'];
      if (validStatuses.includes(aiJson.pipeline_status)) {
        updatePayload.status = aiJson.pipeline_status;
      }
    }

    const { data: updated } = await supabaseAdmin.schema('crm').from('inquiries')
      .update(updatePayload)
      .eq('id', inquiryId)
      .select()
      .single();

    if (updated) emitInquiryUpdated(updated);

    // Auto-Reply Logic - ONLY IF AI IS ENABLED
    if (existingInq?.is_ai_enabled !== false && aiJson.auto_reply_text) {
      
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

          // Send to Zernio if it's a real webhook (has conversationId and API Key)
          if (conversationId && process.env.ZERNIO_API_KEY) {
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
            }).catch(e => console.error('[CRM AI ZERNIO ERROR]', e));
          }
          
          // Always save to database so it shows up in CRM
          const { data: newMsg } = await supabaseAdmin.schema('crm')
            .from('inquiries_messages')
            .insert({
              inquiry_id: inquiryId,
              message_text: aiJson.auto_reply_text,
              sender_type: 'ai_bot',
              metadata: { auto_reply: true, conversationId: conversationId || null }
            })
            .select().single();
            
          if (newMsg) emitInquiryMessage(inquiryId, newMsg);

          // IMPORTANT FIX: Turn off AI toggle ONLY AFTER sending the handover message!
          if (aiJson.intent === 'needs_human') {
             const { data: offInq } = await supabaseAdmin.schema('crm').from('inquiries')
               .update({ is_ai_enabled: false })
               .eq('id', inquiryId)
               .select().single();
             if (offInq) emitInquiryUpdated(offInq);
          }

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
