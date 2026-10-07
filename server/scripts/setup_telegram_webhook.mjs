import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = '8688978399:AAGexLrdLble5oFcE2Eu5V7YSJlkxeW3D6U';
const WEBHOOK_URL = 'https://bbd-hrm.aiautono.io/api/webhooks/telegram-rider';
const SECRET_TOKEN = 'mysecretwebhook';

async function setWebhook() {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
  
  console.log('Setting Telegram Webhook to:', WEBHOOK_URL);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        secret_token: SECRET_TOKEN,
        allowed_updates: ['message', 'callback_query']
      })
    });
    
    const data = await response.json();
    console.log('Telegram API Response:', data);
    
    if (data.ok) {
      console.log('✅ Webhook successfully set!');
    } else {
      console.error('❌ Failed to set webhook:', data.description);
    }
  } catch (err) {
    console.error('❌ Error setting webhook:', err);
  }
}

setWebhook();
