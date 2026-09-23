import { checkAndSendKitchenAlert } from './cron/kitchen_alerts.js';

// Empty the tokens to prevent real dispatches
process.env.TELEGRAM_BOT_TOKEN = '';
process.env.CHEF_CHAT_ID = '';
process.env.ZERNIO_API_KEY = '';

(async () => {
  try {
    const res = await checkAndSendKitchenAlert('2026-09-23');
    console.log('Result:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
})();
