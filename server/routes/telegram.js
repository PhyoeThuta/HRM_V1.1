import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHEF_CHAT_ID = process.env.CHEF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const DELIVERY_CHAT_ID = process.env.DELIVERY_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// Utility to send a message via Telegram
async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  if (!TELEGRAM_TOKEN || !chatId) {
    console.warn('[TELEGRAM] Token or Chat ID missing. Skipping message.');
    return;
  }
  try {
    const payload = { chat_id: chatId, text, parse_mode: 'HTML' };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TELEGRAM ERROR]', errorData);
      throw new Error(JSON.stringify(errorData));
    }
  } catch (error) {
    console.error('[TELEGRAM ERROR]', error.message);
    throw error;
  }
}

// Utility to update an existing message (e.g. to remove the inline button)
async function editTelegramMessageText(chatId, messageId, text) {
  try {
    const payload = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [] } // Remove buttons
    };
    const response = await fetch(`${TELEGRAM_API}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TELEGRAM ERROR]', errorData);
      throw new Error(JSON.stringify(errorData));
    }
  } catch (error) {
    console.error('[TELEGRAM ERROR]', error.message);
    throw error;
  }
}

// POST /api/telegram/send-to-chef
router.post('/send-to-chef', async (req, res) => {
  try {
    const { targetDate, dailyMenus, aggregatedBOM } = req.body;

    if (!targetDate) {
      return res.status(400).json({ error: 'targetDate is required' });
    }

    let message = `👨‍🍳 <b>CHEF ALERTS: Menu for ${targetDate}</b>\n\n`;

    // 1. Format Daily Menus
    if (dailyMenus && dailyMenus.length > 0) {
      dailyMenus.forEach(dm => {
        message += `<b>[${dm.meal_type}]</b> ${dm.with_rice ? '🍚 (with rice)' : ''}\n`;
        if (dm.menu_types) {
          dm.menu_types.forEach(mt => {
            message += `• ${mt.menu.name_en} ${mt.menu.name_mm ? `(${mt.menu.name_mm})` : ''}\n`;
          });
        }
        message += '\n';
      });
    } else {
      message += `<i>No menus scheduled for today.</i>\n\n`;
    }

    // 2. Format Required Ingredients (BOM)
    message += `🛒 <b>REQUIRED INGREDIENTS (BOM)</b>\n`;
    if (aggregatedBOM && aggregatedBOM.length > 0) {
      aggregatedBOM.forEach(bom => {
        const bomName = bom.name_mm ? `${bom.name} (${bom.name_mm})` : bom.name;
        message += `• ${bomName}: <b>${bom.qty.toLocaleString(undefined, {maximumFractionDigits: 2})} ${bom.uom}</b>\n`;
      });
    } else {
      message += `<i>No ingredients needed today.</i>\n`;
    }

    // Prepare Inline Button
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: '✅ ချက်ပြုတ်ပြီးစီးပါပြီ (Finish Cooking)', callback_data: `finish_cooking_${targetDate}` }
        ]
      ]
    };

    await sendTelegramMessage(CHEF_CHAT_ID, message, replyMarkup);

    return res.json({ success: true, message: 'Alert sent to Chef successfully via Telegram.' });
  } catch (error) {
    console.error('[TELEGRAM SEND TO CHEF]', error);
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/telegram/webhook
// Security: Telegram will send a secret token in the header if configured via setWebhook.
// Set TELEGRAM_WEBHOOK_SECRET in .env and pass it when calling:
//   setWebhook?url=...&secret_token=TELEGRAM_WEBHOOK_SECRET
router.post('/webhook', (req, res, next) => {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret) {
    const incomingSecret = req.headers['x-telegram-bot-api-secret-token'];
    if (incomingSecret !== webhookSecret) {
      console.warn('[TELEGRAM WEBHOOK] Unauthorized request — invalid or missing secret token. IP:', req.ip);
      return res.sendStatus(401);
    }
  } else {
    // Log a warning if secret is not configured — do NOT block in case the server hasn't set it yet,
    // but operators should configure this as soon as possible.
    console.warn('[TELEGRAM WEBHOOK] ⚠️ TELEGRAM_WEBHOOK_SECRET is not set! Webhook is unprotected. Set this in .env immediately.');
  }
  next();
}, async (req, res) => {
  try {
    const update = req.body;

    // Handle normal text messages (e.g. for fetching Chat ID)
    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;
      if (text.startsWith('/getid')) {
        await sendTelegramMessage(chatId, `The Chat ID for this group is: <b>${chatId}</b>`);
      }
      return res.sendStatus(200);
    }

    // Handle Callback Queries (Inline Button Clicks)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data; // e.g. "finish_cooking_2026-07-11"
      const messageId = callbackQuery.message.message_id;
      const chatId = callbackQuery.message.chat.id;
      const fromUser = callbackQuery.from.first_name || 'Chef';

      if (data.startsWith('finish_cooking_')) {
        const targetDate = data.replace('finish_cooking_', '');

        // 1. Acknowledge callback to Telegram immediately
        fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: callbackQuery.id,
            text: '✅ Processing...'
          })
        }).catch(() => {});

        // 2. Edit original Chef message to hide button and show completed text immediately
        const originalText = callbackQuery.message.text || '';
        // Note: Telegram sends back raw text, so we wrap it
        const newText = `${originalText}\n\n✅ <b>Completed by ${fromUser}</b>`;
        await editTelegramMessageText(chatId, messageId, newText);

        // 3. Fetch Delivery List from operations_orders for targetDate, falling back to customer_packages
        let deliveryListStr = '';
        try {
          // Fetch today's orders
          const { data: todayOrders } = await supabaseAdmin
            .from('operations_orders')
            .select(`
              *,
              daily_menus:daily_menu_id ( meal_type )
            `)
            .eq('date', targetDate);

          const customerIds = [...new Set(todayOrders?.map(o => o.customer_id).filter(Boolean) || [])];

          let customersMap = {};
          if (customerIds.length > 0) {
            const { data: custs } = await supabaseAdmin.schema('crm')
              .from('customers')
              .select(`
                *,
                customer_health ( allergies, medical_condition, special_requests ),
                customer_lifestyle ( food_restriction )
              `)
              .in('id', customerIds);
            if (custs) customersMap = Object.fromEntries(custs.map(c => [c.id, c]));
          }

          const { data: packages } = await supabaseAdmin.schema('crm')
            .from('customer_packages')
            .select('*')
            .or(`status.eq.Active,status.eq.ACTIVE,payment_status.eq.Paid`);

          const pkgMap = Object.fromEntries((packages || []).map(p => [p.customer_id, p]));

          if (todayOrders && todayOrders.length > 0) {
            // Group orders by customer
            const groupedCustOrders = {};
            todayOrders.forEach(o => {
              if (!groupedCustOrders[o.customer_id]) {
                groupedCustOrders[o.customer_id] = {
                  customer: customersMap[o.customer_id] || { full_name: 'Customer' },
                  pkg: pkgMap[o.customer_id] || null,
                  meals: []
                };
              }
              if (o.daily_menus?.meal_type) {
                groupedCustOrders[o.customer_id].meals.push(o.daily_menus.meal_type);
              }
            });

            const custEntries = Object.values(groupedCustOrders);
            deliveryListStr = `🚚 <b>DELIVERY ALERT (${custEntries.length} orders)</b>\n\n`;

            for (const item of custEntries) {
              const cust = item.customer;
              const pkg = item.pkg;
              const address = cust.delivery_address || cust.address || 'No Address';
              const mealTypeStr = item.meals.length > 0 ? [...new Set(item.meals)].join(' & ') : (pkg?.meal_type || 'Lunch & Dinner');

              const restrictions = [];
              const health = cust.customer_health?.[0] || cust.customer_health || {};
              const lifestyle = cust.customer_lifestyle?.[0] || cust.customer_lifestyle || {};
              if (health.allergies && health.allergies !== 'None') restrictions.push(health.allergies);
              if (health.special_requests && health.special_requests !== 'None') restrictions.push(health.special_requests);
              if (lifestyle.food_restriction && lifestyle.food_restriction !== 'None') restrictions.push(lifestyle.food_restriction);
              const restrictionStr = restrictions.join(', ');

              deliveryListStr += `👤 <b>${cust.full_name}</b> [${mealTypeStr}]\n`;
              deliveryListStr += `📍 ${address}\n`;
              if (cust.phone) deliveryListStr += `📞 ${cust.phone}\n`;
              if (cust.delivery_notes) deliveryListStr += `📝 Notes: ${cust.delivery_notes}\n`;
              if (restrictionStr) deliveryListStr += `⚠️ Special: <b>${restrictionStr}</b>\n`;
              deliveryListStr += `\n`;

              // Deduct meal count if package exists
              if (pkg && pkg.meal_count > 0) {
                await supabaseAdmin.schema('crm')
                  .from('customer_packages')
                  .update({ meal_count: pkg.meal_count - 1 })
                  .eq('id', pkg.id);
              }
            }
          } else {
            deliveryListStr = `🚚 <b>DELIVERY ALERT</b>\n\n<i>No active orders to deliver today.</i>`;
          }
        } catch (dbErr) {
          console.error('[TELEGRAM WEBHOOK DB ERROR]', dbErr);
          deliveryListStr = `⚠️ Error generating delivery list: ${dbErr.message}`;
        }

        // 5. Send Alert to Delivery Group
        await sendTelegramMessage(DELIVERY_CHAT_ID, deliveryListStr);
      }
      return res.sendStatus(200);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('[TELEGRAM WEBHOOK ERROR]', error);
    return res.sendStatus(500);
  }
});

export default router;
