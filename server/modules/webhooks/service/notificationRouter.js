import { supabaseAdmin } from '../../../lib/supabase.js';
import { sendCustomerDeliveryAlertToLine, sendCustomerFeedbackToLine, sendCustomerRenewalToLine } from './lineService.js';
import { sendCustomerDeliveryAlertToTelegram, sendCustomerFeedbackToTelegram, sendCustomerRenewalToTelegram } from './telegramRiderService.js';
import { sendDeliveryZernioMessage } from '../../operations/service/index.js';
import fetch from 'node-fetch';

/**
 * Main router for sending messages to customers based on their preferred channel.
 */
export const notificationRouter = {
  
  async sendDeliveryNotification(customerId, orderId, status, proofUrl) {
    try {
      const { data: customer } = await supabaseAdmin.schema('crm')
        .from('customers')
        .select('full_name, preferred_channel, line_id, telegram_id, zernio_conversation_id')
        .eq('id', customerId)
        .single();
        
      if (!customer) return;

      const orderData = {
        orderId,
        status,
        proofUrl,
        customerName: customer.full_name
      };

      if (customer.preferred_channel === 'LINE' && customer.line_id) {
        await sendCustomerDeliveryAlertToLine(customer.line_id, orderData);
      } 
      else if (customer.preferred_channel === 'Telegram' && customer.telegram_id) {
        await sendCustomerDeliveryAlertToTelegram(customer.telegram_id, orderData);
      }
      else {
        // Fallback to Zernio
        await sendDeliveryZernioMessage(customerId, orderId, status, proofUrl).catch(e => console.error('[ROUTER ZERNIO FALLBACK]', e.message));
      }
    } catch (e) {
      console.error('[NOTIFICATION ROUTER ERROR: Delivery]', e.message);
    }
  },

  async sendFeedbackNotification(customerId, customerName, token) {
    try {
      const { data: customer } = await supabaseAdmin.schema('crm')
        .from('customers')
        .select('preferred_channel, line_id, telegram_id, zernio_conversation_id')
        .eq('id', customerId)
        .single();
        
      if (!customer) return;

      if (customer.preferred_channel === 'LINE' && customer.line_id) {
        await sendCustomerFeedbackToLine(customer.line_id, { customerId, customerName, token });
      } 
      else if (customer.preferred_channel === 'Telegram' && customer.telegram_id) {
        await sendCustomerFeedbackToTelegram(customer.telegram_id, { customerId, customerName, token });
      }
      else {
        // Fallback to Zernio HTTP Post
        await this._sendLegacyZernioFeedback(customerId, token);
      }
    } catch (e) {
      console.error('[NOTIFICATION ROUTER ERROR: Feedback]', e.message);
    }
  },

  async sendRenewalNotification(customerId, customerName, expireDateStr) {
    try {
      const { data: customer } = await supabaseAdmin.schema('crm')
        .from('customers')
        .select('preferred_channel, line_id, telegram_id, zernio_conversation_id')
        .eq('id', customerId)
        .single();
        
      if (!customer) return;

      if (customer.preferred_channel === 'LINE' && customer.line_id) {
        await sendCustomerRenewalToLine(customer.line_id, { customerId, customerName, expireDateStr });
      } 
      else if (customer.preferred_channel === 'Telegram' && customer.telegram_id) {
        await sendCustomerRenewalToTelegram(customer.telegram_id, { customerId, customerName, expireDateStr });
      }
      else {
        // Fallback to Zernio HTTP Post
        await this._sendLegacyZernioRenewal(customerId, expireDateStr);
      }
    } catch (e) {
      console.error('[NOTIFICATION ROUTER ERROR: Renewal]', e.message);
    }
  },

  // --- LEGACY ZERNIO HELPERS ---
  
  async _getZernioConversationId(customerId) {
    const { data: custData } = await supabaseAdmin.schema('crm').from('customers').select('zernio_conversation_id, facebook_name').eq('id', customerId).single();
    if (custData?.zernio_conversation_id) return custData.zernio_conversation_id;

    // Try finding via inquiries
    const { data: inqs } = await supabaseAdmin.schema('crm').from('inquiries').select('id, metadata').eq('facebook_name', custData.facebook_name);
    if (!inqs || inqs.length === 0) return null;
    
    for (const inq of inqs) {
      const cid = inq.metadata?.conversationId || inq.metadata?.message?.conversationId;
      if (cid) return cid;
    }
    return null;
  },

  async _sendLegacyZernioFeedback(customerId, token) {
    const cid = await this._getZernioConversationId(customerId);
    if (!cid) return;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const feedbackLink = `${frontendUrl}/feedback/${customerId}?token=${token}`;
    const text = `မင်္ဂလာပါရှင့်။ ယနေ့အတွက် BBD ရဲ့ အစားအသောက် အရသာနဲ့ ဝန်ဆောင်မှုအပေါ် သဘောထားလေးကို အောက်ပါ Link ကနေတစ်ဆင့် မှတ်ချက်ပေးလို့ရပါတယ်ရှင့် 👇\n${feedbackLink}`;
    
    await fetch('https://api.zernio.com/v1/messages', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: cid, text })
    }).catch(() => {});
  },

  async _sendLegacyZernioRenewal(customerId, expireDateStr) {
    const cid = await this._getZernioConversationId(customerId);
    if (!cid) return;
    const text = `မင်္ဂလာပါရှင့်။ လူကြီးမင်းယူထားသော BBD Package သက်တမ်းသည် ${expireDateStr} တွင် ကုန်ဆုံးမည်ဖြစ်ပါသဖြင့် ဆက်လက်မှာယူလိုပါက Admin သို့ ဆက်သွယ်နိုင်ပါသည်ရှင့် 💖`;
    
    await fetch('https://api.zernio.com/v1/messages', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: cid, text })
    }).catch(() => {});
  }
};
