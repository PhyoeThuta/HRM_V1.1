import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

global.WebSocket = ws;

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

async function updateSchema() {
  const schema = [
    { id: 'full_name', type: 'text', label: 'Full Name', placeholder: 'e.g. John Doe', required: true, width: 'half', section: '01. Personal Info' },
    { id: 'facebook_name', type: 'text', label: 'Facebook Name', placeholder: 'Auto-filled', required: true, width: 'half', section: '01. Personal Info', readonly: true },
    { id: 'phone', type: 'text', label: 'Phone Number', placeholder: 'e.g. 09123456789', required: true, width: 'half', section: '01. Personal Info' },
    { id: 'age', type: 'number', label: 'Age', placeholder: 'e.g. 25', required: true, width: 'third', section: '01. Personal Info' },
    { id: 'gender', type: 'dropdown', label: 'Gender', options: ['Male', 'Female'], required: true, width: 'third', section: '01. Personal Info' },
    { id: 'address', type: 'textarea', label: 'Delivery Address', placeholder: 'Full address', required: true, width: 'full', section: '01. Personal Info' },
    { id: 'package_id', type: 'dropdown', label: 'Select Package', options: [], required: true, width: 'half', section: '02. Subscription Details' },
    { id: 'start_date', type: 'date', label: 'Start Date', required: true, width: 'half', section: '02. Subscription Details' },
    { id: 'current_weight', type: 'text', label: 'Current Weight (kg)', placeholder: 'e.g. 70', required: true, width: 'third', section: '03. Health Profile' },
    { id: 'goal_weight', type: 'text', label: 'Goal Weight (kg)', placeholder: 'e.g. 60', required: true, width: 'third', section: '03. Health Profile' },
    { id: 'height', type: 'text', label: 'Height (cm)', placeholder: 'e.g. 170', required: true, width: 'third', section: '03. Health Profile' },
    { id: 'medical_condition', type: 'text', label: 'Medical Conditions', placeholder: 'e.g. Diabetes, None', required: true, width: 'half', section: '03. Health Profile' },
    { id: 'medicine_taking', type: 'text', label: 'Medicine Taking', placeholder: 'e.g. None', required: false, width: 'half', section: '03. Health Profile' },
    { id: 'food_restriction', type: 'text', label: 'Food Restrictions / Allergies', placeholder: 'e.g. Seafood allergy, No pork', required: true, width: 'half', section: '04. Lifestyle & Diet Prep' },
    { id: 'activity_level', type: 'dropdown', label: 'Activity Level', options: ['Sedentary', 'Light', 'Moderate', 'Highly Active'], required: true, width: 'half', section: '04. Lifestyle & Diet Prep' },
    { id: 'fasting_willingness', type: 'dropdown', label: 'Fasting Willingness', options: ['Yes', 'No'], required: true, width: 'half', section: '04. Lifestyle & Diet Prep' }
  ];

  const { data, error } = await supabase.schema('crm').from('form_settings').upsert({
    form_name: 'enrollment',
    schema: schema,
    updated_at: new Date().toISOString()
  }, { onConflict: 'form_name' });

  if (error) {
    console.error('Error updating schema:', error);
  } else {
    console.log('Schema updated successfully!');
  }
}

updateSchema();
