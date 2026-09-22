import { supabaseAdmin } from '../../../lib/supabase.js';

export async function getAllLevelSettings() {
  return supabaseAdmin
    .schema('crm')
    .from('level_settings')
    .select('*')
    .order('required_spend', { ascending: true });
}

export async function createLevelSetting(payload) {
  return supabaseAdmin
    .schema('crm')
    .from('level_settings')
    .insert(payload)
    .select()
    .single();
}

export async function updateLevelSetting(id, payload) {
  return supabaseAdmin
    .schema('crm')
    .from('level_settings')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
}

export async function deleteLevelSetting(id) {
  return supabaseAdmin
    .schema('crm')
    .from('level_settings')
    .delete()
    .eq('id', id);
}

// ──────────────────────────────────────────────────────────────────
// PACKAGES (MASTER CATALOG)
// ──────────────────────────────────────────────────────────────────

export async function getAllPackages() {
  return supabaseAdmin
    .schema('crm')
    .from('packages')
    .select('*')
    .order('created_at', { ascending: true });
}

export async function createPackage(payload) {
  return supabaseAdmin
    .schema('crm')
    .from('packages')
    .insert(payload)
    .select()
    .single();
}

export async function updatePackage(id, payload) {
  return supabaseAdmin
    .schema('crm')
    .from('packages')
    .update(payload)
    .eq('id', id);
}

export async function deletePackage(id) {
  return supabaseAdmin
    .schema('crm')
    .from('packages')
    .delete()
    .eq('id', id);
}

// ──────────────────────────────────────────────────────────────────
// FORM SETTINGS
// ──────────────────────────────────────────────────────────────────

export async function getFormSettings(formName) {
  return supabaseAdmin
    .schema('crm')
    .from('form_settings')
    .select('*')
    .eq('form_name', formName)
    .single();
}

export async function upsertFormSettings(payload) {
  return supabaseAdmin
    .schema('crm')
    .from('form_settings')
    .upsert(payload, { onConflict: 'form_name' })
    .select()
    .single();
}

// ──────────────────────────────────────────────────────────────────
// FEEDBACKS
// ──────────────────────────────────────────────────────────────────

export async function getAllFeedbacks() {
  return supabaseAdmin.schema('crm')
    .from('feedbacks')
    .select('*, customers(*)')
    .order('created_at', { ascending: false });
}

export async function deleteFeedback(id) {
  return supabaseAdmin.schema('crm')
    .from('feedbacks')
    .delete()
    .eq('id', id);
}

export async function getDailyFeedbacks() {
  return supabaseAdmin.schema('crm')
    .from('daily_feedbacks')
    .select('*, customers(id, full_name, phone, status)')
    .order('created_at', { ascending: false });
}

export async function getFeedbackComment(id) {
  return supabaseAdmin.schema('crm')
    .from('feedbacks')
    .select('comment')
    .eq('id', id)
    .single();
}

export async function updateFeedbackComment(id, comment) {
  return supabaseAdmin.schema('crm')
    .from('feedbacks')
    .update({ comment })
    .eq('id', id);
}

// ──────────────────────────────────────────────────────────────────
// CUSTOMER PACKAGES (OPERATIONS CAPABILITIES)
// ──────────────────────────────────────────────────────────────────

export async function getCustomerPackagesGteExpiresAt(targetDate) {
  return supabaseAdmin.schema('crm')
    .from('customer_packages')
    .select('*')
    .or(`status.eq.Active,status.eq.ACTIVE,payment_status.eq.Paid`)
    .gte('expires_at', targetDate);
}

export async function getAllCustomerPackages() {
  return supabaseAdmin.schema('crm')
    .from('customer_packages')
    .select('*');
}

export async function getActiveCustomerPackagesForDeduct() {
  return supabaseAdmin.schema('crm')
    .from('customer_packages')
    .select('id, meal_count')
    .eq('status', 'Active')
    .gt('meal_count', 0);
}

export async function bulkUpdatePackageMealCount(ids, mealCount) {
  return supabaseAdmin.schema('crm')
    .from('customer_packages')
    .update({ meal_count: mealCount })
    .in('id', ids);
}

