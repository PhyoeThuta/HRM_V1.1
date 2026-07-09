import { dbFetch } from './lib/supabase.js';

async function test() {
  const users = await dbFetch('sys_users', '*');
  console.log(users.slice(0, 2));
}
test();
