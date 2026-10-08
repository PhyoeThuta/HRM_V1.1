import { middleware, messagingApi } from '@line/bot-sdk';
import dotenv from 'dotenv';
import { linkLineAccount } from '../service/lineService.js';
import { updateRiderStatus } from '../../operations/service/index.js';
import { supabaseAdmin } from '../../../lib/supabase.js';
dotenv.config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

export const lineMiddleware = middleware(config);

const client = new messagingApi.MessagingApiClient({
  channelAccessToken: config.channelAccessToken
});

export async function handleLineEvent(event) {
  const userId = event.source.userId;

  // Handle Button Clicks (Postback)
  if (event.type === 'postback') {
    const data = new URLSearchParams(event.postback.data);
    const action = data.get('action');
    const orderId = data.get('order_id');
    const status = data.get('status');

    if (action === 'status_update') {
      try {
        // Find the system user ID for this LINE user
        const { data: user } = await supabaseAdmin
          .from('sys_users')
          .select('id')
          .eq('line_user_id', userId)
          .single();
        
        if (user) {
          // Update the order status directly from LINE!
          await updateRiderStatus(orderId, status, null, user.id);
          
          let statusText = status === 'ON_THE_WAY' ? '🚀 Picked Up & On the way!' : '✅ Delivered!';
          return client.replyMessage({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: `Order #${orderId} status updated to: ${statusText}` }]
          });
        }
      } catch (e) {
        console.error('[LINE_POSTBACK_ERROR]', e);
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: '❌ Failed to update order status. Please try again later.' }]
        });
      }
    }
  }

  // Handle Text Messages
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const text = event.message.text.trim();

  // Basic Echo Bot for testing the connection
  if (text.startsWith('Hello') || text.startsWith('Hi')) {
    return client.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: `Hello Rider! Your LINE ID is: ${userId}\nTo link your account, type: LINK-YOURCODE`
      }]
    });
  }
  
  if (text.startsWith('LINK-') || text.startsWith('#LINK-')) {
    // Extract the code (e.g. from "#LINK-CUS_A7X9B2" -> "CUS_A7X9B2")
    const codeStr = text.replace('#LINK-', '').replace('LINK-', '').trim().toUpperCase();
    
    // Check if it's a Customer (Magic Link prefix)
    if (codeStr.startsWith('CUS_')) {
      const customerId = codeStr.replace('CUS_', '');
      
      const { data: customer, error } = await supabaseAdmin.schema('crm')
        .from('customers')
        .update({ line_id: String(userId), preferred_channel: 'LINE' })
        .eq('id', customerId)
        .select('full_name')
        .single();
        
      if (error || !customer) {
        console.error('[LINE_CUSTOMER_LINK_ERROR]', error);
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: `❌ Failed to link account. Please try again or contact support.` }]
        });
      } else {
        return client.replyMessage({
          replyToken: event.replyToken,
          messages: [{ type: 'text', text: `✅ ချိတ်ဆက်မှု အောင်မြင်ပါသည်။ Welcome, ${customer.full_name}! နေ့စဉ် BBD Delivery Alert များနှင့် Menu များကို ဤနေရာမှ ပို့ပေးပါမည်။` }]
        });
      }
    }

    // Call the database service to bind the user (Rider Fallback)
    const result = await linkLineAccount(codeStr, userId);

    if (result.success) {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: `✅ Account successfully linked! Welcome, ${result.user.full_name}. You will now receive order notifications here.`
        }]
      });
    } else {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: `❌ Invalid or expired code. Please check your Dashboard and try again.`
        }]
      });
    }
  }

  // Fallback
  return client.replyMessage({
    replyToken: event.replyToken,
    messages: [{
      type: 'text',
      text: 'Sorry, I did not understand that command. Try "Hi".'
    }]
  });
}
