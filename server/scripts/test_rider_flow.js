import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTest() {
  console.log('=== STARTING RIDER FLOW TEST ===');

  try {
    // 1. Ensure a Rider exists
    let { data: rider } = await supabaseAdmin.from('sys_users').select('*').eq('role', 'rider').limit(1).single();

    if (!rider) {
      console.log('No rider found. Creating a test rider...');
      const { data: newRider, error } = await supabaseAdmin.from('sys_users').insert({
        username: 'test_rider_01',
        full_name: 'Test Rider',
        role: 'rider',
        password_hash: 'MUST_CHANGE:password123',
        is_active: true
      }).select().single();

      if (error) throw error;
      rider = newRider;
    }
    console.log(`✅ Found Rider: ${rider.full_name} (ID: ${rider.id})`);

    // 2. Fetch a random order from today or any day
    const { data: orders } = await supabaseAdmin.from('operations_orders').select('*').limit(1);
    if (!orders || orders.length === 0) {
      console.log('❌ No orders found in the database to test with.');
      return;
    }
    const order = orders[0];
    console.log(`✅ Found Order: ${order.id} for Customer ${order.customer_id}`);

    // 3. Test Assignment API Logic (Assign Order to Rider)
    console.log(`🔄 Assigning Order ${order.id} to Rider ${rider.id}...`);

    const { data: existing } = await supabaseAdmin.from('operations_delivery_assignments').select('*').eq('order_id', order.id).limit(1);
    if (existing && existing.length > 0) {
      await supabaseAdmin.from('operations_delivery_assignments').update({
        rider_id: rider.id,
        status: 'ACCEPTED',
        updated_at: new Date().toISOString()
      }).eq('order_id', order.id);
    } else {
      await supabaseAdmin.from('operations_delivery_assignments').insert({
        order_id: order.id,
        rider_id: rider.id,
        status: 'ACCEPTED'
      });
    }
    console.log(`✅ Order Assigned!`);

    // 4. Test Status Update Logic (Rider picked up & on the way)
    console.log(`🔄 Updating tracking status to ON_THE_WAY...`);
    await supabaseAdmin.from('operations_delivery_assignments').update({
      status: 'ON_THE_WAY',
      updated_at: new Date().toISOString()
    }).eq('order_id', order.id);
    console.log(`✅ Status updated to ON_THE_WAY!`);

    // 5. Test Customer Tracking API Logic
    console.log(`🔄 Simulating Customer Tracking fetch...`);
    const { data: assignmentCheck } = await supabaseAdmin.from('operations_delivery_assignments')
      .select('rider_id, status')
      .eq('order_id', order.id)
      .single();

    console.log(`✅ Customer Tracking Result -> Rider ID: ${assignmentCheck.rider_id}, Status: ${assignmentCheck.status}`);

    if (assignmentCheck.status === 'ON_THE_WAY') {
      console.log('🎉 ALL BACKEND & DATABASE TESTS PASSED SUCCESSFULLY! 🎉');
    } else {
      console.log('❌ Tracking status check failed.');
    }

  } catch (e) {
    console.error('❌ Test failed with error:', e);
  }
}

runTest();
