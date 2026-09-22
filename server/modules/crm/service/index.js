import * as crmRepo from '../repository/index.js';
import { supabaseAdmin } from '../../../lib/supabase.js';

export async function getAllLevelSettings() {
  const { data, error } = await crmRepo.getAllLevelSettings();
  if (error) throw error;
  
  // Decode metadata stored in `color` column if formatted like "amber|max_spend:8000"
  const decoded = (data || []).map(item => {
    let color = item.color || 'blue';
    let max_spend = null;

    if (color && color.includes('|max_spend:')) {
      const parts = color.split('|max_spend:');
      color = parts[0];
      const parsedMax = parseInt(parts[1], 10);
      if (!isNaN(parsedMax)) max_spend = parsedMax;
    }

    const min_spend = item.min_spend !== undefined && item.min_spend !== null ? item.min_spend : (item.required_spend || 0);

    return {
      ...item,
      min_spend,
      max_spend,
      color
    };
  });

  // Sort ascending by min_spend
  const sorted = decoded.sort((a, b) => a.min_spend - b.min_spend);

  // Compute range dynamically: fallback to next tier's min_spend ONLY IF max_spend was not explicitly saved
  const normalized = sorted.map((s, idx) => {
    let max = s.max_spend;
    if (max === null && idx < sorted.length - 1) {
      const nextMin = sorted[idx + 1].min_spend;
      max = nextMin > s.min_spend ? nextMin : null;
    }

    return { ...s, max_spend: max };
  });

  return normalized;
}

export async function upsertLevelSetting(payload) {
  const { id, level_name, required_spend, min_spend, max_spend, color } = payload;
  
  const parsedMin = min_spend !== undefined && min_spend !== '' ? parseInt(min_spend) : (required_spend !== undefined ? parseInt(required_spend) : 0);
  const parsedMax = max_spend !== undefined && max_spend !== '' && max_spend !== null ? parseInt(max_spend) : null;

  if (!level_name || parsedMin === undefined || isNaN(parsedMin)) {
    const err = new Error('level_name and valid min_spend are required');
    err.status = 400;
    throw err;
  }

  if (parsedMax !== null && !isNaN(parsedMax) && parsedMin > parsedMax) {
    const err = new Error('Minimum spend cannot be greater than maximum spend.');
    err.status = 400;
    throw err;
  }

  // Encode explicit max_spend inside color string so DB stores it without schema migration errors
  const baseColor = color || 'blue';
  const encodedColor = parsedMax !== null ? `${baseColor}|max_spend:${parsedMax}` : baseColor;

  const dbPayload = {
    level_name,
    required_spend: parsedMin, // Keep for DB column compatibility
    color: encodedColor
  };

  let result;
  if (id) {
    // Update
    const { data, error } = await crmRepo.updateLevelSetting(id, dbPayload);
    if (error) throw error;
    result = data;
  } else {
    // Insert
    const { data, error } = await crmRepo.createLevelSetting(dbPayload);
    if (error) throw error;
    result = data;
  }

  // Normalize output format
  let resColor = result.color || 'blue';
  let resMax = null;
  if (resColor && resColor.includes('|max_spend:')) {
    const parts = resColor.split('|max_spend:');
    resColor = parts[0];
    resMax = parseInt(parts[1], 10);
  }

  return {
    ...result,
    min_spend: parsedMin,
    max_spend: resMax,
    color: resColor
  };
}

