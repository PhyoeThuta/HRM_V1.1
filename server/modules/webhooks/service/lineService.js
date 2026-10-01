import { supabaseAdmin } from '../../../lib/supabase.js';
import { messagingApi } from '@line/bot-sdk';
import dotenv from 'dotenv';
dotenv.config();

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

/**
 * Validates a bot linking code and links the LINE user ID to the corresponding system user.
 * @param {string} code The linking code (e.g., A7X9B2)
 * @param {string} lineUserId The LINE user ID to link
 * @returns {Promise<{success: boolean, user: object, error: string}>}
 */
export async function linkLineAccount(code, lineUserId) {
  try {
    // 1. Find the user with this linking code
    const { data: user, error: findError } = await supabaseAdmin
      .from('sys_users')
      .select('id, full_name, bot_linking_code')
      .eq('bot_linking_code', code)
      .single();

    if (findError || !user) {
      console.warn(`[LINE LINKING] Invalid or expired code: ${code}`);
      return { success: false, error: 'invalid_code' };
    }

    // 2. Update the user with the LINE user ID and clear the code
    const { error: updateError } = await supabaseAdmin
      .from('sys_users')
      .update({ 
        line_user_id: lineUserId,
        bot_linking_code: null // Prevent reuse
      })
      .eq('id', user.id);

    if (updateError) {
      console.error(`[LINE LINKING] Error updating user: ${updateError.message}`);
      return { success: false, error: 'update_failed' };
    }

    return { success: true, user };
  } catch (error) {
    console.error(`[LINE LINKING EXCEPTION]`, error);
    return { success: false, error: 'server_error' };
  }
}

/**
 * Generates a random alphanumeric code of specified length.
 */
function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded I, 1, O, 0 for readability
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generates and assigns a new bot linking code to a user.
 * @param {string} userId The system user ID
 * @returns {Promise<string>} The generated code
 */
export async function generateBotLinkingCode(userId) {
  const newCode = generateRandomCode(6);
  
  const { error } = await supabaseAdmin
    .from('sys_users')
    .update({ bot_linking_code: newCode })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to generate linking code: ${error.message}`);
  }
  
  return newCode;
}

/**
 * Sends a beautiful Flex Message to the Rider when an order is assigned.
 * @param {string} riderSysUserId The sys_users ID of the Rider
 * @param {object} orderData The order details
 */
export async function sendOrderAssignmentToLine(riderSysUserId, orderData) {
  try {
    // 1. Fetch the LINE User ID from sys_users
    const { data: user, error: findError } = await supabaseAdmin
      .from('sys_users')
      .select('line_user_id')
      .eq('id', riderSysUserId)
      .single();

    if (findError || !user || !user.line_user_id) {
      console.log(`[LINE NOTIFICATION] Rider ${riderSysUserId} does not have a linked LINE account.`);
      return { success: false, reason: 'not_linked' };
    }

    // 2. Build the Flex Message Card
    const flexMessage = {
      type: 'flex',
      altText: `New Order Assigned: #${orderData.orderId || 'BBD-XXX'}`,
      contents: {
        type: 'bubble',
        size: 'mega',
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '📦 NEW ORDER ASSIGNED',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ],
          backgroundColor: '#06C755',
          paddingAll: '15px'
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: `Order #${orderData.orderId || 'BBD-XXX'}`,
              weight: 'bold',
              size: 'xl',
              margin: 'md'
            },
            {
              type: 'text',
              text: `Customer: ${orderData.customerName || 'Unknown'}`,
              size: 'sm',
              color: '#666666',
              margin: 'sm'
            },
            {
              type: 'separator',
              margin: 'lg'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '📍 Address',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 2
                    },
                    {
                      type: 'text',
                      text: orderData.deliveryAddress || 'Not specified',
                      wrap: true,
                      color: '#333333',
                      size: 'sm',
                      flex: 5
                    }
                  ]
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '📞 Phone',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 2
                    },
                    {
                      type: 'text',
                      text: orderData.phone || 'Not specified',
                      wrap: true,
                      color: '#333333',
                      size: 'sm',
                      flex: 5
                    }
                  ]
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: [
            {
              type: 'button',
              style: 'primary',
              height: 'sm',
              color: '#06C755',
              action: {
                type: 'uri',
                label: '🚀 Pick Up Order',
                uri: `https://bbd-hrm.aiautono.io/operations/rider?auto_pickup=true&order_id=${orderData.orderId}`
              }
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              color: '#eeeeee',
              action: {
                type: 'postback',
                label: '✅ Mark Delivered',
                data: `action=status_update&order_id=${orderData.orderId}&status=DELIVERED`,
                displayText: 'I have delivered the order!'
              }
            }
          ],
          flex: 0
        }
      }
    };

    // 3. Send the message
    await client.pushMessage({
      to: user.line_user_id,
      messages: [flexMessage]
    });

    console.log(`[LINE NOTIFICATION] Successfully sent order assignment to ${user.line_user_id}`);
    return { success: true };
  } catch (error) {
    console.error(`[LINE NOTIFICATION ERROR]`, error.message);
    return { success: false, error: error.message };
  }
}
