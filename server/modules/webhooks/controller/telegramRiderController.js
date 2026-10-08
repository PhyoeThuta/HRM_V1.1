import { linkTelegramAccount, editTelegramMessageText } from '../service/telegramRiderService.js';
import { updateRiderStatus } from '../../operations/service/index.js';
import { supabaseAdmin } from '../../../lib/supabase.js';

export async function handleTelegramWebhook(req, res) {
  try {
    const update = req.body;

    // Handle normal text messages
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      // 1. Handle Deep Linking (e.g. /start A7X9B2)
      if (text.startsWith('/start ')) {
        const code = text.replace('/start ', '').trim().toUpperCase();
        await processAccountLink(code, chatId);
        return res.sendStatus(200);
      }

      // 2. Handle Text fallback (e.g. LINK-A7X9B2)
      if (text.startsWith('LINK-')) {
        const code = text.replace('LINK-', '').trim().toUpperCase();
        await processAccountLink(code, chatId);
        return res.sendStatus(200);
      }

      // Basic Echo Bot
      if (text.startsWith('Hello') || text.startsWith('Hi')) {
        await sendTelegramMessageLocal(chatId, `Hello Rider! Your Telegram Chat ID is: <b>${chatId}</b>\nTo link your account, use the link from the Ops Portal.`);
      }

      return res.sendStatus(200);
    }

    // Handle Callback Queries (Inline Button Clicks)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data; // e.g. "deliver_ORDERID"
      const messageId = callbackQuery.message.message_id;
      const chatId = callbackQuery.message.chat.id;

      if (data.startsWith('deliver_')) {
        const orderId = data.replace('deliver_', '');

        // 1. Acknowledge callback to Telegram to stop loading spinner
        answerCallbackQuery(callbackQuery.id, '✅ Processing delivery...');

        // 2. Find the system user ID for this Telegram Chat ID
        const { data: user } = await supabaseAdmin
          .from('sys_users')
          .select('id, full_name')
          .eq('telegram_chat_id', String(chatId))
          .single();

        if (user) {
          try {
            // Update the order status directly from Telegram!
            await updateRiderStatus(orderId, 'DELIVERED', null, user.id);
            
            // Edit original message to show completed text and remove buttons
            const originalText = callbackQuery.message.text || '';
            const newText = `${originalText}\n\n✅ <b>Marked as Delivered by ${user.full_name}</b>`;
            await editTelegramMessageText(chatId, messageId, newText);
          } catch (e) {
            console.error('[TELEGRAM_RIDER_UPDATE_ERROR]', e);
            answerCallbackQuery(callbackQuery.id, '❌ Failed to update status.', true);
          }
        } else {
          answerCallbackQuery(callbackQuery.id, '❌ Unauthorized account.', true);
        }
      }
      return res.sendStatus(200);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error('[TELEGRAM_RIDER_WEBHOOK_ERROR]', error);
    return res.sendStatus(500);
  }
}

// Helper to link account and send reply
async function processAccountLink(code, chatId) {
  // Check if it's a Customer linking their account (Magic Link prefix)
  if (code.startsWith('CUS_')) {
    const customerId = code.replace('CUS_', '');
    
    // Update the customer's telegram_id in the database
    const { data: customer, error } = await supabaseAdmin.schema('crm')
      .from('customers')
      .update({ telegram_id: String(chatId), preferred_channel: 'Telegram' })
      .eq('id', customerId)
      .select('full_name')
      .single();
      
    if (error || !customer) {
      console.error('[TELEGRAM_CUSTOMER_LINK_ERROR]', error);
      await sendTelegramMessageLocal(chatId, `❌ <b>Failed to link account.</b>\nPlease try again or contact support.`);
    } else {
      await sendTelegramMessageLocal(chatId, `✅ <b>ချိတ်ဆက်မှု အောင်မြင်ပါသည်။</b>\nWelcome, ${customer.full_name}! နေ့စဉ် BBD Delivery Alert များနှင့် Menu များကို ဤနေရာမှ ပို့ပေးပါမည်။`);
    }
    return;
  }

  // Fallback to original logic (Rider linking)
  const result = await linkTelegramAccount(code, chatId);
  
  if (result.success) {
    await sendTelegramMessageLocal(chatId, `✅ <b>Account successfully linked!</b>\nWelcome, ${result.user.full_name}. You will now receive order assignments here.`);
  } else {
    await sendTelegramMessageLocal(chatId, `❌ <b>Invalid or expired code.</b>\nPlease check your Dashboard and try again.`);
  }
}

// Local helper to send a simple message without exporting
async function sendTelegramMessageLocal(chatId, text) {
  if (!process.env.TELEGRAM_RIDER_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_RIDER_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (e) {
    console.error('[TELEGRAM_RIDER_REPLY_ERROR]', e);
  }
}

// Local helper to answer callback query (removes loading state from button)
async function answerCallbackQuery(callbackQueryId, text, showAlert = false) {
  if (!process.env.TELEGRAM_RIDER_BOT_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_RIDER_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: showAlert })
    });
  } catch (e) {}
}
