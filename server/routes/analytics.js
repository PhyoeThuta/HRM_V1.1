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
      
      // Count actual lost reasons from inquiry feedback or comments if present
      if (stat === 'lost') {
        const comment = (inq.comments || inq.notes || '').toLowerCase();
        if (comment.includes('price') || comment.includes('စျေး')) lostReasons['Price']++;
        else if (comment.includes('time') || comment.includes('မအား')) lostReasons['Timing']++;
        else if (comment.includes('competitor') || comment.includes('တခြား')) lostReasons['Competitor']++;
        else lostReasons['Unresponsive']++;
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

// GET /api/crm/analytics/full-report
router.get('/full-report', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const today = new Date().toISOString().split('T')[0];

    // Build optional date filter clause
    let customerQuery = supabaseAdmin.schema('crm').from('customers').select('*');
    let packageQuery = supabaseAdmin.schema('crm').from('customer_packages').select('*');
    let inquiryQuery = supabaseAdmin.schema('crm').from('inquiries').select('*');
    let dailyFeedbackQuery = supabaseAdmin.schema('crm').from('daily_feedbacks').select('*');
    let menuFeedbackQuery = supabaseAdmin.schema('crm').from('crm_menu_feedbacks').select('*');
    let feedbackQuery = supabaseAdmin.schema('crm').from('feedbacks').select('*');

    if (startDate) {
      customerQuery = customerQuery.gte('created_at', startDate);
      packageQuery = packageQuery.gte('created_at', startDate);
      inquiryQuery = inquiryQuery.gte('created_at', startDate);
      dailyFeedbackQuery = dailyFeedbackQuery.gte('created_at', startDate);
      menuFeedbackQuery = menuFeedbackQuery.gte('created_at', startDate);
      feedbackQuery = feedbackQuery.gte('created_at', startDate);
    }
    if (endDate) {
      customerQuery = customerQuery.lte('created_at', `${endDate}T23:59:59`);
      packageQuery = packageQuery.lte('created_at', `${endDate}T23:59:59`);
      inquiryQuery = inquiryQuery.lte('created_at', `${endDate}T23:59:59`);
      dailyFeedbackQuery = dailyFeedbackQuery.lte('created_at', `${endDate}T23:59:59`);
      menuFeedbackQuery = menuFeedbackQuery.lte('created_at', `${endDate}T23:59:59`);
      feedbackQuery = feedbackQuery.lte('created_at', `${endDate}T23:59:59`);
    }

    const [
      { data: customers },
      { data: packages },
      { data: inquiries },
      { data: dailyFeedbacks },
      { data: menuFeedbacks },
      { data: generalFeedbacks }
    ] = await Promise.all([
      customerQuery,
      packageQuery,
      inquiryQuery,
      dailyFeedbackQuery,
      menuFeedbackQuery,
      feedbackQuery
    ]);

    const safeCustomers = customers || [];
    const safePackages = packages || [];
    const safeInquiries = inquiries || [];
    const safeDailyFeedbacks = dailyFeedbacks || [];
    const safeMenuFeedbacks = menuFeedbacks || [];
    const safeGeneralFeedbacks = generalFeedbacks || [];

    // ─────────────────────────────────────────────────────────────────
    // 1. OVERVIEW SUMMARY METRICS
    // ─────────────────────────────────────────────────────────────────
    const totalCustomers = safeCustomers.length;
    const activePackages = safePackages.filter(p => p.expires_at >= today && p.status !== 'cancelled');
    const expiredPackages = safePackages.filter(p => p.expires_at < today || p.status === 'expired');

    const convertedLeads = safeInquiries.filter(i => (i.status || '').toLowerCase() === 'converted').length;
    const leadConversionRate = safeInquiries.length > 0 
      ? Math.round((convertedLeads / safeInquiries.length) * 100) 
      : 0;

    // Calculate Satisfaction Rate from daily & menu ratings
    const allRatings = [
      ...safeDailyFeedbacks.map(f => Number(f.rating)).filter(r => r > 0),
      ...safeMenuFeedbacks.flatMap(mf => {
        try {
          const parsed = typeof mf.ratings_json === 'string' ? JSON.parse(mf.ratings_json) : (mf.ratings_json || {});
          return Object.values(parsed).map(Number).filter(r => r > 0);
        } catch (e) {
          return [];
        }
      })
    ];
    const avgSatisfactionScore = allRatings.length > 0
      ? (allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length).toFixed(1)
      : '0.0';
    const satisfactionPercentage = allRatings.length > 0
      ? Math.round((allRatings.filter(r => r >= 4).length / allRatings.length) * 100)
      : 0;

    // ─────────────────────────────────────────────────────────────────
    // 2. MENU PERFORMANCE (BBD RECIPE & DISH ANALYTICS)
    // ─────────────────────────────────────────────────────────────────
    const dishStatsMap = {};

    safeDailyFeedbacks.forEach(fb => {
      const name = fb.dish_name_en || fb.dish_name_mm || 'Unnamed Dish';
      if (!dishStatsMap[name]) {
        dishStatsMap[name] = {
          name_en: fb.dish_name_en || name,
          name_mm: fb.dish_name_mm || '',
          totalRating: 0,
          count: 0,
          ratingsDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          comments: []
        };
      }
      const r = Math.min(5, Math.max(1, Math.round(Number(fb.rating) || 0)));
      if (r > 0) {
        dishStatsMap[name].totalRating += r;
        dishStatsMap[name].count += 1;
        dishStatsMap[name].ratingsDistribution[r] = (dishStatsMap[name].ratingsDistribution[r] || 0) + 1;
      }
      if (fb.comment && fb.comment.trim()) {
        dishStatsMap[name].comments.push(fb.comment.trim());
      }
    });

    const dishList = Object.values(dishStatsMap).map(d => ({
      ...d,
      avgRating: d.count > 0 ? parseFloat((d.totalRating / d.count).toFixed(1)) : 0
    })).sort((a, b) => b.avgRating - a.avgRating);

    const popularDishes = dishList.filter(d => d.avgRating >= 4.0);
    const averageDishes = dishList.filter(d => d.avgRating >= 3.0 && d.avgRating < 4.0);
    const unpopularDishes = dishList.filter(d => d.avgRating < 3.0);

    // Aggregate Best & Worst Picks from weekly menu feedbacks
    const bestPicksCount = {};
    const worstPicksCount = {};
    safeMenuFeedbacks.forEach(mf => {
      if (mf.best_pick) {
        bestPicksCount[mf.best_pick] = (bestPicksCount[mf.best_pick] || 0) + 1;
      }
      if (mf.worst_pick) {
        worstPicksCount[mf.worst_pick] = (worstPicksCount[mf.worst_pick] || 0) + 1;
      }
    });

    // ─────────────────────────────────────────────────────────────────
    // 3. CHURN & RENEWAL DYNAMIC REASONS
    // ─────────────────────────────────────────────────────────────────
    const churnReasons = {};
    const renewalReasons = {};

    // Analyze general feedbacks and package statuses for dynamic reason extraction
    safeGeneralFeedbacks.forEach(fb => {
      const comment = (fb.comment || '').toLowerCase();
      const subject = (fb.subject || '').toLowerCase();
      
      // Categorize churn signals
      if (comment.includes('moved') || comment.includes('မြို့') || comment.includes('ပြောင်း')) {
        churnReasons['Moved to another city (အခြားမြို့သို့ ပြောင်းရွှေ့ခြင်း)'] = (churnReasons['Moved to another city (အခြားမြို့သို့ ပြောင်းရွှေ့ခြင်း)'] || 0) + 1;
      } else if (comment.includes('quality') || comment.includes('service') || comment.includes('အရသာ') || comment.includes('အဆင်မပြေ')) {
        churnReasons['Customer Service / Quality Issue (ဝန်ဆောင်မှု/အရသာ အဆင်မပြေခြင်း)'] = (churnReasons['Customer Service / Quality Issue (ဝန်ဆောင်မှု/အရသာ အဆင်မပြေခြင်း)'] || 0) + 1;
      } else if (comment.includes('price') || comment.includes('expensive') || comment.includes('စျေး')) {
        churnReasons['Price / Budget (စျေးနှုန်း ခက်ခဲခြင်း)'] = (churnReasons['Price / Budget (စျေးနှုန်း ခက်ခဲခြင်း)'] || 0) + 1;
      } else if (comment.includes('pause') || comment.includes('travel') || comment.includes('ခရီး')) {
        churnReasons['Temporary Travel / Break (ခရီးသွား/ခဏနားခြင်း)'] = (churnReasons['Temporary Travel / Break (ခရီးသွား/ခဏနားခြင်း)'] || 0) + 1;
      } else if (comment.includes('diet') || comment.includes('health') || comment.includes('ကျန်းမာရေး')) {
        churnReasons['Dietary / Medical Reason (ကျန်းမာရေး/အစားအသောက် စည်းကမ်းပြောင်းခြင်း)'] = (churnReasons['Dietary / Medical Reason (ကျန်းမာရေး/အစားအသောက် စည်းကမ်းပြောင်းခြင်း)'] || 0) + 1;
      } else if (fb.type === 'complaint' || fb.type === 'churn_survey') {
        const key = fb.subject || 'Customer Care Exit / Complaint';
        churnReasons[key] = (churnReasons[key] || 0) + 1;
      }

      // Categorize renewal signals
      if (comment.includes('renew') || comment.includes('ကြိုက်') || comment.includes('ကောင်း') || comment.includes('ဆက်')) {
        if (comment.includes('variety') || comment.includes('စုံ')) {
          renewalReasons['High Menu Variety (ဟင်းပွဲစုံလင်မှု)'] = (renewalReasons['High Menu Variety (ဟင်းပွဲစုံလင်မှု)'] || 0) + 1;
        } else if (comment.includes('health') || comment.includes('weight') || comment.includes('ဝိတ်')) {
          renewalReasons['Health & Nutrition Results (ကျန်းမာရေးနှင့် ဝိတ်ကျ ရလဒ်ကောင်းမွန်မှု)'] = (renewalReasons['Health & Nutrition Results (ကျန်းမာရေးနှင့် ဝိတ်ကျ ရလဒ်ကောင်းမွန်မှု)'] || 0) + 1;
        } else if (comment.includes('delivery') || comment.includes('မှန်')) {
          renewalReasons['Timely Delivery (အချိန်မှန် ပို့ဆောင်ပေးမှု)'] = (renewalReasons['Timely Delivery (အချိန်မှန် ပို့ဆောင်ပေးမှု)'] || 0) + 1;
        } else {
          renewalReasons['Overall Satisfaction (အထွေထွေ ကျေနပ်အားရမှု)'] = (renewalReasons['Overall Satisfaction (အထွေထွေ ကျေနပ်အားရမှု)'] || 0) + 1;
        }
      }
    });

    // ─────────────────────────────────────────────────────────────────
    // 4. LEAD SOURCE & REFERRAL PERFORMANCE
    // ─────────────────────────────────────────────────────────────────
    const sourcesCount = {};
    safeInquiries.forEach(inq => {
      let src = inq.source || 'Facebook Direct';
      if (src.toLowerCase().includes('fb') || src.toLowerCase().includes('messenger')) src = 'Facebook';
      else if (src.toLowerCase().includes('tele')) src = 'Telegram';
      else if (src.toLowerCase().includes('web')) src = 'Website';
      else if (src.toLowerCase().includes('ref')) src = 'Referral Program';
      sourcesCount[src] = (sourcesCount[src] || 0) + 1;
    });

    const referralStats = {
      totalReferredCustomers: safeCustomers.filter(c => c.referred_by || c.referral_code).length,
      topReferrers: []
    };

    // Aggregate referrers from customers
    const referrerMap = {};
    safeCustomers.forEach(c => {
      if (c.referred_by) {
        referrerMap[c.referred_by] = (referrerMap[c.referred_by] || 0) + 1;
      }
    });
    referralStats.topReferrers = Object.entries(referrerMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // ─────────────────────────────────────────────────────────────────
    // 5. DELIVERY FEEDBACK & PUNCTUALITY
    // ─────────────────────────────────────────────────────────────────
    let deliveryComplaints = 0;
    let packagingIssues = 0;
    let lateDeliveries = 0;
    const deliveryLogs = [];

    safeGeneralFeedbacks.forEach(fb => {
      const text = `${fb.subject || ''} ${fb.comment || ''}`.toLowerCase();
      if (text.includes('delivery') || text.includes('ပို့') || text.includes('driver') || text.includes('late') || text.includes('ဖိတ်')) {
        deliveryComplaints++;
        if (text.includes('late') || text.includes('နောက်ကျ')) lateDeliveries++;
        if (text.includes('pack') || text.includes('ဖိတ်') || text.includes('ကျိုး')) packagingIssues++;
        deliveryLogs.push({
          id: fb.id,
          comment: fb.comment,
          type: fb.type,
          created_at: fb.created_at
        });
      }
    });

    const totalDeliveriesEvaluated = safePackages.length * 5;
    const onTimeRate = totalDeliveriesEvaluated > 0
      ? Math.max(0, Math.round(((totalDeliveriesEvaluated - lateDeliveries) / totalDeliveriesEvaluated) * 100))
      : (deliveryComplaints > 0 ? 50 : 100);

    res.json({
      summary: {
        totalCustomers,
        activePackages: activePackages.length,
        expiredPackages: expiredPackages.length,
        leadConversionRate,
        avgSatisfactionScore,
        satisfactionPercentage
      },
      menuPerformance: {
        popularDishes,
        averageDishes,
        unpopularDishes,
        bestPicksCount,
        worstPicksCount,
        allDishes: dishList
      },
      churnAndRenewal: {
        churnReasons,
        renewalReasons,
        activeCount: activePackages.length,
        churnedCount: expiredPackages.length
      },
      leadSources: {
        sourcesCount,
        referralStats
      },
      deliveryFeedback: {
        onTimeRate,
        deliveryComplaints,
        lateDeliveries,
        packagingIssues,
        deliveryLogs: deliveryLogs.slice(0, 10)
      }
    });
  } catch (err) {
    console.error('[FULL REPORT ANALYTICS ERROR]', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;