export async function getActivePackagesWithCustomerInfo(targetDate) {
  return supabaseAdmin.schema('crm')
    .from('customer_packages')
    .select(`
      *,
      customers:customer_id ( 
        full_name, phone, address, delivery_address, delivery_notes,
        customer_health ( allergies, medical_condition, special_requests ),
        customer_lifestyle ( food_restriction )
      )
    `)
    .or(`status.eq.Active,status.eq.ACTIVE,payment_status.eq.Paid`)
    .gte('expires_at', targetDate);
}

export async function getAllPackagesWithCustomerInfo() {
  return supabaseAdmin.schema('crm')
    .from('customer_packages')
    .select(`
      *,
      customers:customer_id ( 
        full_name, phone, address, delivery_address, delivery_notes,
        customer_health ( allergies, medical_condition, special_requests ),
        customer_lifestyle ( food_restriction )
      )
    `);
}

export async function getDashboardMetrics(today, thirtyDaysLater, thisMonthStart, sevenMonthsAgoStr) {
  return Promise.all([
    supabaseAdmin.schema('crm').from('customers').select('*', { count: 'exact', head: true }),
    supabaseAdmin.schema('crm').from('customer_packages').select('customer_id, status, expires_at, amount, payment_status'),
    supabaseAdmin.schema('crm').from('inquiries').select('id, status, notes, updated_at, customer_id'),
    supabaseAdmin.schema('crm').from('inquiries').select('*', { count: 'exact' }).eq('status', 'converted').gte('created_at', thisMonthStart),
    supabaseAdmin.schema('crm').from('customer_packages').select('*', { count: 'exact', head: true }).eq('status', 'Upcoming'),
    supabaseAdmin.schema('crm').from('customer_packages').select('*, customers!inner(full_name, facebook_name)').gte('expires_at', today).lte('expires_at', thirtyDaysLater).order('expires_at', { ascending: true }).limit(5),
    supabaseAdmin.schema('crm').from('inquiries').select('*').is('customer_id', null).neq('status', 'converted').order('created_at', { ascending: false }).limit(6),
    supabaseAdmin.schema('crm').from('customers').select('created_at').gte('created_at', sevenMonthsAgoStr),
    supabaseAdmin.schema('crm').from('inquiries').select('source'),
    supabaseAdmin.schema('crm').from('feedbacks').select('*, customers!inner(full_name)').order('created_at', { ascending: false }).limit(30),
  ]);
}

export async function getSegmentRevenue() {
  return supabaseAdmin.schema('crm').from('customer_packages').select('*, customers!inner(full_name, phone, customer_code)').eq('payment_status', 'Paid').order('created_at', { ascending: false });
}

export async function getSegmentCustomers() {
  return supabaseAdmin.schema('crm').from('customers').select('*').order('created_at', { ascending: false });
}

export async function getSegmentActivePackages() {
  return supabaseAdmin.schema('crm').from('customer_packages')
    .select('*, customers!inner(full_name, phone, customer_code)')
    .in('status', ['Active', 'Paused', 'Upcoming'])
    .order('expires_at', { ascending: false });
}

export async function getSegmentAllPackagesForChurn() {
  return supabaseAdmin.schema('crm').from('customer_packages').select('customer_id, status, expires_at, customers!inner(*)');
}

export async function getSegmentInquiriesByStatus(status) {
  return supabaseAdmin.schema('crm').from('inquiries').select('*').eq('status', status).order('created_at', { ascending: false });
}

export async function getSegmentInquiriesFollowUp() {
  return supabaseAdmin.schema('crm').from('inquiries').select('*')
    .is('customer_id', null)
    .not('status', 'eq', 'converted')
    .not('status', 'eq', 'hot')
    .not('status', 'eq', 'pending')
    .not('status', 'eq', 'lost')
    .order('created_at', { ascending: false });
}


// ──────────────────────────────────────────────────────────────────
// PUBLIC CAPABILITY REPOSITORY ACCESS
// ──────────────────────────────────────────────────────────────────

