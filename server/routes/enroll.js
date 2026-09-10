import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

// Simple Mutex to prevent duplicate customer codes during concurrent enrollments
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
    const resolve = this._queue.shift();
    resolve(() => { this._locked = false; this._dispatch(); });
  }
}
const enrollMutex = new Mutex();

// LRU Cache for Geocoding requests to prevent rate-limiting and redundant external calls
const geocodeCache = new Map();
const GEOCODE_CACHE_TTL = 1000 * 60 * 60; // 1 hour TTL

function getCachedGeocode(url) {
  const cached = geocodeCache.get(url);
  if (cached && (Date.now() - cached.timestamp < GEOCODE_CACHE_TTL)) {
    return cached.data;
  }
  geocodeCache.delete(url);
  return null;
}

function setCachedGeocode(url, data) {
  if (geocodeCache.size > 100) {
    const firstKey = geocodeCache.keys().next().value;
    geocodeCache.delete(firstKey);
  }
  geocodeCache.set(url, { data, timestamp: Date.now() });
}

/**
 * Extracts Lat/Long or resolves Google Maps Short Links (maps.app.goo.gl, etc.)
 */
async function resolveMapsUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  const trimmed = urlStr.trim();

  const directCoordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)|[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)|\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/i;
  const directMatch = trimmed.match(directCoordRegex);
  if (directMatch) {
    const lat = directMatch[1] || directMatch[3] || directMatch[5];
    const lng = directMatch[2] || directMatch[4] || directMatch[6];
    if (lat && lng) return { lat: parseFloat(lat), lng: parseFloat(lng), finalUrl: trimmed };
  }

  if (/goo\.gl|maps\.app\.goo\.gl|g\.co/i.test(trimmed)) {
    try {
      const getResp = await fetch(trimmed, { 
        method: 'GET', 
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const finalUrl = getResp.url || trimmed;
      const htmlText = await getResp.text();

      let scrapedTitle = null;
      const titleMatch = htmlText.match(/<meta content="([^"]+)" itemProp="name">|<meta property="og:title" content="([^"]+)">|<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        const rawTitle = titleMatch[1] || titleMatch[2] || titleMatch[3];
        if (rawTitle && !rawTitle.includes('Google Maps')) {
          scrapedTitle = rawTitle.replace(/ - Google Maps$/, '').trim();
        }
      }

      const redirectMatch = finalUrl.match(directCoordRegex);
      if (redirectMatch) {
        const lat = redirectMatch[1] || redirectMatch[3] || redirectMatch[5];
        const lng = redirectMatch[2] || redirectMatch[4] || redirectMatch[6];
        if (lat && lng) return { lat: parseFloat(lat), lng: parseFloat(lng), finalUrl, scrapedTitle };
      }

      const metaMatch = htmlText.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (metaMatch) {
        return { lat: parseFloat(metaMatch[1]), lng: parseFloat(metaMatch[2]), finalUrl, scrapedTitle };
      }
    } catch (err) {
      console.warn('[RESOLVE_MAPS_URL_WARN]', err.message);
    }
  }

  return null;
}

/**
 * Reverse geocode coordinates using OpenStreetMap Nominatim API formatted like Google Maps Address
 */
async function reverseGeocode(lat, lng) {
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en,my`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'BBD-CRM-System/1.0 (info@bbd-fitness.com)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    
    if (data && data.address) {
      const addr = data.address;
      
      const placeName = addr.building || addr.amenity || addr.apartment || addr.complex || '';
      const houseNumber = addr.house_number || '';
      const road = addr.road || addr.pedestrian || addr.footway || '';
      const streetAddress = [houseNumber, road].filter(Boolean).join(' ');

      const subdistrict = addr.subdistrict || addr.quarter || addr.neighbourhood || addr.suburb || addr.residential || '';
      const district = addr.district || addr.city_district || addr.township || addr.county || '';
      const city = addr.city || addr.state_district || addr.state || addr.region || '';
      const postcode = addr.postcode || '';

      const formattedParts = [
        placeName,
        streetAddress,
        subdistrict,
        district,
        city,
        postcode
      ].filter(Boolean);

      const displayAddress = formattedParts.length > 0 ? formattedParts.join(', ') : data.display_name;
      
      return {
        display_name: displayAddress,
        raw_nominatim: data.display_name,
        components: { placeName, houseNumber, road, subdistrict, district, city, postcode }
      };
    }
  } catch (err) {
    console.error('[REVERSE_GEOCODE_ERR]', err);
  }
  return null;
}

// POST /api/enroll/parse-maps-link - Realtime Google Maps parser & Reverse Geocoder
router.post('/parse-maps-link', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Valid URL is required' });
    }

    const cachedResult = getCachedGeocode(url.trim());
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const resolved = await resolveMapsUrl(url);
    if (!resolved) {
      return res.status(422).json({ error: 'Could not extract location coordinates from Google Maps link' });
    }

    const geoData = await reverseGeocode(resolved.lat, resolved.lng);
    
    let finalFormatted = resolved.scrapedTitle || geoData?.display_name || `${resolved.lat}, ${resolved.lng}`;

    const responsePayload = {
      success: true,
      lat: resolved.lat,
      lng: resolved.lng,
      formatted_address: finalFormatted,
      raw_geocoded: geoData?.raw_nominatim || null,
      maps_url: resolved.finalUrl || url,
      components: geoData?.components || {}
    };

    setCachedGeocode(url.trim(), responsePayload);
    res.json(responsePayload);
  } catch (err) {
    console.error('[PARSE_MAPS_LINK_ERR]', err);
    res.status(500).json({ error: 'Failed to process Google Maps link' });
  }
});

// Helper: generate customer code
async function generateCustomerCode() {
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

// GET /api/enroll/update-address/:customerId - Fetch customer basic info for public update address form
router.get('/update-address/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;

    let query = supabaseAdmin.schema('crm').from('customers').select('id, full_name, customer_code, address, delivery_address, delivery_notes');
    
    if (customerId.startsWith('BBD-') || !customerId.includes('-')) {
      query = query.eq('customer_code', customerId);
    } else {
      query = query.eq('id', customerId);
    }

    const { data: customer, error } = await query.single();
    if (error || !customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    res.json({ success: true, customer });
  } catch (err) {
    console.error('[UPDATE_ADDRESS_GET_ERR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/enroll/update-address/:customerId - Public submission to update customer delivery address
router.post('/update-address/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { delivery_address, delivery_notes, maps_url } = req.body;

    let query = supabaseAdmin.schema('crm').from('customers').select('id, delivery_notes');
    if (customerId.startsWith('BBD-') || !customerId.includes('-')) {
      query = query.eq('customer_code', customerId);
    } else {
      query = query.eq('id', customerId);
    }

    const { data: existingCustomer, error: findErr } = await query.single();
    if (findErr || !existingCustomer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    let finalNotes = delivery_notes || existingCustomer.delivery_notes || '';
    if (maps_url) {
      const linkNote = `📍 Maps Link: ${maps_url}`;
      if (!finalNotes.includes(maps_url)) {
        finalNotes = finalNotes ? `${finalNotes} | ${linkNote}` : linkNote;
      }
    }

    const { error: updateErr } = await supabaseAdmin.schema('crm').from('customers')
      .update({
        delivery_address: delivery_address || null,
        delivery_notes: finalNotes || null
      })
      .eq('id', existingCustomer.id);

    if (updateErr) throw updateErr;

    res.json({ success: true, message: 'Delivery address updated successfully' });
  } catch (err) {
    console.error('[UPDATE_ADDRESS_POST_ERR]', err);
    res.status(500).json({ error: 'Failed to update delivery address' });
  }
});

// GET /api/enroll/:token - Fetch form schema and inquiry details
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // 1. Get Inquiry
    const { data: inquiry, error: inqErr } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('*')
      .eq('onboarding_token', token)
      .single();

    if (inqErr || !inquiry) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (inquiry.onboarding_status === 'completed') {
      return res.status(400).json({ error: 'Form already submitted', completed: true });
    }

    // 2. Get Form Schema
    const { data: formSettings } = await supabaseAdmin.schema('crm').from('form_settings')
      .select('schema')
      .eq('form_name', 'enrollment')
      .single();

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

    // Fetch packages
    const { data: packages } = await supabaseAdmin.schema('crm').from('packages').select('*').order('price', { ascending: true });
    if (packages && packages.length > 0) {
      const packageOptions = packages.map(p => ({ label: `${p.name} - ${p.duration} days`, value: p.id, pkg_data: p }));
      finalSchema = finalSchema.map(field => {
        if (field.id === 'package_id') {
          return { ...field, type: 'dropdown', options: packageOptions };
        }
        return field;
      });
    }

    res.json({
      inquiry: {
        id: inquiry.id,
        prospect_name: inquiry.prospect_name,
        service_interest: inquiry.service_interest,
        package: inquiry.selected_package
      },
      packages: packages || [],
      schema: finalSchema
    });

  } catch (err) {
    console.error('[ENROLL GET ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/enroll/:token - Submit form data
router.post('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const formData = req.body;

    // 1. Validate Token
    const { data: inquiry, error: inqErr } = await supabaseAdmin.schema('crm').from('inquiries')
      .select('*')
      .eq('onboarding_token', token)
      .single();

    if (inqErr || !inquiry) {
      return res.status(404).json({ error: 'Invalid or expired token' });
    }

    if (inquiry.onboarding_status === 'completed') {
      return res.status(400).json({ error: 'Form already submitted' });
    }

    // 2. Create Customer Profile — inside mutex to prevent duplicate BBD codes
    const release = await enrollMutex.acquire();
    let newCustomer;
    try {
      const customer_code = await generateCustomerCode();

      let formattedDeliveryNotes = formData.delivery_notes || '';
      if (formData.delivery_address_url || (formData.delivery_address && formData.delivery_address.startsWith('http'))) {
        const rawMapUrl = formData.delivery_address_url || formData.delivery_address;
        const linkNote = `📍 Maps Link: ${rawMapUrl}`;
        formattedDeliveryNotes = formattedDeliveryNotes 
          ? `${formattedDeliveryNotes} | ${linkNote}` 
          : linkNote;
      }
    
      const { data: createdCustomer, error: custErr } = await supabaseAdmin.schema('crm').from('customers')
        .insert({
          full_name: formData.name || inquiry.prospect_name || 'Customer',
          facebook_name: formData.fb_name || formData.facebook_name || inquiry.prospect_name || null,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender || 'Unknown',
          email: formData.email || null,
          phone: formData.phone || inquiry.prospect_contact || null,
          address: formData.home_address_parsed || formData.home_address || null,
          delivery_address: formData.delivery_address_parsed || formData.delivery_address || formData.home_address || null,
          delivery_notes: formattedDeliveryNotes || null,
          customer_code
        })
        .select()
        .single();

      if (custErr) throw custErr;
      newCustomer = createdCustomer;
    } finally {
      release();
    }

    // 3. Insert health record
    await supabaseAdmin.schema('crm').from('customer_health').insert({
      customer_id: newCustomer.id,
      current_weight: formData.current_weight ? `${formData.current_weight} kg` : null,
      goal_weight: formData.goal_weight ? `${formData.goal_weight} kg` : null,
      height: formData.height ? `${formData.height} cm` : null,
      medical_condition: formData.medical_conditions || 'None',
      medicine_taking: formData.medicine_taking || 'None',
      special_requests: formData.chef_requests || 'None',
      allergies: formData.allergies || 'None'
    });

    // 4. Insert lifestyle record
    await supabaseAdmin.schema('crm').from('customer_lifestyle').insert({
      customer_id: newCustomer.id,
      food_restriction: formData.allergies || 'None',
      activity_level: formData.activity_level || 'Sedentary',
      fasting_willingness: formData.fasting_willingness || 'No'
    });

    // 5. Update Inquiry Status
    await supabaseAdmin.schema('crm').from('inquiries')
      .update({ 
        onboarding_status: 'completed',
        customer_id: newCustomer.id,
        status: 'converted'
      })
      .eq('id', inquiry.id);

    // 6. Auto Assign the selected package
    let selectedPackage = null;
    if (formData.package_id) {
      const { data: pkgData } = await supabaseAdmin.schema('crm').from('packages').select('*').eq('id', formData.package_id).single();
      if (pkgData) selectedPackage = pkgData;
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

      await supabaseAdmin.schema('crm').from('customer_packages')
        .insert({ 
          customer_id: newCustomer.id, 
          name: pkg.name || 'BBD Plan', 
          duration: `${durationDays} days`, 
          meal_type: mealType, 
          meal_count: calculatedMealCount, 
          start_date: startDate.toISOString(), 
          expires_at: expiresAt.toISOString(), 
          payment_status: 'Paid', 
          status: packageStatus, 
          amount: pkg.price || 0 
        });
    }
    
    res.json({ success: true, customer_id: newCustomer.id });

  } catch (err) {
    console.error('[ENROLL POST ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
