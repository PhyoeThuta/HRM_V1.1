import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });
import { supabaseAdmin } from './server/lib/supabase.js';

const translations = {
  'Beef Lean': 'အမဲသားစိမ်း',
  'Bell Pepper': 'ငရုတ်ပွ',
  'King Rice Bran Oil 5 L': 'ဆီ',
  'Turmeric Powder': 'နနွင်းမှုန့်',
  'Chicken Seasoning Powder': 'ကြက်သားမှုန့်',
  'Chili Colored Powder': 'အရောင်တင်မှုန့်',
  'Salt': 'ဆား',
  'Garlic': 'ကြက်သွန်ဖြူ',
  'Shallot': 'ကြက်သွန်နီ',
  'Golden Mountain Soy Sauce': 'ပဲငံပြာရည်',
  'Pure Refined Sugar': 'သကြား',
  'Ginger': 'ဂျင်း',
  'Rice': 'ဆန်',
  'Grace(B002)(Rice Box / 2)': 'ထမင်းဘူး',
  'Black Pepper': 'ငရုတ်ကောင်း',
  'Dried Chili': 'ငရုတ်သီးခြောက်',
  'Scallion / Spring Onion': 'ကြက်သွန်မြိတ်',
  'Healthy Boy Sweet Soy Sauce': 'ပဲငံပြာရည်အချို',
  'Shrimp': 'ပုစွန်'
};

async function run() {
  try {
    const { data: items } = await supabaseAdmin.from('inventory_items').select('*');
    let count = 0;
    
    for (const item of items) {
      const mm = translations[item.name_eng];
      if (mm) {
        await supabaseAdmin.from('inventory_items').update({ name_mm: mm }).eq('id', item.id);
        count++;
      }
    }
    console.log(`Updated ${count} items with Burmese translations!`);
  } catch (e) {
    console.error(e);
  }
}
run();
