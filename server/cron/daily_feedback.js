import cron from 'node-cron';
import { supabaseAdmin } from '../lib/supabase.js';

export async function checkAndNotifyDailyFeedback() {
  console.log('[CRON] Starting daily feedback check...');
  let count = 0;
  
  try {
    // 1. Get today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // 2. Fetch all customers with an active package today
    // Meaning start_date <= today and end_date >= today and status in ('Active', 'Upcoming')
    const { data: activePackages, error: pkgError } = await supabaseAdmin
      .schema('crm')
      .from('customer_packages')
      .select('customer_id, customers(id, full_name, platform_id)')
      .lte('start_date', today)
      .gte('expires_at', today)
      .in('status', ['Active', 'Upcoming']);

    if (pkgError) throw pkgError;
    if (!activePackages || activePackages.length === 0) {
      console.log('[CRON] No active customers for today. Skipping daily feedback.');
      return { success: true, count: 0 };
    }

    // Filter customers who have a valid telegram platform_id (Zernio)
    const customersToNotify = [];
    for (const p of activePackages) {
      const c = p.customers;
      if (c && c.platform_id) {
        customersToNotify.push(c);
      } else if (c) {
        console.warn(`[CRON-WARNING] Customer ${c.full_name} (ID: ${c.id}) has no platform_id. Feedback form will NOT be sent.`);
      }
    }

    // 3. For each customer, generate a unique link and send Zernio message
    for (const customer of customersToNotify) {
      try {
        // Link: e.g. https://hrm.duolinkmm.com/daily-feedback/[customer_id]?date=YYYY-MM-DD
        const domain = process.env.FRONTEND_URL || 'http://localhost:5173';
        const link = `${domain}/daily-feedback/${customer.id}?date=${today}`;
        
        const messageText = `Hi ${customer.full_name}, we hope you enjoyed your meals today! 🍲\n\nPlease let us know your feedback on today's menu by clicking the link below. Your ratings help us improve our quality! 👇\n\n${link}`;

        // Send message via Zernio API (Assuming standard POST request to Zernio endpoint, similar to emitInquiryMessage logic, but direct)
        // Here we'll just log it for the demo, or if you have a sendZernioMessage helper, we can use it.
        const response = await fetch('https://api.zernio.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`
          },
          body: JSON.stringify({
            account_id: process.env.ZERNIO_ACCOUNT_ID,
            to: customer.platform_id,
            type: 'text',
            text: messageText
          })
        });

        if (!response.ok) {
          const errText = await response.text();
          console.error(`[CRON] Failed to send to ${customer.full_name}:`, errText);
        } else {
          count++;
        }
      } catch (err) {
        console.error(`[CRON] Error notifying ${customer?.full_name}:`, err.message);
      }
    }

    console.log(`[CRON] Successfully sent daily feedback forms to ${count} customers.`);
    return { success: true, count };
  } catch (error) {
    console.error('[CRON] Daily feedback cron failed:', error);
    return { success: false, error: error.message };
  }
}

// Start cron job (runs every day at 21:00 / 9:00 PM Thai Time)
export function startDailyFeedbackCron() {
  cron.schedule('0 21 * * *', checkAndNotifyDailyFeedback, {
    scheduled: true,
    timezone: 'Asia/Bangkok'
  });
  console.log('[CRON] Scheduled daily feedback notifications for 21:00 (Asia/Bangkok)');
}
