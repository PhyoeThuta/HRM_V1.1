import { supabaseAdmin } from '../../../lib/supabase.js';
import { messagingApi } from '@line/bot-sdk';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../middleware/auth.js';
dotenv.config();

const riderAssignmentCache = new Map();

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
  const cacheKey = `rider_assign_${riderSysUserId}_${orderData.customerName}`;
  if (riderAssignmentCache.has(cacheKey)) {
    console.log(`[LINE RIDER] Debounced duplicate assignment for ${cacheKey}`);
    return { success: true, reason: 'debounced' };
  }
  riderAssignmentCache.set(cacheKey, true);
  setTimeout(() => riderAssignmentCache.delete(cacheKey), 60000);

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

    // Generate Magic Link Token (valid for 30 days)
    const magicToken = jwt.sign({ id: riderSysUserId, purpose: 'magic_link' }, JWT_SECRET, { expiresIn: '30d' });
    const redirectUrl = `/operations/rider?auto_pickup=true&order_id=${orderData.orderId}`;
    const magicUri = `https://bbd-hrm.aiautono.io/api/auth/magic-link?token=${magicToken}&redirect=${encodeURIComponent(redirectUrl)}`;

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
                uri: magicUri
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

// ==========================================
// CUSTOMER LINE NOTIFICATIONS (FLEX MESSAGES)
// ==========================================

export async function sendCustomerDeliveryAlertToLine(lineUserId, orderData) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://bbd-hrm.aiautono.io';
    const trackLink = `${frontendUrl}/track/${orderData.orderId}`;
    const feedbackLink = `${frontendUrl}/feedback/${orderData.customerId}`;
    const isDelivered = orderData.status === 'DELIVERED';
    
    const flexMessage = {
      type: 'flex',
      altText: isDelivered ? '✅ သင့် အစားအသောက် ရောက်ရှိပါပြီ' : '🚚 သင့် အစားအသောက် လာပို့နေပါပြီ',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: isDelivered ? '#06C755' : '#FF9900',
          contents: [
            {
              type: 'text',
              text: isDelivered ? '✅ DELIVERED' : '🚚 ON THE WAY',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        ...(isDelivered ? {
          hero: {
            type: 'image',
            url: orderData.proofUrl || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover'
          }
        } : {}),
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: isDelivered ? 'ရောက်ပါပြီရှင့်! 🍽️' : 'လာပို့နေပါပြီရှင့်! 🛵',
              weight: 'bold',
              size: 'xl'
            },
            {
              type: 'text',
              text: isDelivered 
                ? `မင်္ဂလာပါ ${orderData.customerName}၊\nယနေ့အတွက် နေ့လယ်စာ/ညစာလေး ပို့ဆောင်ပေးပြီးပါပြီ။\nအရသာနဲ့ ပတ်သက်ပြီးဖြစ်စေ၊ Delivery နဲ့ ပတ်သက်ပြီးဖြစ်စေ၊ အထွေထွေကိစ္စတွေအတွက်ဖြစ်စေ အကြံပြုလိုပါက (သို့မဟုတ်) တိုင်ကြားလိုပါက အောက်ပါ Link လေးမှတစ်ဆင့် ဝင်ရောက်ရေးသားနိုင်ပါတယ်ရှင့် 👇` 
                : `မင်္ဂလာပါ ${orderData.customerName}၊\nသင့် အစားအသောက်များ ယခု စတင်ထွက်ခွာလာပါပြီ။`,
              wrap: true,
              color: '#666666',
              size: 'sm'
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          spacing: 'sm',
          contents: isDelivered ? [
            {
              type: 'button',
              style: 'primary',
              color: '#06C755',
              action: {
                type: 'uri',
                label: '📝 အကြံပြု / တိုင်ကြားရန်',
                uri: feedbackLink
              }
            }
          ] : [
            {
              type: 'button',
              style: 'primary',
              color: '#FF9900',
              action: {
                type: 'uri',
                label: '📍 Live Tracking ကြည့်ရန်',
                uri: trackLink
              }
            }
          ]
        }
      }
    };

    await client.pushMessage({ to: lineUserId, messages: [flexMessage] });
  } catch (error) {
    console.error(`[LINE CUSTOMER DELIVERY ERROR]`, error.message);
  }
}

export async function sendCustomerFeedbackToLine(lineUserId, data) {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://bbd-hrm.aiautono.io';
    const feedbackLink = `${frontendUrl}/feedback/${data.customerId}?token=${data.token}`;
    
    const flexMessage = {
      type: 'flex',
      altText: '📝 BBD Menu Feedback',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#4B5563',
          contents: [
            {
              type: 'text',
              text: '⭐ DAILY FEEDBACK',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'အရသာ ဘယ်လိုနေလဲရှင့်?',
              weight: 'bold',
              size: 'xl'
            },
            {
              type: 'text',
              text: `ယနေ့အတွက် BBD ရဲ့ အစားအသောက်နဲ့ ဝန်ဆောင်မှုအပေါ် သဘောထားလေးကို မှတ်ချက်ပေးလို့ရပါတယ်ရှင့်။`,
              wrap: true,
              color: '#666666',
              size: 'sm'
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#4B5563',
              action: {
                type: 'uri',
                label: '📝 Feedback ပေးရန်',
                uri: feedbackLink
              }
            }
          ]
        }
      }
    };
    await client.pushMessage({ to: lineUserId, messages: [flexMessage] });
  } catch (error) {
    console.error(`[LINE CUSTOMER FEEDBACK ERROR]`, error.message);
  }
}

export async function sendCustomerRenewalToLine(lineUserId, data) {
  try {
    const flexMessage = {
      type: 'flex',
      altText: '⏳ Package သက်တမ်းကုန်ဆုံးရန် နီးကပ်နေပါပြီ',
      contents: {
        type: 'bubble',
        header: {
          type: 'box',
          layout: 'vertical',
          backgroundColor: '#EF4444',
          contents: [
            {
              type: 'text',
              text: '⏳ EXPIRING SOON',
              color: '#ffffff',
              weight: 'bold',
              size: 'sm'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Package သက်တမ်းကုန်တော့မည်',
              weight: 'bold',
              size: 'lg'
            },
            {
              type: 'text',
              text: `မင်္ဂလာပါ ${data.customerName}၊\nလူကြီးမင်းယူထားသော BBD Package သက်တမ်းသည် ${data.expireDateStr} တွင် ကုန်ဆုံးမည်ဖြစ်ပါသဖြင့် ဆက်လက်မှာယူလိုပါက Admin သို့ ဆက်သွယ်နိုင်ပါသည်ရှင့် 💖`,
              wrap: true,
              color: '#666666',
              size: 'sm'
            }
          ]
        }
      }
    };
    await client.pushMessage({ to: lineUserId, messages: [flexMessage] });
  } catch (error) {
    console.error(`[LINE CUSTOMER RENEWAL ERROR]`, error.message);
  }
}