export async function getCustomerDeliveryInfo(customerIds) {
  try {
    const { data: customers, error } = await supabaseAdmin.schema('crm').from('customers')
      .select('id, full_name, phone, delivery_address, delivery_notes, delivery_spot_photo_url')
      .in('id', customerIds);
    if (error) throw error;
    return customers || [];
  } catch (e) {
    // Fallback if delivery_spot_photo_url column is missing
    const { data: customers } = await supabaseAdmin.schema('crm').from('customers')
      .select('id, full_name, phone, delivery_address, delivery_notes')
      .in('id', customerIds);
    return customers || [];
  }
}

export async function getCustomerDeliveryNotes(customerId) {
  const { data } = await supabaseAdmin.schema('crm').from('customers')
    .select('delivery_notes')
    .eq('id', customerId)
    .single();
  return data?.delivery_notes || '';
}

export async function updateCustomerDeliveryPhotoAndNotes(customerId, proofUrl, newNotes) {
  await supabaseAdmin.schema('crm').from('customers')
    .update({ 
      delivery_spot_photo_url: proofUrl,
      delivery_notes: newNotes
    })
    .eq('id', customerId);
}

export async function updateCustomerDeliveryNotes(customerId, notes) {
  await supabaseAdmin.schema('crm').from('customers')
    .update({ delivery_notes: notes })
    .eq('id', customerId);
}

