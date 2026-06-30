import express from 'express';
import { supabase } from './lib/supabase.js';

async function run() {
  try {
    const page = 1;
    const limit = 50; 
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let q = supabase
      .from('Employees')
      .select('*', { count: 'exact' })
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);
      
    const { data: employees, count, error } = await q;
    if (error) {
       console.log('Error from DB:', error);
    } else {
       console.log('Success:', employees.length, 'records');
    }
  } catch (e) {
    console.error('Exception:', e);
  }
}
run();
