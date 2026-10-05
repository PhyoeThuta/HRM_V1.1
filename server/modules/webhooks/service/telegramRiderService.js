import { supabaseAdmin } from '../../../lib/supabase.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../middleware/auth.js';

dotenv.config();

const getTelegramApi = () => `https://api.telegram.org/bot${process.env.TELEGRAM_RIDER_BOT_TOKEN}`;

/**
 * Validates a bot linking code and links the Telegram chat ID to the corresponding system user.
 * @param {string} code The linking code (e.g., A7X9B2)
 * @param {string|number} telegramChatId The Telegram Chat ID to link
 * @returns {Promise<{success: boolean, user: object, error: string}>}
 */
export async function linkTelegramAccount(code, telegramChatId) {
  try {
    // 1. Find the user with this linking code
    const { data: user, error: findError } = await supabaseAdmin
      .from('sys_users')
      .select('id, full_name, bot_linking_code')
      .eq('bot_linking_code', code)
      .single();

    if (findError || !user) {
      console.warn(`[TELEGRAM LINKING] Invalid or expired code: ${code}`);
      return { success: false, error: 'invalid_code' };
    }

    // 2. Update the user with the Telegram Chat ID and clear the code
    const { error: updateError } = await supabaseAdmin
      .from('sys_users')
      .update({ 
        telegram_chat_id: String(telegramChatId),
        bot_linking_code: null // Prevent reuse
      })
      .eq('id', user.id);

    if (updateError) {
      console.error(`[TELEGRAM LINKING] Error updating user: ${updateError.message}`);
      return { success: false, error: 'update_failed' };
    }

    return { success: true, user };
  } catch (error) {
    console.error(`[TELEGRAM LINKING EXCEPTION]`, error);
    return { success: false, error: 'server_error' };
  }
}

/**
 * Utility to send a message via Telegram
 */
export async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  if (!process.env.TELEGRAM_RIDER_BOT_TOKEN) {
    console.warn('[TELEGRAM RIDER] Token missing. Skipping message.');
    return;
  }
  try {
    const payload = { chat_id: chatId, text, parse_mode: 'HTML' };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    const response = await fetch(`${getTelegramApi()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TELEGRAM RIDER ERROR]', errorData);
      throw new Error(JSON.stringify(errorData));
    }
  } catch (error) {
    console.error('[TELEGRAM RIDER ERROR]', error.message);
    throw error;
  }
}

/**
 * Utility to edit an existing message (e.g., to remove buttons)
 */
export async function editTelegramMessageText(chatId, messageId, text) {
  try {
    const payload = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: [] } // Remove buttons
    };
    const response = await fetch(`${getTelegramApi()}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TELEGRAM RIDER EDIT ERROR]', errorData);
      throw new Error(JSON.stringify(errorData));
    }
  } catch (error) {
    console.error('[TELEGRAM RIDER EDIT ERROR]', error.message);
    throw error;
  }
}

export async function sendTelegramPhoto(chatId, photoUrl, caption, replyMarkup = null) {
  if (!process.env.TELEGRAM_RIDER_BOT_TOKEN) {
    console.warn('[TELEGRAM RIDER] Token missing. Skipping message.');
    return;
  }
  try {
    const payload = { chat_id: chatId, photo: photoUrl, caption, parse_mode: 'HTML' };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }
    const response = await fetch(`${getTelegramApi()}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TELEGRAM RIDER ERROR]', errorData);
      throw new Error(JSON.stringify(errorData));
    }
  } catch (error) {
    console.error('[TELEGRAM RIDER ERROR]', error.message);
    throw error;
  }
}

/**
 * Sends a well-formatted message to the Rider when an order is assigned.
 * @param {string} riderSysUserId The sys_users ID of the Rider
 * @param {object} orderData The order details
 */
export async function sendOrderAssignmentToTelegram(riderSysUserId, orderData) {
  try {
    // 1. Fetch the Telegram Chat ID from sys_users
    const { data: user, error: findError } = await supabaseAdmin
      .from('sys_users')
      .select('telegram_chat_id')
      .eq('id', riderSysUserId)
      .single();

    if (findError || !user || !user.telegram_chat_id) {
      console.log(`[TELEGRAM NOTIFICATION] Rider ${riderSysUserId} does not have a linked Telegram account.`);
      return { success: false, reason: 'not_linked' };
    }

    // Generate Magic Link Token (valid for 30 days)
    const magicToken = jwt.sign({ id: riderSysUserId, purpose: 'magic_link' }, JWT_SECRET, { expiresIn: '30d' });
    const redirectUrl = `/operations/rider?auto_pickup=true&order_id=${orderData.orderId}`;
    const magicUri = `https://bbd-hrm.aiautono.io/api/auth/magic-link?token=${magicToken}&redirect=${encodeURIComponent(redirectUrl)}`;

    // 2. Build the Message Text (Using Blockquotes and Code blocks for a Card-like feel)
    const text = `🚚 <b>NEW ORDER ASSIGNED</b>\n\n` +
                 `<blockquote>` +
                 `<b>Order ID:</b> <code>#${orderData.orderId || 'BBD-XXX'}</code>\n` +
                 `<b>Customer:</b> ${orderData.customerName || 'Unknown'}\n` +
                 `<b>Phone:</b> ${orderData.phone || 'Not specified'}\n` +
                 `</blockquote>\n\n` +
                 `📍 <b>Delivery Address:</b>\n` +
                 `<code>${orderData.deliveryAddress || 'Not specified'}</code>`;

    // 3. Build Inline Keyboard
    const replyMarkup = {
      inline_keyboard: [
        [
          { text: '📍 Open Map', url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(orderData.deliveryAddress || '')}` }
        ],
        [
          { text: '🚀 Pick Up Order (Open App)', url: magicUri }
        ],
        [
          { text: '✅ Mark Delivered', callback_data: `deliver_${orderData.orderId}` }
        ]
      ]
    };

    // 4. Send the message with a visually appealing banner image
    const bannerUrl = 'https://images.unsplash.com/photo-1617865916962-d9e8df457c15?q=80&w=800&auto=format&fit=crop';
    await sendTelegramPhoto(user.telegram_chat_id, bannerUrl, text, replyMarkup);

    console.log(`[TELEGRAM NOTIFICATION] Successfully sent order assignment to ${user.telegram_chat_id}`);
    return { success: true };
  } catch (error) {
    console.error(`[TELEGRAM NOTIFICATION ERROR]`, error.message);
    return { success: false, error: error.message };
  }
}