export async function getInquiryIdsByCustomerOrFacebook(customerId, facebookName) {
  let { data: inquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').eq('customer_id', customerId);
  if ((!inquiries || inquiries.length === 0) && facebookName) {
    const { data: fbInquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').ilike('prospect_name', facebookName);
    if (fbInquiries && fbInquiries.length > 0) inquiries = fbInquiries;
  }
  return inquiries?.map(i => i.id) || [];
}

export async function getChefInquiries() {
  const { data } = await supabaseAdmin.schema('crm')
    .from('inquiries')
    .select('id, prospect_name')
    .or('prospect_name.ilike.%Phyoe Thuta%,prospect_name.ilike.%chef%,notes.ilike.%chef%');
  return data || [];
}

export async function getInquiryMessagesMetadata(inquiryIds) {
  if (!inquiryIds || inquiryIds.length === 0) return [];
  const { data } = await supabaseAdmin.schema('crm')
    .from('inquiries_messages')
    .select('metadata')
    .in('inquiry_id', inquiryIds)
    .not('metadata', 'is', null);
  return data || [];
}

export async function getCustomerHealth(customerId) {
  const { data } = await supabaseAdmin.schema('crm').from('customer_health')
    .select('*')
    .eq('customer_id', customerId)
    .single();
  return data;
}

export async function getCustomerLifestyle(customerId) {
  const { data } = await supabaseAdmin.schema('crm').from('customer_lifestyle')
    .select('*')
    .eq('customer_id', customerId)
    .single();
  return data;
}

export async function getCustomerProfileBase(customerId) {
  const { data, error } = await supabaseAdmin.schema('crm').from('customers')
    .select('*')
    .eq('id', customerId)
    .single();
  if (error) throw error;
  return data;
}

export async function getCustomerPackagesAll(customerId) {
  const { data } = await supabaseAdmin.schema('crm').from('customer_packages')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function getCustomerFeedbacks(customerId) {
  const { data } = await supabaseAdmin.schema('crm').from('feedbacks')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });
  return data || [];
}

export async function insertFeedback(customerId, rating, comment, type = null, status = null) {
  const payload = {
    customer_id: parseInt(customerId),
    rating: rating !== null ? parseInt(rating) : null,
    comment
  };
  if (type) payload.type = type;
  if (status) payload.status = status;

  const { data, error } = await supabaseAdmin.schema('crm').from('feedbacks')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCustomerWeight(customerId, weightStr) {
  await supabaseAdmin.schema('crm').from('customer_health')
    .update({ current_weight: weightStr, updated_at: new Date() })
    .eq('customer_id', customerId);
}

export async function insertCustomerWeight(customerId, weightStr) {
  await supabaseAdmin.schema('crm').from('customer_health')
    .insert({ customer_id: customerId, current_weight: weightStr });
}

export async function getActiveCustomerPackage(customerId) {
  const { data } = await supabaseAdmin.schema('crm').from('customer_packages')
    .select('id, name, expires_at, status, meal_count, remaining_days')
    .eq('customer_id', customerId)
    .in('status', ['Active', 'Paused', 'Upcoming'])
    .order('expires_at', { ascending: false })
    .limit(1)
    .single();
  return data;
}

export async function getInquiryByToken(token) {
  const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
    .select('*')
    .eq('onboarding_token', token)
    .single();
  if (error) throw error;
  return data;
}

export async function insertCustomerFallback(custObj) {
  try {
    const res = await supabaseAdmin.schema('crm').from('customers')
      .insert(custObj)
      .select()
      .single();
    if (res.error) throw res.error;
    return res.data;
  } catch (e) {
    delete custObj.delivery_spot_photo_url;
    const res = await supabaseAdmin.schema('crm').from('customers')
      .insert(custObj)
      .select()
      .single();
    if (res.error) throw res.error;
    return res.data;
  }
}

export async function insertCustomerHealth(healthObj) {
  await supabaseAdmin.schema('crm').from('customer_health').insert(healthObj);
}

export async function insertCustomerLifestyle(lifestyleObj) {
  await supabaseAdmin.schema('crm').from('customer_lifestyle').insert(lifestyleObj);
}

export async function updateInquiryStatus(inquiryId, customerId) {
  await supabaseAdmin.schema('crm').from('inquiries')
    .update({ 
      onboarding_status: 'completed',
      customer_id: customerId,
      status: 'converted'
    })
    .eq('id', inquiryId);
}

export async function getPackageDefinition(packageId) {
  const { data } = await supabaseAdmin.schema('crm').from('packages').select('*').eq('id', packageId).single();
  return data;
}

export async function insertCustomerPackage(pkgObj) {
  await supabaseAdmin.schema('crm').from('customer_packages').insert(pkgObj);
}



export async function getCustomersWithHealthAndLifestyle(customerIds) {
  if (!customerIds || customerIds.length === 0) return [];
  const { data } = await supabaseAdmin.schema('crm')
    .from('customers')
    .select(`
      *,
      customer_health ( allergies, medical_condition, special_requests ),
      customer_lifestyle ( food_restriction )
    `)
    .in('id', customerIds);
  return data || [];
}

export async function getActivePackagesForCustomers(customerIds) {
  if (!customerIds || customerIds.length === 0) return [];
  const { data } = await supabaseAdmin.schema('crm')
    .from('customer_packages')
    .select('*')
    .in('customer_id', customerIds)
    .or(`status.eq.Active,status.eq.ACTIVE,payment_status.eq.Paid`);
  return data || [];
}

export async function deductPackageMealCount(packageId, currentCount) {
  await supabaseAdmin.schema('crm')
    .from('customer_packages')
    .update({ meal_count: currentCount - 1 })
    .eq('id', packageId);
}

export async function getInactiveInquiries(dateThreshold) {
  const { data, error } = await supabaseAdmin.schema('crm')
    .from('inquiries')
    .select('id')
    .not('status', 'eq', 'converted')
    .not('status', 'ilike', 'lost')
    .lt('updated_at', dateThreshold);
  if (error) throw error;
  return data || [];
}

export async function bulkUpdateInquiriesLost(ids) {
  if (!ids || ids.length === 0) return;
  await supabaseAdmin.schema('crm')
    .from('inquiries')
    .update({ status: 'lost', updated_at: new Date().toISOString() })
    .in('id', ids);
}

export async function getFormSentInquiriesBefore(dateStr) {
  const { data, error } = await supabaseAdmin.schema('crm')
    .from('inquiries')
    .select('id, prospect_name, onboarding_token, updated_at')
    .eq('onboarding_status', 'form_sent')
    .lt('updated_at', dateStr);
  if (error) throw error;
  return data || [];
}

export async function getLatestProspectConversationId(inquiryId) {
  const { data, error } = await supabaseAdmin.schema('crm').from('inquiries_messages')
    .select('metadata')
    .eq('inquiry_id', inquiryId)
    .eq('sender_type', 'prospect')
    .not('metadata', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1);
    
  if (error) throw error;
  if (!data || data.length === 0) return null;
  
  const meta = data[0].metadata;
  return meta?.message?.conversationId || meta?.conversationId || null;
}

export async function insertInquiryReminderMessage(inquiryId, messageText) {
  const { data, error } = await supabaseAdmin.schema('crm').from('inquiries_messages')
    .insert({ 
      inquiry_id: inquiryId, 
      message_text: messageText, 
      sender_type: 'ai_bot', 
      metadata: { is_reminder: true } 
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function updateInquiryUpdatedAt(inquiryId) {
  const { error } = await supabaseAdmin.schema('crm')
    .from('inquiries')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', inquiryId);
    
  if (error) throw error;
  return true;
}

export async function getEnrollmentInquiryByToken(token) {
  const { data, error } = await supabaseAdmin.schema('crm').from('inquiries')
    .select('*')
    .eq('onboarding_token', token)
    .single();
  return { data, error };
}

export async function getFormSchema(formName) {
  const { data } = await supabaseAdmin.schema('crm').from('form_settings')
    .select('schema')
    .eq('form_name', formName)
    .single();
  return data;
}

export async function getPackagesList() {
  const { data } = await supabaseAdmin.schema('crm').from('packages')
    .select('*')
    .order('price', { ascending: true });
  return data;
}

export async function getCustomerByCodeOrId(identifier) {
  let query = supabaseAdmin.schema('crm').from('customers')
    .select('id, full_name, customer_code, address, delivery_address, delivery_notes, delivery_spot_photo_url');
  if (identifier.startsWith('BBD-') || !identifier.includes('-')) {
    query = query.eq('customer_code', identifier);
  } else {
    query = query.eq('id', identifier);
  }
  return await query.single();
}

export async function updateCustomerAddress(id, payload) {
  try {
    const { error } = await supabaseAdmin.schema('crm').from('customers')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  } catch (e) {
    if (payload.delivery_spot_photo_url !== undefined) {
      delete payload.delivery_spot_photo_url;
      const { error } = await supabaseAdmin.schema('crm').from('customers')
        .update(payload)
        .eq('id', id);
      if (error) throw error;
    } else {
      throw e;
    }
  }
}

export async function processChurnExit(customerId, commentText) {
  // 1. Insert Feedback
  const { data: feedback, error } = await supabaseAdmin.schema('crm').from('feedbacks')
    .insert({
      customer_id: parseInt(customerId),
      rating: 1,
      comment: commentText,
      type: 'churn_survey',
      status: 'open'
    })
    .select().single();
  
  if (error) throw error;

  // 2. Update Customer Status
  await supabaseAdmin.schema('crm').from('customers')
    .update({ status: 'churned', updated_at: new Date().toISOString() })
    .eq('id', customerId);

  // 3. Get Customer Name for Notification
  const { data: cust } = await supabaseAdmin.schema('crm').from('customers')
    .select('full_name')
    .eq('id', customerId)
    .single();

  return { feedback, customerName: cust ? cust.full_name : 'Customer' };
}

export async function processReferral(referrerCustomerId, referredName, referredPhone, note) {
  let referrerName = 'Existing Customer';
  if (referrerCustomerId) {
    const { data: refCust } = await supabaseAdmin.schema('crm').from('customers')
      .select('full_name')
      .eq('id', referrerCustomerId)
      .single();
    if (refCust) referrerName = refCust.full_name;
  }

  const { data: inquiry, error } = await supabaseAdmin.schema('crm').from('inquiries')
    .insert({
      prospect_name: referredName,
      contact_phone: referredPhone,
      source: 'Referral',
      status: 'new',
      requirements: `[REFERRAL] Referred by Customer ${referrerName} (ID: ${referrerCustomerId || 'N/A'}). Note: ${note || 'None'}`
    })
    .select().single();

  if (error) throw error;

  return { inquiry, referrerName };
}
