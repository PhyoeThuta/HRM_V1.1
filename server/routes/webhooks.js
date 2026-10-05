import express from 'express';
import { lineMiddleware, handleLineEvent } from '../modules/webhooks/controller/lineController.js';
import { handleTelegramWebhook } from '../modules/webhooks/controller/telegramRiderController.js';

const router = express.Router();

// Webhook for LINE Messaging API
// The middleware verifies the signature, so it MUST be used before parsing body to JSON.
router.post('/line', lineMiddleware, async (req, res) => {
  try {
    const events = req.body.events;
    if (!events || events.length === 0) {
      return res.status(200).send('OK');
    }
    
    // Process all events sequentially
    for (const event of events) {
      await handleLineEvent(event);
    }
    
    res.status(200).end();
  } catch (err) {
    console.error('[LINE WEBHOOK ERROR]', err);
    res.status(500).end();
  }
});

// Webhook for Telegram Rider Bot
router.post('/telegram-rider', express.json(), (req, res, next) => {
  const webhookSecret = process.env.TELEGRAM_RIDER_WEBHOOK_SECRET;
  if (webhookSecret) {
    const incomingSecret = req.headers['x-telegram-bot-api-secret-token'];
    if (incomingSecret !== webhookSecret) {
      console.warn('[TELEGRAM RIDER WEBHOOK] Unauthorized request. IP:', req.ip);
      return res.sendStatus(401);
    }
  }
  next();
}, handleTelegramWebhook);

export default router;
