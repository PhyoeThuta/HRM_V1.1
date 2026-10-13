import { supabaseAdmin } from '../server/lib/supabase.js';
import jwt from '../server/node_modules/jsonwebtoken/index.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve('./server/.env') });

const JWT_SECRET = process.env.JWT_SECRET?.trim().replace(/^["']|["']$/g, '');

async function sendTestToPhyoeThuta() {
  console.log('--- Sending Test Message to Customer Phyoe Thuta (BBD-002) ---');

  // Generate Admin JWT Token
  const token = jwt.sign(
    { id: 'admin-1', username: 'admin', role: 'boss', full_name: 'System Admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // 1. Fetch Customer BBD-002
  const { data: customer, error: custErr } = await supabaseAdmin.schema('crm')
    .from('customers')
    .select('*')
    .eq('customer_code', 'BBD-002')
    .single();

  if (custErr || !customer) {
    console.error('Customer BBD-002 not found:', custErr);
    return;
  }

  console.log(`Found Customer: ID ${customer.id} | Name: ${customer.full_name} | Code: ${customer.customer_code}`);

  // 2. Fetch Inquiries for Customer BBD-002
  const { data: inquiries, error: inqErr } = await supabaseAdmin.schema('crm')
    .from('inquiries')
    .select('*')
    .or(`customer_id.eq.${customer.id},prospect_name.ilike.%Phyoe%`)
    .order('created_at', { ascending: false });

  if (inqErr || !inquiries || inquiries.length === 0) {
    console.error('No inquiries found for Phyoe Thuta:', inqErr);
    return;
  }

  const inquiry = inquiries[0];
  console.log(`Target Inquiry ID: ${inquiry.id} | Prospect: ${inquiry.prospect_name}`);

  // 3. Send test message via CRM API (Local server port 8080)
  const testMessageText = `[TEST MSG ${new Date().toLocaleTimeString()}] Hello Phyoe Thuta! Your Gold Membership (BBD-002) status is active.`;
  
  console.log(`Sending message: "${testMessageText}" via CRM API...`);

  try {
    const res = await fetch(`http://localhost:8080/api/crm/inquiries/${inquiry.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({
        message_text: testMessageText,
        sender_type: 'admin'
      })
    });

    const result = await res.json();
    console.log('API Response Status:', res.status);
    console.log('API Response Result Message ID:', result.id);

    // 4. Query the latest message in inquiries_messages to verify metadata
    const { data: latestMsg } = await supabaseAdmin.schema('crm')
      .from('inquiries_messages')
      .select('*')
      .eq('id', result.id || 0)
      .single();

    if (latestMsg) {
      console.log('\n--- VERIFICATION OF SAVED MESSAGE ---');
      console.log('Message ID:', latestMsg.id);
      console.log('Sender Type:', latestMsg.sender_type);
      console.log('Delivery Metadata:', JSON.stringify(latestMsg.metadata, null, 2));

      if (latestMsg.metadata?.delivery_status === 'failed' || latestMsg.metadata?.zernio_failed) {
        console.log('\n⚠️ DELIVERY STATUS: FAILED (Captured error successfully!)');
        console.log('Delivery Error Reason:', latestMsg.metadata?.delivery_error);
        console.log('✅ The CRM Inbox UI will render the red warning badge for this message!');
      } else {
        console.log('\n✅ DELIVERY STATUS: SUCCESS');
      }
    }
  } catch (err) {
    console.error('Error sending test message:', err.message);
  }
}

sendTestToPhyoeThuta();