export async function deleteLevelSetting(id) {
  const { error } = await crmRepo.deleteLevelSetting(id);
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────────────
// PACKAGES (MASTER CATALOG)
// ──────────────────────────────────────────────────────────────────

export async function getAllPackages() {
  const { data, error } = await crmRepo.getAllPackages();
  if (error) throw error;
  return data;
}

export async function createPackage(payload) {
  const { data, error } = await crmRepo.createPackage(payload);
  if (error) throw error;
  return data;
}

export async function updatePackage(id, payload) {
  const { error } = await crmRepo.updatePackage(id, payload);
  if (error) throw error;
}

export async function deletePackage(id) {
  const { error } = await crmRepo.deletePackage(id);
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────────────
// FORM SETTINGS
// ──────────────────────────────────────────────────────────────────

export async function getFormSettings() {
  const { data } = await crmRepo.getFormSettings('enrollment');
  // Legacy behavior: completely ignores any Supabase error (including permission denied)
  // and just falls back to { schema: [] } if data is undefined
  return data || { schema: [] };
}

export async function upsertFormSettings(schema) {
  const { data, error } = await crmRepo.upsertFormSettings({
    form_name: 'enrollment',
    schema,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
  return data;
}

// ──────────────────────────────────────────────────────────────────
// FEEDBACKS
// ──────────────────────────────────────────────────────────────────

export async function getAllFeedbacks() {
  const { data, error } = await crmRepo.getAllFeedbacks();
  if (error) throw error;
  return data;
}

export async function deleteFeedback(id) {
  const { error } = await crmRepo.deleteFeedback(id);
  if (error) throw error;
}

export async function getWeeklyFeedbacks() {
  // 1. Fetch daily feedbacks via Repo
  const { data: dailyFeedbacks, error: dailyErr } = await crmRepo.getDailyFeedbacks();
  if (dailyErr) console.warn('[CRM GET DAILY FEEDBACKS WARN]', dailyErr.message);

  // 2. Fetch weekly menu feedbacks (Legacy Bug Preservation: Access public schema directly!)
  const { data: weeklyFeedbacks, error: weeklyErr } = await supabaseAdmin
    .from('crm_menu_feedbacks')
    .select('*, customers(id, full_name, phone, status)')
    .order('created_at', { ascending: false });

  if (weeklyErr) console.warn('[CRM GET WEEKLY FEEDBACKS WARN]', weeklyErr.message);

  // 3. Combine and return sorted by date
  const combined = [
    ...(dailyFeedbacks || []).map(item => ({ ...item, feedback_type: 'DAILY' })),
    ...(weeklyFeedbacks || []).map(item => ({ ...item, feedback_type: 'WEEKLY' }))
  ].sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

  return combined;
}

export async function resolveFeedback(id) {
  // Get current comment
  const { data: fb, error: fetchErr } = await crmRepo.getFeedbackComment(id);
  if (fetchErr) throw fetchErr;
  
  const updatedComment = fb.comment + '\n[RESOLVED]';
  
  const { error: updateErr } = await crmRepo.updateFeedbackComment(id, updatedComment);
  if (updateErr) throw updateErr;
}

// ──────────────────────────────────────────────────────────────────
// DASHBOARDS / SEGMENTS
// ──────────────────────────────────────────────────────────────────

export async function deductKitchenMeals() {
  const { data: packages, error: fetchErr } = await crmRepo.getActiveCustomerPackagesForDeduct();
  if (fetchErr) throw fetchErr;
  
  let deductedCount = 0;
  
  const groups = {};
  for (const pkg of packages) {
    if (!groups[pkg.meal_count]) groups[pkg.meal_count] = [];
    groups[pkg.meal_count].push(pkg.id);
  }
  
  for (const [mealCountStr, ids] of Object.entries(groups)) {
    const mealCount = parseInt(mealCountStr, 10);
    const { error } = await crmRepo.bulkUpdatePackageMealCount(ids, mealCount - 1);
      
    if (!error) {
      deductedCount += ids.length;
    }
  }
  
  return deductedCount;
}

export async function getKitchenDashboard(targetDate) {
  let { data: packages, error } = await crmRepo.getActivePackagesWithCustomerInfo(targetDate);
  if (error) throw error;

  if (!packages || packages.length === 0) {
    const { data: fallbackPkgs } = await crmRepo.getAllPackagesWithCustomerInfo();
    packages = fallbackPkgs || [];
  }

  // CROSS-DOMAIN READS directly in Service Layer
  const { data: todayOrders } = await supabaseAdmin
    .from('operations_orders')
    .select('customer_id, daily_menu_id, daily_menus:daily_menu_id(meal_type)')
    .eq('date', targetDate);

  let totalLunch = 0;
  let totalDinner = 0;
  const specialRequests = [];

  if (todayOrders && todayOrders.length > 0) {
    todayOrders.forEach(o => {
      const mtype = (o.daily_menus?.meal_type || '').toUpperCase();
      if (mtype.includes('LUNCH')) totalLunch++;
      else if (mtype.includes('DINNER')) totalDinner++;
    });
  }

  const deliveryList = packages.map(pkg => {
    let isLunch = (pkg.meal_type || '').toLowerCase().includes('lunch');
    let isDinner = (pkg.meal_type || '').toLowerCase().includes('dinner');
    
    if (!todayOrders || todayOrders.length === 0) {
      if (isLunch) totalLunch++;
      if (isDinner) totalDinner++;
    }
    
    const restrictions = [];
    const health = pkg.customers?.customer_health?.[0] || pkg.customers?.customer_health || {};
    const lifestyle = pkg.customers?.customer_lifestyle?.[0] || pkg.customers?.customer_lifestyle || {};
    
    if (health.allergies && health.allergies !== 'None') restrictions.push(health.allergies);
    if (health.special_requests && health.special_requests !== 'None') restrictions.push(health.special_requests);
    if (lifestyle.food_restriction && lifestyle.food_restriction !== 'None') restrictions.push(lifestyle.food_restriction);
    
    const restrictionStr = restrictions.join(', ');
    if (restrictionStr && pkg.customers?.full_name) {
      specialRequests.push({ customer: pkg.customers.full_name, request: restrictionStr, type: pkg.meal_type || 'Lunch & Dinner' });
    }

    return {
      package_id: pkg.id,
      customer_id: pkg.customer_id,
      name: pkg.customers.full_name,
      phone: pkg.customers.phone,
      delivery_address: pkg.customers.delivery_address || pkg.customers.address || 'No Address',
      delivery_notes: pkg.customers.delivery_notes || '',
      meal_type: pkg.meal_type,
      restrictions: restrictionStr || 'None'
    };
  });

  const { data: dailyMenus } = await supabaseAdmin
    .from('operations_daily_menus')
    .select('*')
    .eq('date', targetDate);

  const { data: menuTypes } = await supabaseAdmin.from('operations_menu_types').select('*');
  const { data: menus } = await supabaseAdmin.from('operations_menus').select('*');
  const { data: recipes } = await supabaseAdmin.from('operations_recipes').select('*');
  const { data: inventoryItems } = await supabaseAdmin.from('inventory_items').select('*');

  const enrichedDailyMenus = (dailyMenus || []).map(dm => {
    const types = menuTypes?.filter(mt => mt.daily_menus_id === dm.id) || [];
    const enrichedTypes = types.map(mt => ({
      ...mt,
      menu: menus?.find(m => m.id === mt.menu_id) || { name_en: 'Uncosted Item', name_mm: '' }
    }));
    return { ...dm, menu_types: enrichedTypes };
  }).filter(dm => dm.menu_types && dm.menu_types.length > 0);

  const bomMap = new Map();
  
  enrichedDailyMenus.forEach(dm => {
    const mtype = (dm.meal_type || '').toUpperCase();
    const multiplier = mtype.includes('LUNCH') ? totalLunch : (mtype.includes('DINNER') ? totalDinner : totalLunch);
    if (multiplier === 0) return;
    
    dm.menu_types.forEach(mt => {
      if (!mt.menu_id) return;
      const menuRecipes = recipes?.filter(r => r.menu_id === mt.menu_id) || [];
      
      menuRecipes.forEach(recipe => {
        const item = inventoryItems?.find(i => i.id === recipe.inventory_item_id);
        if (!item) return;
        
        if (!bomMap.has(item.id)) {
          bomMap.set(item.id, {
            id: item.id,
            name: item.name_eng,
            name_mm: item.name_mm,
            uom: item.unit_of_measure,
            qty: 0
          });
        }
        const current = bomMap.get(item.id);
        current.qty += (recipe.qty * multiplier);
      });
    });
  });

  const aggregatedBOM = Array.from(bomMap.values()).sort((a, b) => b.qty - a.qty);

  return {
    headcount: { totalLunch, totalDinner },
    specialRequests,
    deliveryList,
    dailyMenus: enrichedDailyMenus,
    aggregatedBOM,
    targetDate
  };
}

export async function getDashboard() {
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];
  const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const thisMonthStart = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1).toISOString().split('T')[0];

  const sevenMonthsAgo = new Date();
  sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
  sevenMonthsAgo.setDate(1);
  const sevenMonthsAgoStr = sevenMonthsAgo.toISOString().split('T')[0];

  const [
    { count: totalCustomers },
    { data: allPackages },
    { data: allInquiriesForStatus },
    { data: convertedLeads },
    { count: upcomingBookings },
    { data: upcomingRenewals },
    { data: recentLeads },
    { data: recentCustomers },
    { data: allInquiriesForSource },
    { data: recentFeedbacks },
  ] = await crmRepo.getDashboardMetrics(today, thirtyDaysLater, thisMonthStart, sevenMonthsAgoStr);

  const pkgs = allPackages || [];
  let totalRevenue = 0;
  let activeCustomersSet = new Set();
  let hasExpiredPackagesSet = new Set();
  let hasAnyPackageSet = new Set();

  pkgs.forEach(pkg => {
    hasAnyPackageSet.add(pkg.customer_id);
    if (pkg.payment_status === 'Paid') {
      totalRevenue += (Number(pkg.amount) || 0);
    }
    
    const expiresAtDate = pkg.expires_at ? new Date(pkg.expires_at) : new Date();
    expiresAtDate.setHours(0,0,0,0);
    const todayCompare = new Date();
    todayCompare.setHours(0,0,0,0);

    const isActive = (expiresAtDate >= todayCompare) && ['Active', 'Paused', 'Upcoming'].includes(pkg.status);

    if (isActive) {
      activeCustomersSet.add(pkg.customer_id);
    } else {
      hasExpiredPackagesSet.add(pkg.customer_id);
    }
  });

  let churnedCustomers = 0;
  hasExpiredPackagesSet.forEach(cid => {
    if (!activeCustomersSet.has(cid)) churnedCustomers++;
  });

  let hotProspects = 0, followUpProspects = 0, pendingProspects = 0, lostProspects = 0;
  (allInquiriesForStatus || []).forEach(inq => {
    const s = (inq.status || '').toLowerCase();
    
    if (inq.customer_id || s === 'converted') {
      return;
    }

    if (['hot', 'new', 'initial_contact'].includes(s)) {
      hotProspects++;
    } else if (['pending', 'payment_pending'].includes(s)) {
      pendingProspects++;
    } else if (['lost', 'closed'].includes(s)) {
      lostProspects++;
    } else {
      followUpProspects++;
    }
  });

  const mappedRenewals = (upcomingRenewals || []).map(pkg => {
    const daysLeft = Math.ceil((new Date(pkg.expires_at) - new Date(today)) / (1000 * 60 * 60 * 24));
    return {
      customerId: pkg.customer_id,
      customerName: pkg.customers?.full_name || 'Unknown',
      packageName: pkg.name,
      daysLeft: daysLeft
    };
  });

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

  const sourceCounts = {
    'Facebook': 0, 'Telegram': 0, 'Website': 0, 'Referral': 0, 'Other': 0
  };
  (allInquiriesForSource || []).forEach(inq => {
    let src = inq.source?.toLowerCase() || '';
    if (src === 'messenger' || src === 'facebook') sourceCounts['Facebook']++;
    else if (src === 'telegram') sourceCounts['Telegram']++;
    else if (src === 'website') sourceCounts['Website']++;
    else if (src === 'referral') sourceCounts['Referral']++;
    else sourceCounts['Other']++;
  });

  const flaggedFeedback = (recentFeedbacks || [])
    .filter(fb => {
      const comment = fb.comment || '';
      if (comment.includes('[RESOLVED]')) return false;
      return fb.rating <= 2 || comment.includes('[COMPLAIN]') || comment.includes('[REQUEST]');
    })
    .map(fb => {
      let type = 'Issue';
      if (fb.comment?.includes('[REQUEST]')) type = 'Request';
      else if (fb.comment?.includes('[COMPLAIN]')) type = 'Complaint';
      else if (fb.rating <= 2) type = 'Low Rating';
      
      let cleanText = (fb.comment || '')
        .replace(/\[GENERAL\]/g, '')
        .replace(/\[MENU\]/g, '')
        .replace(/\[FEEDBACK\]/g, '')
        .replace(/\[COMPLAIN\]/g, '')
        .replace(/\[REQUEST\]/g, '')
        .trim();

      return {
        id: fb.id,
        customerName: fb.customers?.full_name || 'Unknown',
        date: new Date(fb.created_at).toLocaleDateString(),
        text: cleanText,
        type: type,
        rating: fb.rating
      };
    });

  return {
    totalRevenue,
    totalCustomers: totalCustomers || 0,
    activeCustomers: activeCustomersSet.size,
    churnedCustomers,
    hotProspects,
    followUpProspects,
    pendingProspects,
    lostProspects,
    upcomingRenewals: mappedRenewals,
    recentLeads: recentLeads || [],
    customerGrowth: customerGrowth,
    sourceCounts: sourceCounts,
    flaggedFeedback: flaggedFeedback
  };
}

export async function getSegment(segment) {
  const today = new Date();
  today.setHours(0,0,0,0);

  if (segment === 'revenue') {
    const { data, error } = await crmRepo.getSegmentRevenue();
    if (error) throw error;
    return data;
  } 
  else if (segment === 'customers') {
    const { data, error } = await crmRepo.getSegmentCustomers();
    if (error) throw error;
    return data;
  } 
  else if (segment === 'active') {
    const { data, error } = await crmRepo.getSegmentActivePackages();
    if (error) throw error;
    
    const filtered = data.filter(pkg => {
      const exp = pkg.expires_at ? new Date(pkg.expires_at) : new Date();
      exp.setHours(0,0,0,0);
      return (exp >= today) && ['Active', 'Paused', 'Upcoming'].includes(pkg.status);
    });
    return filtered;
  } 
  else if (segment === 'churned') {
    const { data: allPackages, error: pkgErr } = await crmRepo.getSegmentAllPackagesForChurn();
    if (pkgErr) throw pkgErr;

    let activeSet = new Set();
    let hasExpiredSet = new Set();
    let customerMap = new Map();

    (allPackages || []).forEach(pkg => {
      customerMap.set(pkg.customer_id, pkg.customers);
      const exp = pkg.expires_at ? new Date(pkg.expires_at) : new Date();
      exp.setHours(0,0,0,0);
      
      const isActive = (exp >= today) && ['Active', 'Paused', 'Upcoming'].includes(pkg.status);

      if (isActive) {
        activeSet.add(pkg.customer_id);
      } else {
        hasExpiredSet.add(pkg.customer_id);
      }
    });

    let churned = [];
    hasExpiredSet.forEach(cid => {
      if (!activeSet.has(cid)) churned.push(customerMap.get(cid));
    });
    return churned;
  } 
  else if (segment === 'hot' || segment === 'pending' || segment === 'lost') {
    const { data, error } = await crmRepo.getSegmentInquiriesByStatus(segment);
    if (error) throw error;
    return data;
  } 
  else if (segment === 'follow_up') {
    const { data, error } = await crmRepo.getSegmentInquiriesFollowUp();
    if (error) throw error;
    return data;
  } 
  else {
    return [];
  }
}

class Mutex {
  constructor() { this._queue = []; this._locked = false; }
  async acquire() {
    return new Promise(resolve => {
      this._queue.push(resolve);
      this._dispatch();
    });
  }
  _dispatch() {
    if (this._locked || this._queue.length === 0) return;
    this._locked = true;
    const next = this._queue.shift();
    next(() => {
      this._locked = false;
      this._dispatch();
    });
  }
}


export const customerCreationMutex = new Mutex();

export async function generateCustomerCode() {
  const { data } = await supabaseAdmin
    .schema('crm')
    .from('customers')
    .select('customer_code')
    .order('id', { ascending: false })
    .limit(1);
    
  let num = 1;
  if (data && data.length > 0 && data[0].customer_code) {
    const match = data[0].customer_code.match(/\d+$/);
    if (match) {
      num = parseInt(match[0], 10) + 1;
    }
  }
  return `BBD-${String(num).padStart(3, '0')}`;
}

// ──────────────────────────────────────────────────────────────────
// CRM PUBLIC API CAPABILITIES (Implementation)
// ──────────────────────────────────────────────────────────────────

export async function getCustomerDeliveryInfo(customerIds) {
  if (!customerIds || customerIds.length === 0) return [];
  return crmRepo.getCustomerDeliveryInfo(customerIds);
}

export async function updateDeliveryProof(customerId, proofUrl) {
  const currentNotes = await crmRepo.getCustomerDeliveryNotes(customerId);
  let newNotes = currentNotes;
  if (!currentNotes.includes(proofUrl)) {
    const photoTag = `📸 POD: ${proofUrl}`;
    newNotes = currentNotes ? `${currentNotes} | ${photoTag}` : photoTag;
  }
  await crmRepo.updateCustomerDeliveryPhotoAndNotes(customerId, proofUrl, newNotes);
  return { success: true, updatedNotes: newNotes };
}

export async function completeOnboarding(token, formData) {
  // 1. Validate token
  const inquiry = await crmRepo.getInquiryByToken(token);
  if (!inquiry) throw new Error('Invalid or expired token.');

  let newCustomer = null;
  const release = await customerCreationMutex.acquire();
  try {
    const customer_code = await generateCustomerCode();

    const formattedDeliveryNotes = formData.delivery_notes 
      ? formData.delivery_notes.map(n => `[${n.date} - ${n.type}]: ${n.text}`).join(' | ') 
      : null;

    const custObj = {
      full_name: formData.full_name,
      facebook_name: inquiry.prospect_name || null,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || 'Unknown',
      email: formData.email || null,
      phone: formData.phone || inquiry.prospect_contact || null,
      address: formData.home_address_parsed || formData.home_address || null,
      delivery_address: formData.delivery_address_parsed || formData.delivery_address || formData.home_address || null,
      delivery_notes: formattedDeliveryNotes || null,
      customer_code
    };

    if (formData.delivery_spot_photo_url) {
      custObj.delivery_spot_photo_url = formData.delivery_spot_photo_url;
    }

    newCustomer = await crmRepo.insertCustomerFallback(custObj);
  } finally {
    release();
  }

  // Insert health record
  const healthObj = {
    customer_id: newCustomer.id,
    current_weight: formData.current_weight ? `${formData.current_weight} kg` : null,
    goal_weight: formData.goal_weight ? `${formData.goal_weight} kg` : null,
    height: formData.height ? `${formData.height} cm` : null,
    medical_condition: formData.medical_conditions || 'None',
    medicine_taking: formData.medicine_taking || 'None',
    special_requests: formData.chef_requests || 'None',
    allergies: formData.allergies || 'None',
    bmi_at_enrollment: formData.bmi_at_enrollment ? parseFloat(formData.bmi_at_enrollment) : null,
    recommended_weight_min: formData.recommended_weight_min ? parseFloat(formData.recommended_weight_min) : null,
    recommended_weight_max: formData.recommended_weight_max ? parseFloat(formData.recommended_weight_max) : null,
  };
  await crmRepo.insertCustomerHealth(healthObj);

  // Insert lifestyle record
  const lifestyleObj = {
    customer_id: newCustomer.id,
    food_restriction: formData.allergies || 'None',
    activity_level: formData.activity_level || 'Sedentary',
    fasting_willingness: formData.fasting_willingness || 'No'
  };
  await crmRepo.insertCustomerLifestyle(lifestyleObj);

  // Update Inquiry Status
  await crmRepo.updateInquiryStatus(inquiry.id, newCustomer.id);

  // Auto Assign the selected package
  let selectedPackage = null;
  if (formData.package_id) {
    selectedPackage = await crmRepo.getPackageDefinition(formData.package_id);
  }
  if (!selectedPackage && inquiry.selected_package) {
    selectedPackage = inquiry.selected_package;
  }

  if (selectedPackage) {
    const pkg = selectedPackage;
    let durationDays = 30;
    if (pkg.duration) {
      const durStr = String(pkg.duration).toLowerCase();
      const num = parseInt(durStr) || 1;
      if (durStr.includes('week') || durStr.includes('wk')) durationDays = num * 7;
      else if (durStr.includes('month') || durStr.includes('mo')) durationDays = num * 30;
      else if (durStr.includes('year') || durStr.includes('yr')) durationDays = num * 365;
      else if (durStr.includes('day')) durationDays = num;
      else durationDays = num;
    }
    
    const startDate = formData.start_date ? new Date(formData.start_date) : new Date();
    if (!formData.start_date) {
      startDate.setDate(startDate.getDate() + 1);
    }
    startDate.setHours(0, 0, 0, 0);
    
    const expiresAt = new Date(startDate);
    expiresAt.setDate(startDate.getDate() + durationDays);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const packageStatus = startDate > today ? 'Upcoming' : 'Active';

    const mealType = pkg.meal_type || 'Lunch & Dinner';
    let mealsPerDay = 1;
    if (mealType.toLowerCase().includes('lunch') && mealType.toLowerCase().includes('dinner')) mealsPerDay = 2;
    if (mealType.toLowerCase().includes('breakfast') && mealType.toLowerCase().includes('lunch') && mealType.toLowerCase().includes('dinner')) mealsPerDay = 3;
    
    const calculatedMealCount = pkg.meal_count || (durationDays * mealsPerDay);

    await crmRepo.insertCustomerPackage({ 
      customer_id: newCustomer.id, 
      name: pkg.name || 'BBD Plan', 
      status: packageStatus, 
      expires_at: expiresAt.toISOString(),
      amount: pkg.price || 0,
      payment_status: 'Paid',
      meal_type: mealType,
      meal_count: calculatedMealCount,
      total_days: durationDays,
      remaining_days: durationDays
    });
  }

  // Add to MailerLite
  if (formData.email) {
    import('../../../routes/mailerlite.js').then(({ default: mailerlite }) => {
      mailerlite.addSubscriber(formData.email, formData.full_name, { age: formData.age, gender: formData.gender, phone: formData.phone }).catch(e => console.error('[MailerLite Add Failed]', e.message));
    }).catch(err => console.error('Failed to load mailerlite module', err));
  }

  return newCustomer;
}

export async function enrollPublicCustomer(formData) {
  let newCustomer = null;
  const release = await customerCreationMutex.acquire();
  try {
    const customer_code = await generateCustomerCode();

    const custObj = {
      full_name: formData.full_name,
      facebook_name: formData.facebook_name || null,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      delivery_address: formData.delivery_address || null,
      delivery_notes: formData.delivery_notes || null,
      customer_code
    };

    newCustomer = await crmRepo.insertCustomerFallback(custObj);
  } finally {
    release();
  }

  const healthObj = {
    customer_id: newCustomer.id,
    current_weight: formData.current_weight ? `${formData.current_weight} kg` : null,
    goal_weight: formData.goal_weight ? `${formData.goal_weight} kg` : null,
    height: formData.height ? `${formData.height} cm` : null,
    time_frame: formData.time_frame || null,
    medical_condition: formData.medical_condition || 'None',
    other_condition: formData.other_condition || 'None',
    medicine_taking: formData.medicine_taking || 'None',
    special_requests: formData.special_requests || 'None',
  };
  await crmRepo.insertCustomerHealth(healthObj);

  const lifestyleObj = {
    customer_id: newCustomer.id,
    food_restriction: formData.food_restriction || 'None',
    activity_level: formData.activity_level || 'Sedentary',
    fasting_willingness: formData.fasting_willingness || 'No'
  };
  await crmRepo.insertCustomerLifestyle(lifestyleObj);

  return newCustomer;
}

export async function logCustomerWeight(customerId, currentWeightKg) {
  const existingHealth = await crmRepo.getCustomerHealth(customerId);
  const newWeightStr = `${currentWeightKg} kg`;
  if (existingHealth) {
    await crmRepo.updateCustomerWeight(customerId, newWeightStr);
  } else {
    await crmRepo.insertCustomerWeight(customerId, newWeightStr);
  }
  return true;
}

export async function findInquiriesByName(customerId, facebookName) {
  return crmRepo.getInquiryIdsByCustomerOrFacebook(customerId, facebookName);
}

export async function getChefMessengerConversationIds() {
  const conversationIds = new Set();
  try {
    const chefInquiries = await crmRepo.getChefInquiries();
    if (chefInquiries && chefInquiries.length > 0) {
      const inqIds = chefInquiries.map(i => i.id);
      const msgs = await crmRepo.getInquiryMessagesMetadata(inqIds);
      (msgs || []).forEach(m => {
        const cid = m.metadata?.conversationId || m.metadata?.message?.conversationId;
        if (cid) conversationIds.add(cid);
      });
    }
  } catch (err) {
    console.warn('[CRM SERVICE] Chef messenger lookup soft-fail:', err.message);
  }
  return Array.from(conversationIds);
}

export async function getActiveCustomerPackage(customerId) {
  return crmRepo.getActiveCustomerPackage(customerId);
}

export async function getCustomersWithHealthAndLifestyle(customerIds) {
  return crmRepo.getCustomersWithHealthAndLifestyle(customerIds);
}

export async function getActivePackagesForCustomers(customerIds) {
  return crmRepo.getActivePackagesForCustomers(customerIds);
}

export async function deductPackageMealCount(packageId, currentCount) {
  return crmRepo.deductPackageMealCount(packageId, currentCount);
}

export async function getActivePackagesForDate(targetDate) {
  const { data: packages, error: pkgErr } = await crmRepo.getCustomerPackagesGteExpiresAt(targetDate);
  if (pkgErr) throw pkgErr;

  let activePackages = packages;
  if (!activePackages || activePackages.length === 0) {
    const { data: fallbackPkgs } = await crmRepo.getAllCustomerPackages();
    activePackages = fallbackPkgs || [];
  }

  return activePackages;
}

export async function getCustomerWelcomeDossier(customerId) {
  const customer = await crmRepo.getCustomerProfileBase(customerId);
  const health = await crmRepo.getCustomerHealth(customerId);
  const lifestyle = await crmRepo.getCustomerLifestyle(customerId);
  const packages = await crmRepo.getCustomerPackagesAll(customerId);
  const feedbacks = await crmRepo.getCustomerFeedbacks(customerId);

  const totalSpend = (packages || []).reduce((sum, pkg) => sum + (pkg.amount || 0), 0);

  return {
    customer: {
      id: customer.id,
      customer_code: customer.customer_code,
      full_name: customer.full_name,
      facebook_name: customer.facebook_name,
      phone: customer.phone,
      total_spend: totalSpend
    },
    health: health || {},
    lifestyle: lifestyle || {},
    packages: packages || [],
    feedbacks: feedbacks || []
  };
}

export async function getCustomerMonthlyReview(customerId) {
  const customer = await crmRepo.getCustomerProfileBase(customerId);
  const health = await crmRepo.getCustomerHealth(customerId);
  const packages = await crmRepo.getCustomerPackagesAll(customerId);

  return {
    customer: {
      id: customer.id,
      customer_code: customer.customer_code,
      full_name: customer.full_name,
      facebook_name: customer.facebook_name,
      phone: customer.phone
    },
    health: health || {},
    package: packages && packages.length > 0 ? packages[0] : null
  };
}

export async function submitCustomerMonthlyReview(customerId, reviewData) {
  const { current_weight, active_feeling, health_improvements, feedback_comment } = reviewData;

  // 1. Update customer_health with new current_weight via CRM module
  await logCustomerWeight(customerId, current_weight);

  // 2. Insert feedback entry
  const newWeightStr = `${current_weight} kg`;
  const commentStr = `[Monthly Review Milestone]\nCurrent Weight Reported: ${newWeightStr}\nFeel Active & Light: ${active_feeling || 'Yes'}\nHealth Improvements: ${health_improvements || 'None'}\nComment: ${feedback_comment || 'None'}`;

  await crmRepo.insertFeedback(customerId, 5, commentStr);

  // 3. Return updated data for caller (router) to handle notifications
  const customer = await crmRepo.getCustomerProfileBase(customerId);
  
  return {
    success: true,
    message: 'Monthly milestone review submitted successfully!',
    updatedWeight: newWeightStr,
    customerName: customer ? customer.full_name : 'Customer'
  };
}

export async function markInactiveProspectsAsLost(daysInactive = 3) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysInactive);

  const inquiries = await crmRepo.getInactiveInquiries(thresholdDate.toISOString());
  if (!inquiries || inquiries.length === 0) {
    return 0;
  }

  const inquiryIds = inquiries.map(inq => inq.id);
  await crmRepo.bulkUpdateInquiriesLost(inquiryIds);

  return inquiryIds.length;
}

