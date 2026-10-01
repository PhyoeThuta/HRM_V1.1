import express from 'express';
import { lineMiddleware, handleLineEvent } from '../modules/webhooks/controller/lineController.js';

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

export default router;
