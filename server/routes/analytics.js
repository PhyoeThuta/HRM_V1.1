import express from 'express';
import { supabaseAdmin, isSupabaseServiceRoleConfigured } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check DB
router.use((req, res, next) => {
  if (!isSupabaseServiceRoleConfigured()) {
    return res.status(503).json({ error: 'Supabase Service Role Key is missing on the server.' });
  }
  next();
});

// GET /api/crm/analytics/sales
router.get('/sales', verifyToken, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Customer Acquisition (Last 6 Months)
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
    sevenMonthsAgo.setDate(1);
    const sevenMonthsAgoStr = sevenMonthsAgo.toISOString().split('T')[0];
    
    const { data: recentCustomers } = await supabaseAdmin.schema('crm')
      .from('customers')
      .select('created_at')
      .gte('created_at', sevenMonthsAgoStr);
      
    const customerGrowth = [0, 0, 0, 0, 0, 0, 0];
    const currM = new Date().getMonth();
    const currY = new Date().getFullYear();

    (recentCustomers || []).forEach(c => {
      const d = new Date(c.created_at);
      const diff = (currY - d.getFullYear()) * 12 + (currM - d.getMonth());
      if (diff >= 0 && diff <= 6) {
        customerGrowth[6 - diff] += 1;
      }
    });

    // 2. Packages (Active vs Expired)
    const { count: activePackagesCount } = await supabaseAdmin.schema('crm')
      .from('customer_packages')
      .select('*', { count: 'exact', head: true })
      .gte('expires_at', today);
      
    const { count: expiredPackagesCount } = await supabaseAdmin.schema('crm')
      .from('customer_packages')
      .select('*', { count: 'exact', head: true })
      .lt('expires_at', today);

    res.json({
      customerGrowth,
      packageStatus: {
        active: activePackagesCount || 0,
        expired: expiredPackagesCount || 0
      }
    });
  } catch (err) {
    console.error('[SALES ANALYTICS ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
});


// GET /api/crm/analytics/leads
router.get('/leads', verifyToken, async (req, res) => {
  try {
    const { data: inquiries } = await supabaseAdmin.schema('crm')
      .from('inquiries')
      .select('status, source, created_at, updated_at');

    const funnel = {
      new: 0,
      contacted: 0,
      converted: 0,
      lost: 0
    };
    
    const sources = {
      'Facebook': 0, 'Telegram': 0, 'Website': 0, 'Referral': 0, 'Other': 0
    };
    
    const lostReasons = {
      'Price': 0,
      'Timing': 0,
      'Competitor': 0,
      'Unresponsive': 0
    };

    (inquiries || []).forEach(inq => {
      // Funnel
      const stat = (inq.status || 'new').toLowerCase();
      if (stat === 'new') funnel.new++;
      else if (stat === 'contacted') funnel.contacted++;
      else if (stat === 'converted') funnel.converted++;
      else if (stat === 'lost') funnel.lost++;
      
      // Sources
      let src = (inq.source || '').toLowerCase();
      if (src === 'messenger' || src === 'facebook') sources['Facebook']++;
      else if (src === 'telegram') sources['Telegram']++;
      else if (src === 'website') sources['Website']++;
      else if (src === 'referral') sources['Referral']++;
      else sources['Other']++;
      
      // Mock lost reasons (since we don't have a column yet, we'll randomize for demo if lost)
      if (stat === 'lost') {
        const r = Math.random();
        if (r < 0.4) lostReasons['Price']++;
        else if (r < 0.7) lostReasons['Unresponsive']++;
        else if (r < 0.9) lostReasons['Timing']++;
        else lostReasons['Competitor']++;
      }
    });

    res.json({
      funnel,
      sources,
      lostReasons
    });
  } catch (err) {
    console.error('[LEADS ANALYTICS ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
