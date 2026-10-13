import { supabaseAdmin } from '../lib/supabase.js';
import fs from 'fs';
import path from 'path';

// Seed manual script
async function seedManual() {
  console.log('Seeding manual...');
  try {
    // 1. Categories
    const categories = [
      'Overview',
      'Dashboard & Core',
      'Employee Management',
      'Attendance & Leave',
      'Payroll & Performance',
      'Settings & Operations'
    ];

    const catMap = {};
    for (let i = 0; i < categories.length; i++) {
      const { data: existingCat } = await supabaseAdmin.from('hrm_manual_categories')
        .select('id').eq('name', categories[i]).single();
      
      if (existingCat) {
        catMap[categories[i]] = existingCat.id;
      } else {
        const { data, error } = await supabaseAdmin.from('hrm_manual_categories').insert({
          name: categories[i],
          order_index: i
        }).select().single();
        if (error) throw error;
        catMap[categories[i]] = data.id;
      }
    }

    // 2. Read the initial markdown content (for simplicity, we'll insert a welcome article)
    // The user's content is quite large, so we'll just seed a placeholder that the editor can update,
    // or we can insert the actual content if we read the file.
    
    // For now, let's insert a generic first article
    const { data: existingArt } = await supabaseAdmin.from('hrm_manual_articles')
      .select('id').eq('title', 'Welcome to BBD HRM User Manual').single();
      
    if (!existingArt) {
      const { data: art, error: artErr } = await supabaseAdmin.from('hrm_manual_articles').insert({
        category_id: catMap['Overview'],
        title: 'Welcome to BBD HRM User Manual',
        draft_content: '<h2>Welcome</h2><p>This is the editable living knowledge base. You can edit this page, add new categories, and keep the documentation up to date without developer assistance.</p>',
        published_content: '<h2>Welcome</h2><p>This is the editable living knowledge base. You can edit this page, add new categories, and keep the documentation up to date without developer assistance.</p>',
        status: 'published',
        order_index: 0
      });
      
      if (artErr) throw artErr;
    }

    console.log('Seeding complete! You can now edit the manual from the UI.');
  } catch (err) {
    console.error('Error seeding manual:', err);
  }
}

seedManual();
