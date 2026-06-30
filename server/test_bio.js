import { supabase } from './lib/supabase.js';

async function run() {
  const { data, error } = await supabase.from('biometric_registrations').insert({
    employee_id: 'ebcc4b85-c54d-4fc3-a91d-045371c6dc00', // random valid uuid
    device_id: 'some-device-id',
    biometric_id: '18'
  }).select();
  console.log(error);
}
run();