export async function getFormReminderCandidates(hours = 24) {
  const threshold = new Date();
  threshold.setHours(threshold.getHours() - hours);
  
  const inquiries = await crmRepo.getFormSentInquiriesBefore(threshold.toISOString());
  
  const candidates = [];
  for (const inq of inquiries) {
    const conversationId = await crmRepo.getLatestProspectConversationId(inq.id);
    if (conversationId) {
      candidates.push({
        id: inq.id,
        prospect_name: inq.prospect_name,
        onboarding_token: inq.onboarding_token,
        conversation_id: conversationId
      });
    }
  }
  return candidates;
}

export async function logFormReminderAttempt(inquiryId, messageText) {
  return await crmRepo.insertInquiryReminderMessage(inquiryId, messageText);
}

export async function markFormReminderCooldown(inquiryId) {
  return await crmRepo.updateInquiryUpdatedAt(inquiryId);
}

export async function getEnrollmentFormContext(token) {
  const { data: inquiry, error: inqErr } = await crmRepo.getEnrollmentInquiryByToken(token);
  if (inqErr || !inquiry) {
    const err = new Error('Invalid or expired token');
    err.status = 404;
    throw err;
  }

  if (inquiry.onboarding_status === 'completed') {
    const err = new Error('Form already submitted');
    err.status = 400;
    err.completed = true;
    throw err;
  }

  const formSettings = await crmRepo.getFormSchema('enrollment');
  const defaultSchema = [
    // Basic Info
    { id: 'name', type: 'text', label: 'Full Name', required: true, section: '01. Basic Information', width: 'half', placeholder: 'e.g. Aung Aung' },
    { id: 'fb_name', type: 'text', label: 'Facebook Name', required: true, section: '01. Basic Information', width: 'half', placeholder: 'Auto-filled', readonly: true },
    { id: 'age', type: 'number', label: 'Age', required: true, section: '01. Basic Information', width: 'third', placeholder: 'e.g. 28' },
    { id: 'gender', type: 'dropdown', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'], section: '01. Basic Information', width: 'third' },
    { id: 'phone', type: 'text', label: 'Phone Number', required: true, section: '01. Basic Information', width: 'third', placeholder: 'e.g. 09123456789' },
    { id: 'package_id', type: 'dropdown', label: 'Select Package', required: true, section: '01. Basic Information', width: 'half' },
    { id: 'start_date', type: 'date', label: 'Desired Start Date', required: true, section: '01. Basic Information', width: 'half' },
    { id: 'home_address', type: 'textarea', label: 'Home Address', required: false, section: '01. Basic Information', width: 'full', placeholder: 'Home address' },
    { id: 'delivery_address', type: 'textarea', label: 'Delivery Address', required: true, section: '01. Basic Information', width: 'full', placeholder: 'Full address for meal delivery' },
    { id: 'delivery_notes', type: 'text', label: 'Delivery Notes (Optional)', required: false, section: '01. Basic Information', width: 'full', placeholder: 'e.g. Leave at security gate, call when arrived' },

    // Physical & Health Profile
    { id: 'current_weight', type: 'number', label: 'Current Weight (kg)', required: true, section: '02. Physical & Health Profile', width: 'third' },
    { id: 'goal_weight', type: 'number', label: 'Goal Weight (kg)', required: true, section: '02. Physical & Health Profile', width: 'third' },
    { id: 'height', type: 'number', label: 'Height (cm)', required: true, section: '02. Physical & Health Profile', width: 'third' },
    { id: 'medical_conditions', type: 'text', label: 'Medical Conditions', required: false, section: '02. Physical & Health Profile', width: 'half', placeholder: 'e.g. Diabetes, Hypertension' },
    { id: 'medicine_taking', type: 'text', label: 'Medicine Taking', required: false, section: '02. Physical & Health Profile', width: 'half', placeholder: 'List any medications' },

    // Lifestyle & Diet Prep
    { id: 'allergies', type: 'text', label: 'Food Restrictions / Allergies', required: false, section: '03. Lifestyle & Diet Prep', width: 'half', placeholder: 'e.g. No Pork, Seafood allergy' },
    { id: 'chef_requests', type: 'text', label: 'Special Chef Requests', required: false, section: '03. Lifestyle & Diet Prep', width: 'half', placeholder: 'e.g. Less salty, no spicy' },
    { id: 'activity_level', type: 'dropdown', label: 'Activity Level', required: false, options: ['Sedentary (Little to no exercise)', 'Lightly active', 'Moderately active', 'Very active'], section: '03. Lifestyle & Diet Prep', width: 'half' },
    { id: 'fasting_willingness', type: 'dropdown', label: 'Fasting Willingness', required: false, options: ['No, prefer regular meals', 'Yes, 16:8 fasting', 'Yes, 14:10 fasting'], section: '03. Lifestyle & Diet Prep', width: 'half' }
  ];

  let finalSchema = formSettings?.schema?.length > 0 ? formSettings.schema : defaultSchema;

  const packages = await crmRepo.getPackagesList();
  if (packages && packages.length > 0) {
    const packageOptions = packages.map(p => ({ label: `${p.name} - ${p.duration} days`, value: p.id, pkg_data: p }));
    finalSchema = finalSchema.map(field => {
      if (field.id === 'package_id') {
        return { ...field, type: 'dropdown', options: packageOptions };
      }
      return field;
    });
  }

  return {
    inquiry: {
      id: inquiry.id,
      prospect_name: inquiry.prospect_name,
      service_interest: inquiry.service_interest,
      package: inquiry.selected_package
    },
    packages: packages || [],
    schema: finalSchema
  };
}

export async function getCustomerAddressProfile(customerIdOrCode) {
  const customer = await crmRepo.getCustomerByCodeOrId(customerIdOrCode);
  if (!customer) {
    const err = new Error('Customer profile not found');
    err.status = 404;
    throw err;
  }
  return customer;
}

export async function updateCustomerAddressProfile(customerIdOrCode, payload) {
  const existingCustomer = await crmRepo.getCustomerByCodeOrId(customerIdOrCode);
  if (!existingCustomer) {
    const err = new Error('Customer profile not found');
    err.status = 404;
    throw err;
  }

  let finalNotes = payload.delivery_notes || existingCustomer.delivery_notes || '';
  if (payload.maps_url) {
    const linkNote = `📍 Maps Link: ${payload.maps_url}`;
    if (!finalNotes.includes(payload.maps_url)) {
      finalNotes = finalNotes ? `${finalNotes} | ${linkNote}` : linkNote;
    }
  }

  if (payload.delivery_spot_photo_url) {
    const photoNote = `📸 Photo: ${payload.delivery_spot_photo_url}`;
    if (!finalNotes.includes(payload.delivery_spot_photo_url)) {
      finalNotes = finalNotes ? `${finalNotes} | ${photoNote}` : photoNote;
    }
  }

  const updatePayload = {
    delivery_address: payload.delivery_address || null,
    delivery_notes: finalNotes || null
  };

  if (payload.delivery_spot_photo_url) {
    updatePayload.delivery_spot_photo_url = payload.delivery_spot_photo_url;
  }

  await crmRepo.updateCustomerAddress(existingCustomer.id, updatePayload);
  return true;
}

export async function submitChurnExit(payload) {
  const { customerId, reasonCategory, comments, wouldRecommend } = payload;
  
  if (!customerId) {
    throw new Error('Missing customer ID');
  }

  const commentText = `[CHURN_EXIT][${reasonCategory || 'General'}]\nReason: ${reasonCategory || 'Not specified'}\nComments: ${comments || 'None'}\nWould Recommend: ${wouldRecommend ? 'Yes' : 'No'}`;
  
  return crmRepo.processChurnExit(customerId, commentText);
}

export async function submitReferral(payload) {
  const { referrerCustomerId, referredName, referredPhone, note } = payload;
  return crmRepo.processReferral(referrerCustomerId, referredName, referredPhone, note);
}

export async function submitPublicFeedback(payload) {
  const { customerId, rating, comment } = payload;
  const parsedCustomerId = parseInt(customerId);
  const finalRating = rating !== null && rating !== undefined ? parseInt(rating) : null;
  const commentText = comment || '';

  const result = await crmRepo.processPublicFeedback(parsedCustomerId, finalRating, commentText);
  return { ...result, finalRating };
}

export async function submitMenuFeedback(payload) {
  const { customerId, weekName, ratingsJson, bestPick, worstPick, comment } = payload;
  const parsedCustomerId = parseInt(customerId);
  const finalBestPick = bestPick || null;
  const finalWorstPick = worstPick || null;
  const finalComment = comment || null;

  return crmRepo.processMenuFeedback(parsedCustomerId, weekName, ratingsJson, finalBestPick, finalWorstPick, finalComment);
}
