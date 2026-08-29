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
        customers:customer_id ( full_name, phone, facebook_name )
      `)
      .eq('status', 'Active');

    if (error) throw error;
    if (!packages || packages.length === 0) return { checked: 0, notified: 0 };

    let notifiedCount = 0;
    
    for (const pkg of packages) {
      if (!pkg.expires_at || !pkg.duration) continue;
      
      const expiresAt = new Date(pkg.expires_at);
      expiresAt.setHours(0, 0, 0, 0);
      
      // Calculate difference in days (expiresAt - today)
      // Positive diffDays means it will expire in the future. Negative means it already expired.
      const diffTime = expiresAt - todayDateOnly;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      const durationLower = pkg.duration.toLowerCase();
      let shouldNotify = false;
      let milestoneTitle = '';
      let actionText = '';

      // Rule 1: 1 Month Plan -> 3 days before expiry (diffDays === 3)
      if (durationLower.includes('month') || durationLower.includes('30 day')) {
        if (diffDays === 3) {
          shouldNotify = true;
          milestoneTitle = 'Renewal Alert (3 Days Left)';
          actionText = 'Plan က နောက် (၃) ရက်နေရင် ကုန်ပါတော့မယ်။ ဆက်ယူဖြစ်မလား / Menu တွေ အဆင်ပြေရဲ့လား သတင်းလှမ်းမေးပေးပါ!';
        }
      } 
      // Rule 2: 1 Week Plan -> 1 day before expiry (diffDays === 1)
      else if (durationLower.includes('week') || durationLower.includes('7 day')) {
        if (diffDays === 1) {
          shouldNotify = true;
          milestoneTitle = 'Renewal Alert (1 Day Left)';
          actionText = 'Plan က မနက်ဖြန်ဆို ကုန်ပါပြီ။ လစဉ် Plan ပြောင်းယူမလား (သို့) 1 Week ပဲ ထပ်ယူမလား သွားမေးပေးပါ!';
        }
      }
      // Rule 3: 1 Day Plan -> 1 day after expiry (diffDays === -1)
      else if (durationLower.includes('1 day') || durationLower.includes('trial')) {
        if (diffDays === -1) {
          shouldNotify = true;
          milestoneTitle = 'Post-Trial Check (1 Day After)';
          actionText = 'မနေ့က 1 Day Plan ယူထားတာလေး စားရတာ အဆင်ပြေရဲ့လား၊ ထပ်ယူဖို့ ရှိလား သတင်းလှမ်းမေးပေးပါ!';
        }
      }

      if (shouldNotify) {
        const cust = pkg.customers;
        const fbLink = cust.facebook_name ? `https://m.me/${encodeURIComponent(cust.facebook_name)}` : 'No FB Link';
        
        const message = `🔔 <b>CRM RETENTION ALERT</b> 🔔\n\n` +
          `<b>${milestoneTitle}</b>\n` +
          `👤 Customer: <b>${cust.full_name}</b>\n` +
          `📦 Package: <i>${pkg.name} (${pkg.duration})</i>\n\n` +
          `📞 Phone: <b>${cust.phone || 'N/A'}</b>\n` +
          `💬 Facebook: ${fbLink}\n\n` +
          `<i>Action: ${actionText}</i> 🥗✨`;
        
        await sendTelegramMessage(ADMIN_CHAT_ID, message);
        notifiedCount++;
      }
    }
    
    console.log(`[CRON] Customer Retention notifications sent: ${notifiedCount}`);
    return { success: true, checked: packages.length, notified: notifiedCount };

  } catch (err) {
    console.error('[CRON] Error in CRM retention check:', err);
    return { success: false, error: err.message };
  }
}
