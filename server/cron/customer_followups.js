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
        start_date,
        customers:customer_id ( full_name, phone, facebook_name )
      `)
      .eq('status', 'Active');

    if (error) throw error;
    if (!packages || packages.length === 0) return { checked: 0, notified: 0 };

    let notifiedCount = 0;
    
    for (const pkg of packages) {
      if (!pkg.start_date) continue;
      
      const startDate = new Date(pkg.start_date);
      startDate.setHours(0, 0, 0, 0);
      
      // Calculate difference in days
      const diffTime = todayDateOnly - startDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // We want to trigger at Day 3 and Day 7
      if (diffDays === 3 || diffDays === 7) {
        const cust = pkg.customers;
        const milestone = diffDays === 3 ? 'Day 3 (First Check-in)' : 'Day 7 (Weekly Check-in)';
        const fbLink = cust.facebook_name ? `https://m.me/${encodeURIComponent(cust.facebook_name)}` : 'No FB Link';
        
        const message = `🔔 <b>CRM FOLLOW-UP ALERT</b> 🔔\n\n` +
          `It's <b>${milestone}</b> for <b>${cust.full_name}</b> on their <i>${pkg.name}</i>!\n\n` +
          `📞 Phone: <b>${cust.phone || 'N/A'}</b>\n` +
          `💬 Facebook: ${fbLink}\n\n` +
          `<i>Action: Please call or message them to ask how they are enjoying their diet plan!</i> 🥗✨`;
        
        await sendTelegramMessage(ADMIN_CHAT_ID, message);
        notifiedCount++;
      }
    }
    
    console.log(`[CRON] Customer Follow-up notifications sent: ${notifiedCount}`);
    return { success: true, checked: packages.length, notified: notifiedCount };

  } catch (err) {
    console.error('[CRON] Error in CRM follow-ups check:', err);
    return { success: false, error: err.message };
  }
}
