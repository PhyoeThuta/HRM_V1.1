import cron from 'node-cron';
import { supabaseAdmin } from '../lib/supabase.js';
import { notificationRouter } from '../modules/webhooks/service/notificationRouter.js';

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

    // 3. For each customer, route via notificationRouter
    for (const customer of activePackages.map(p => p.customers).filter(Boolean)) {
      try {
        await notificationRouter.sendFeedbackNotification(customer.id, customer.full_name, today);
        count++;
      } catch (err) {
        console.error(`[CRON] Error notifying ${customer?.full_name}:`, err.message);
        throw err;
      }
    }

    console.log(`[CRON] Successfully sent daily feedback forms to ${count} customers.`);
    return { success: true, count };
  } catch (error) {
    console.error('[CRON] Daily feedback cron failed:', error);
    throw error;
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
