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
    }
  } catch (error) {
    console.error('[TELEGRAM ERROR]', error.message);
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
    }
  } catch (error) {
    console.error('[TELEGRAM ERROR]', error.message);
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
        message += `• ${bom.name}: <b>${bom.qty.toLocaleString(undefined, {maximumFractionDigits: 2})} ${bom.uom}</b>\n`;
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
router.post('/webhook', async (req, res) => {
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

        // 3. Fetch Delivery List BEFORE deducting
        let deliveryListStr = '';
        try {
          const { data: packages, error: fetchErr } = await supabaseAdmin.schema('crm')
            .from('customer_packages')
            .select(`
              *,
              customers:customer_id ( 
                full_name, phone, address, delivery_address, delivery_notes,
                customer_health ( allergies, medical_condition, special_requests ),
                customer_lifestyle ( food_restriction )
              )
            `)
            .eq('status', 'Active')
            .gt('meal_count', 0);
            
          if (!fetchErr && packages && packages.length > 0) {
            deliveryListStr = `🚚 <b>DELIVERY ALERT (${packages.length} orders)</b>\n\n`;
            
            for (const pkg of packages) {
              const cust = pkg.customers;
              const address = cust.delivery_address || cust.address || 'No Address';
              
              const restrictions = [];
              const health = cust.customer_health?.[0] || cust.customer_health || {};
              const lifestyle = cust.customer_lifestyle?.[0] || cust.customer_lifestyle || {};
              if (health.allergies && health.allergies !== 'None') restrictions.push(health.allergies);
              if (health.special_requests && health.special_requests !== 'None') restrictions.push(health.special_requests);
              if (lifestyle.food_restriction && lifestyle.food_restriction !== 'None') restrictions.push(lifestyle.food_restriction);
              const restrictionStr = restrictions.join(', ');

              deliveryListStr += `👤 <b>${cust.full_name}</b> [${pkg.meal_type}]\n`;
              deliveryListStr += `📍 ${address}\n`;
              if (cust.phone) deliveryListStr += `📞 ${cust.phone}\n`;
              if (cust.delivery_notes) deliveryListStr += `📝 Notes: ${cust.delivery_notes}\n`;
              if (restrictionStr) deliveryListStr += `⚠️ Special: <b>${restrictionStr}</b>\n`;
              deliveryListStr += `\n`;
              
              // 4. Deduct 1 meal from this package
              await supabaseAdmin.schema('crm')
                .from('customer_packages')
                .update({ meal_count: pkg.meal_count - 1 })
                .eq('id', pkg.id);
            }
          } else {
            deliveryListStr = `🚚 <b>DELIVERY ALERT</b>\n\n<i>No active packages to deliver today.</i>`;
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
