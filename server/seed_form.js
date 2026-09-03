import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocket }
});

const schema = [
  { id: 'name', type: 'text', label: 'Full Name (အမည်)', required: true },
  { id: 'phone', type: 'text', label: 'Phone Number (ဖုန်းနံပါတ်)', required: true },
  { id: 'address', type: 'textarea', label: 'Delivery Address (ပို့ဆောင်ပေးရမည့် လိပ်စာအပြည့်အစုံ)', required: true },
  { id: 'allergies', type: 'textarea', label: 'Food Allergies (မတည့်သော အစားအသောက်များ)', required: false },
  { id: 'medical_conditions', type: 'textarea', label: 'Medical Conditions (ကျန်းမာရေး အခြေအနေ / ရောဂါအခံများ)', required: false },
  { id: 'delivery_time', type: 'dropdown', label: 'Preferred Delivery Time (ပို့ဆောင်ပေးရမည့် အချိန်)', options: ['Morning (မနက် ၈ နာရီ မတိုင်မီ)', 'Evening (ညနေ ၄ နာရီ မတိုင်မီ)'], required: true },
  { id: 'taste_preference', type: 'text', label: 'Taste Preference (အရသာ အကြိုက်)', required: false }
];

async function seed() {
  const { error } = await supabaseAdmin.schema('crm').from('form_settings').upsert(
    { form_name: 'enrollment', schema, updated_at: new Date().toISOString() },
    { onConflict: 'form_name' }
  );
  if (error) console.error(error);
  else console.log('Schema seeded successfully');
}

seed();
