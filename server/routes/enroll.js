import express from 'express';
import { crmModule } from '../modules/crm/index.js';
import { supabaseAdmin } from '../lib/supabase.js';

const router = express.Router();

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

// POST /api/enroll/upload-spot-photo - Realtime drop-off spot photo upload
router.post('/upload-spot-photo', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
    }

    const mimeType = match[1];
    const ext = mimeType.split('/')[1] || 'jpg';
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');
    const filename = `spot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

    // Attempt upload to Supabase Storage
    try {
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from('gallery')
        .upload(`delivery_spots/${filename}`, buffer, {
          contentType: mimeType,
          upsert: true
        });

      if (!uploadErr) {
        const { data: publicUrlData } = supabaseAdmin.storage.from('gallery').getPublicUrl(`delivery_spots/${filename}`);
        if (publicUrlData?.publicUrl) {
          return res.json({ success: true, url: publicUrlData.publicUrl });
        }
      }
    } catch (e) {
      console.warn('[SPOT_PHOTO_STORAGE_WARN]', e.message);
    }

    // Return original data URL as inline image fallback if storage bucket fails
    res.json({ success: true, url: image });
  } catch (err) {
    console.error('[UPLOAD_SPOT_PHOTO_ERR]', err);
    res.status(500).json({ error: 'Failed to process photo upload' });
  }
});

// GET /api/enroll/update-address/:customerId - Fetch customer basic info for public update address form
router.get('/update-address/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const customer = await crmModule.getCustomerAddressProfile(customerId);

    res.json({ success: true, customer });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    console.error('[UPDATE_ADDRESS_GET_ERR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/enroll/update-address/:customerId - Public submission to update customer delivery address
router.post('/update-address/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    
    await crmModule.updateCustomerAddressProfile(customerId, req.body);

    res.json({ success: true, message: 'Delivery address updated successfully' });
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    console.error('[UPDATE_ADDRESS_POST_ERR]', err);
    res.status(500).json({ error: 'Failed to update delivery address' });
  }
});

// GET /api/enroll/:token - Fetch form schema and inquiry details
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const context = await crmModule.getEnrollmentFormContext(token);
    res.json(context);
    
  } catch (err) {
    if (err.status === 404) {
      return res.status(404).json({ error: err.message });
    }
    if (err.status === 400 && err.completed) {
      return res.status(400).json({ error: err.message, completed: true });
    }
    console.error('[ENROLL_GET_ERR]', err);
    res.status(500).json({ error: 'Failed to load enrollment form' });
  }
});

// POST /api/enroll/:token - Submit form data
router.post('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const formData = req.body;

    const newCustomer = await crmModule.completeOnboarding(token, formData);

    return res.status(201).json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      customer_id: newCustomer.id 
    });
  } catch (error) {
    console.error('[ENROLL POST ERROR]', error);
    if (error.message === 'Invalid or expired token.') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to process enrollment' });
  }
});

export default router;
