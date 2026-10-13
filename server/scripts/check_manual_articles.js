import { supabaseAdmin } from '../lib/supabase.js';

async function checkArticles() {
  const { data, error } = await supabaseAdmin.from('hrm_manual_articles').select('title, category_id').order('order_index');
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log(`Found ${data.length} articles.`);
    data.forEach(a => console.log(`- ${a.title}`));
  }
}

checkArticles();
