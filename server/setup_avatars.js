import { supabase } from './lib/supabase.js';

async function checkAndSetup() {
  // 1. Bucket
  console.log('Checking bucket...');
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('avatars', {
    public: true,
    fileSizeLimit: 10485760,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
  });
  if (bucketError && !bucketError.message.includes('already exists')) {
    console.error('Bucket Error:', bucketError);
  } else {
    console.log('Bucket "avatars" is ready.');
  }

  // 2. Column
  console.log('Checking column...');
  const { data, error } = await supabase.from('Employees').select('avatar_url').limit(1);
  if (error && error.code === '42703') { // undefined_column
    console.log(`
--- PLEASE RUN THIS SQL IN SUPABASE DASHBOARD ---
ALTER TABLE public."Employees" ADD COLUMN avatar_url TEXT;
-------------------------------------------------
`);
  } else if (error) {
    console.error('DB Error:', error);
  } else {
    console.log('avatar_url column already exists!');
  }
  process.exit(0);
}

checkAndSetup();
