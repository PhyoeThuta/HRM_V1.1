import { supabase } from './lib/supabase.js';
async function create() {
  const { data, error } = await supabase.storage.createBucket('resumes', { public: true });
  console.log(data, error);
  process.exit(0);
}
create();
