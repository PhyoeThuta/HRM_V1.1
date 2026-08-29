import cron from 'node-cron';
import { supabaseAdmin } from '../lib/supabase.js';
import fetch from 'node-fetch';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.CHEF_CHAT_ID || process.env.TELEGRAM_CHAT_ID; // Fallback to Chef/General chat ID if Admin ID is not set
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

async function sendTelegramMessage(chatId, text) {
  if (!TELEGRAM_TOKEN || !chatId) return;
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (err) {
    console.error('[TELEGRAM] Error sending message:', err.message);
  }
}

export function startFollowupCron() {
  // Run everyday at 10:00 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('[CRON] Running daily CRM follow-ups check...');
    await checkAndNotifyFollowups();
  });
}

export async function checkAndNotifyFollowups() {
  try {
    const todayDateOnly = new Date();
    todayDateOnly.setHours(0, 0, 0, 0);

    const { data: packages, error } = await supabaseAdmin.schema('crm')
      .from('customer_packages')
      .select(`
        id,
        name,
        duration,
        expires_at,
        customer_id,
        customers:customer_id ( full_name, phone, facebook_name )
      `)
      .eq('status', 'Active');

    if (error) throw error;
    if (!packages || packages.length === 0) return { checked: 0, notified: 0 };

    let notifiedCount = 0;
    
    // Zernio and Payment Credentials
    const zernioApiKey = process.env.ZERNIO_API_KEY;
    const zernioAccountId = process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230';
    const paymentInfoText = process.env.PAYMENT_INFO_TEXT || '';
    
    for (const pkg of packages) {
      if (!pkg.expires_at || !pkg.duration) continue;
      
      const expiresAt = new Date(pkg.expires_at);
      expiresAt.setHours(0, 0, 0, 0);
      
      const diffTime = expiresAt - todayDateOnly;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      const durationLower = pkg.duration.toLowerCase();
      let shouldNotify = false;
      let messageText = '';
      const customer = pkg.customers;

      if (diffDays < 0) {
        // Past expiry
        shouldNotify = true;
        messageText = `မင်္ဂလာပါ ${customer.full_name} ရှင်၊ ယူထားတဲ့ ${pkg.name} လေး ကုန်သွားတာ ${Math.abs(diffDays)} ရက် ရှိသွားပါပြီရှင်။\n\nညီမတို့ BBD က meal plan လေးကို စားရတာ အဆင်ပြေခဲ့ရဲ့လားရှင်။\n\nနောက်ရက်တွေအတွက် Plan လေးများ ပြန်စဖို့ အစီအစဉ်ရှိမလား သိချင်လို့ပါရှင် 🥗✨`;
      } else if (durationLower.includes('month') || durationLower.includes('30 day')) {
        if (diffDays === 3) {
          shouldNotify = true;
          messageText = `မင်္ဂလာပါ ${customer.full_name} ရှင်၊ ယူထားတဲ့ ${pkg.name} လေးက နောက် ${diffDays} ရက်နေရင် ကုန်ပါတော့မယ်။\n\nညီမတို့ BBD က meal plan လေးကို စားရတာ အဆင်ပြေရဲ့လားရှင်။\n\nနောက်လအတွက် Plan လေး ဆက်ယူဖြစ်မလား သိချင်လို့ပါရှင် 🥗✨`;
        }
      } else {
        if (diffDays === 1 || diffDays === 0) {
          shouldNotify = true;
          messageText = `မင်္ဂလာပါ ${customer.full_name} ရှင်၊ ယူထားတဲ့ ${pkg.name} လေးက နောက် ${diffDays === 0 ? 'ဒီနေ့' : diffDays + ' ရက်နေရင်'} ကုန်ပါတော့မယ်။\n\nညီမတို့ BBD က meal plan လေးကို စားရတာ အဆင်ပြေရဲ့လားရှင်။\n\nနောက်ပြီး Plan လေး ဆက်ယူဖြစ်မလား သိချင်လို့ပါရှင် 🥗✨`;
        }
      }

      if (shouldNotify) {
        // Append payment info if exists
        if (paymentInfoText) {
          messageText += `\n\n${paymentInfoText}`;
        }

        let sentViaZernio = false;
        let zernioError = null;

        // Try to send via Zernio automatically
        if (zernioApiKey && pkg.customer_id) {
          try {
            // Find inquiries for this customer to get conversationId
            const { data: inquiries } = await supabaseAdmin.schema('crm')
              .from('inquiries')
              .select('id')
              .eq('customer_id', pkg.customer_id);

            if (inquiries && inquiries.length > 0) {
              const inquiryIds = inquiries.map(i => i.id);
              const { data: prospectMsgs } = await supabaseAdmin.schema('crm')
                .from('inquiries_messages')
                .select('metadata')
                .in('inquiry_id', inquiryIds)
                .eq('sender_type', 'prospect')
                .not('metadata', 'is', null)
                .order('created_at', { ascending: false })
                .limit(1);

              if (prospectMsgs && prospectMsgs.length > 0) {
                const meta = prospectMsgs[0].metadata;
                const conversationId = meta?.message?.conversationId || meta?.conversationId;

                if (conversationId) {
                  const zernioResponse = await fetch(`https://zernio.com/api/v1/inbox/conversations/${conversationId}/messages`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${zernioApiKey}`
                    },
                    body: JSON.stringify({
                      accountId: zernioAccountId,
                      message: messageText
                    })
                  });

                  if (zernioResponse.ok) {
                    sentViaZernio = true;
                    // Save this automated message into the chat history (inquiries_messages) so it appears in the CRM Dashboard
                    try {
                      await supabaseAdmin.schema('crm')
                        .from('inquiries_messages')
                        .insert({
                          inquiry_id: inquiryIds[0],
                          message_text: messageText,
                          sender_type: 'admin', // or 'ai_bot'
                          metadata: { automated_reminder: true, conversationId }
                        });
                    } catch (saveErr) {
                      console.error('[CRON] Failed to save automated message to inquiries_messages:', saveErr.message);
                    }
                  } else {
                    const errObj = await zernioResponse.json();
                    zernioError = errObj.error || 'Zernio API Error';
                  }
                } else {
                  zernioError = 'No Conversation ID found in metadata';
                }
              } else {
                zernioError = 'No prospect messages found to reply to';
              }
            } else {
              zernioError = 'No CRM inquiries found for customer';
            }
          } catch (e) {
            zernioError = e.message;
          }
        } else {
          zernioError = 'Zernio API Key missing or no customer_id';
        }

        const fbLink = customer.facebook_name ? `https://m.me/${encodeURIComponent(customer.facebook_name)}` : 'No FB Link';
        let actionText = sentViaZernio 
          ? `✅ <b>Automated message successfully sent via Zernio!</b>` 
          : `❌ <b>Automated send failed:</b> ${zernioError}. Please remind manually via Dashboard!`;
        
        const message = `🔔 <b>CRM RETENTION ALERT</b> 🔔\n\n` +
          `👤 Customer: <b>${customer.full_name}</b>\n` +
          `📦 Package: <i>${pkg.name} (${pkg.duration})</i>\n\n` +
          `📞 Phone: <b>${customer.phone || 'N/A'}</b>\n` +
          `💬 Facebook: ${fbLink}\n\n` +
          `${actionText} 🥗✨`;
        
        await sendTelegramMessage(ADMIN_CHAT_ID, message);
        notifiedCount++;
      }
    }
    
    console.log(`[CRON] Customer Retention check complete. Processed notifications: ${notifiedCount}`);
    return { success: true, checked: packages.length, notified: notifiedCount };

  } catch (err) {
    console.error('[CRON] Error in CRM retention check:', err);
    return { success: false, error: err.message };
  }
}
