import { supabase } from './lib/supabase.js';

async function run() {
  console.log('Running Leave Request Schema Update...');

  // 1. Create the bucket
  console.log('Creating leave_documents bucket...');
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('leave_documents', { public: true });
  if (bucketError) {
    if (bucketError.message.includes('already exists')) {
      console.log('Bucket already exists.');
    } else {
      console.error('Failed to create bucket:', bucketError);
    }
  } else {
    console.log('Bucket created successfully.');
  }

  // 2. Add columns via RPC (if they don't have SQL execution access via JS, we might have to use REST, but Supabase doesn't support altering tables via JS client out of the box unless RPC is set up).
  // I will write a pure SQL script as well just in case.
}
run();
