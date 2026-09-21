import cron from 'node-cron';
import { supabaseAdmin } from '../lib/supabase.js';
import { inventoryModule } from '../modules/inventory/index.js';

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHEF_CHAT_ID = process.env.CHEF_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const ZERNIO_API_KEY = process.env.ZERNIO_API_KEY;
const ZERNIO_ACCOUNT_ID = process.env.ZERNIO_ACCOUNT_ID;

// ─────────────────────────────────────────────────────────────
// Utility: Get Today's Date in ICT (Asia/Bangkok UTC+7)
// ─────────────────────────────────────────────────────────────
function getBangkokDateStr() {
  const d = new Date();
  const bkkStr = d.toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });
  const bkkDate = new Date(bkkStr);
  const yyyy = bkkDate.getFullYear();
  const mm = String(bkkDate.getMonth() + 1).padStart(2, '0');
  const dd = String(bkkDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ─────────────────────────────────────────────────────────────
// Channel 1: Telegram Group Alert
// ─────────────────────────────────────────────────────────────
async function sendTelegramKitchenAlert(message, replyMarkup = null) {
  if (!TELEGRAM_TOKEN || !CHEF_CHAT_ID) {
    console.warn('[KITCHEN ALERT] Telegram token or CHEF_CHAT_ID not configured. Skipping Telegram dispatch.');
    return { success: false, channel: 'telegram', reason: 'not_configured' };
  }
  try {
    const payload = { chat_id: CHEF_CHAT_ID, text: message, parse_mode: 'HTML' };
    if (replyMarkup) payload.reply_markup = replyMarkup;

    const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    console.log('[KITCHEN ALERT] ✅ Telegram alert sent to Chef Group.');
    return { success: true, channel: 'telegram' };
  } catch (err) {
    console.error('[KITCHEN ALERT] ❌ Telegram dispatch failed:', err.message);
    return { success: false, channel: 'telegram', reason: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Channel 2: Facebook Messenger Broadcast via Zernio
// ─────────────────────────────────────────────────────────────
async function sendMessengerKitchenBroadcast(messageText) {
  if (!ZERNIO_API_KEY) {
    console.warn('[KITCHEN ALERT] ZERNIO_API_KEY not configured. Skipping Messenger dispatch.');
    return { success: false, channel: 'messenger', reason: 'not_configured' };
  }

  try {
    const conversationIds = new Set();

    // Source 1: ENV variables (e.g. CHEF_MESSENGER_CONVERSATION_IDS="6a4f5ef83ecd8aa34471bead")
    if (process.env.CHEF_MESSENGER_CONVERSATION_IDS) {
      process.env.CHEF_MESSENGER_CONVERSATION_IDS.split(',').forEach(id => {
        if (id.trim()) conversationIds.add(id.trim());
      });
    }

    // Source 2: Auto-discover from crm.inquiries where prospect is Phyoe Thuta or tagged chef
    try {
      const { data: chefInquiries } = await supabaseAdmin.schema('crm')
        .from('inquiries')
        .select('id, prospect_name')
        .or('prospect_name.ilike.%Phyoe Thuta%,prospect_name.ilike.%chef%,notes.ilike.%chef%');

      if (chefInquiries && chefInquiries.length > 0) {
        const inqIds = chefInquiries.map(i => i.id);
        const { data: msgs } = await supabaseAdmin.schema('crm')
          .from('inquiries_messages')
          .select('metadata')
          .in('inquiry_id', inqIds)
          .not('metadata', 'is', null);

        (msgs || []).forEach(m => {
          const cid = m.metadata?.conversationId || m.metadata?.message?.conversationId;
          if (cid) conversationIds.add(cid);
        });
      }
    } catch (inqErr) {
      console.warn('[KITCHEN ALERT] Inquiry lookup warning:', inqErr.message);
    }

    // Source 3: sys_users table (if zernio_conversation_id column exists)
    try {
      const { data: sysChefs } = await supabaseAdmin
        .from('sys_users')
        .select('zernio_conversation_id')
        .in('role', ['chef', 'kitchen', 'ops'])
        .not('zernio_conversation_id', 'is', null);

      (sysChefs || []).forEach(c => {
        if (c.zernio_conversation_id) conversationIds.add(c.zernio_conversation_id);
      });
    } catch (sysErr) {
      // Column might not exist yet, soft fail
    }

    const subscriberList = Array.from(conversationIds);
    if (subscriberList.length === 0) {
      console.warn('[KITCHEN ALERT] No registered Messenger subscribers found. Skipping Messenger dispatch.');
      return { success: false, channel: 'messenger', reason: 'no_subscribers' };
    }

    let sentCount = 0;
    for (const convId of subscriberList) {
      try {
        const zernioUrl = `https://zernio.com/api/v1/inbox/conversations/${convId}/messages`;
        const res = await fetch(zernioUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ZERNIO_API_KEY}`
          },
          body: JSON.stringify({
            accountId: ZERNIO_ACCOUNT_ID,
            message: messageText
          })
        });
        if (res.ok) {
          sentCount++;
          console.log(`[KITCHEN ALERT] ✅ Messenger alert sent to Conversation ID: ${convId}`);
        } else {
          const errText = await res.text();
          console.error(`[KITCHEN ALERT] ❌ Messenger send failed for ${convId}:`, errText);
        }
      } catch (chefErr) {
        console.error(`[KITCHEN ALERT] ❌ Messenger error for ${convId}:`, chefErr.message);
      }
    }
    return { success: sentCount > 0, channel: 'messenger', sentCount, totalSubscribers: subscriberList.length };
  } catch (err) {
    console.error('[KITCHEN ALERT] ❌ Messenger broadcast failed:', err.message);
    return { success: false, channel: 'messenger', reason: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Core: Aggregate Today's Kitchen Data from DB
// ─────────────────────────────────────────────────────────────
async function aggregateKitchenData(targetDate) {
  // 1. Fetch today's daily menus
  const { data: dailyMenus } = await supabaseAdmin
    .from('operations_daily_menus')
    .select('*')
    .eq('date', targetDate);

  const { data: menuTypes } = await supabaseAdmin
    .from('operations_menu_types')
    .select('*');

  const { data: menus } = await supabaseAdmin
    .from('operations_menus')
    .select('*');

  const { data: recipes } = await supabaseAdmin
    .from('operations_recipes')
    .select('*');

  const inventoryItems = await inventoryModule.getItems();

  // 2. Fetch headcount from today's orders
  const { data: todayOrders } = await supabaseAdmin
    .from('operations_orders')
    .select('customer_id, daily_menu_id, daily_menus:daily_menu_id(meal_type)')
    .eq('date', targetDate);

  let totalLunch = 0;
  let totalDinner = 0;

  if (todayOrders && todayOrders.length > 0) {
    todayOrders.forEach(o => {
      const mtype = (o.daily_menus?.meal_type || '').toUpperCase();
      if (mtype.includes('LUNCH')) totalLunch++;
      else if (mtype.includes('DINNER')) totalDinner++;
    });
  } else {
    // Fallback from active packages
    const { data: packages } = await supabaseAdmin.schema('crm')
      .from('customer_packages')
      .select('meal_type')
      .or('status.eq.Active,status.eq.ACTIVE,payment_status.eq.Paid')
      .gte('expires_at', targetDate);

    (packages || []).forEach(pkg => {
      const mtype = (pkg.meal_type || '').toLowerCase();
      if (mtype.includes('lunch')) totalLunch++;
      if (mtype.includes('dinner')) totalDinner++;
    });
  }

  // 3. Enrich menus with BOM
  const enrichedDailyMenus = (dailyMenus || []).map(dm => {
    const types = (menuTypes || []).filter(mt => mt.daily_menus_id === dm.id);
    const enrichedTypes = types.map(mt => ({
      ...mt,
      menu: (menus || []).find(m => m.id === mt.menu_id) || { name_en: 'Uncosted Item', name_mm: '' }
    }));
    return { ...dm, menu_types: enrichedTypes };
  }).filter(dm => dm.menu_types && dm.menu_types.length > 0);

  // 4. Aggregate BOM
  const bomMap = new Map();
  enrichedDailyMenus.forEach(dm => {
    const mtype = (dm.meal_type || '').toUpperCase();
    const multiplier = mtype.includes('LUNCH') ? totalLunch : (mtype.includes('DINNER') ? totalDinner : totalLunch);
    if (multiplier === 0) return;
    dm.menu_types.forEach(mt => {
      if (!mt.menu_id) return;
      const menuRecipes = (recipes || []).filter(r => r.menu_id === mt.menu_id);
      menuRecipes.forEach(recipe => {
        const item = (inventoryItems || []).find(i => i.id === recipe.inventory_item_id);
        if (!item) return;
        if (!bomMap.has(item.id)) {
          bomMap.set(item.id, { id: item.id, name: item.name_eng, name_mm: item.name_mm, uom: item.unit_of_measure, qty: 0 });
        }
        bomMap.get(item.id).qty += (recipe.qty * multiplier);
      });
    });
  });

  const aggregatedBOM = Array.from(bomMap.values()).sort((a, b) => b.qty - a.qty);

  return { dailyMenus: enrichedDailyMenus, aggregatedBOM, headcount: { totalLunch, totalDinner }, targetDate };
}

// ─────────────────────────────────────────────────────────────
// Core: Format & Dispatch Alert (Both Channels)
// ─────────────────────────────────────────────────────────────
export async function checkAndSendKitchenAlert(targetDate = null) {
  const date = targetDate || getBangkokDateStr();
  console.log(`[KITCHEN ALERT] 🍳 Starting daily kitchen alert for: ${date}`);

  try {
    const { dailyMenus, aggregatedBOM, headcount } = await aggregateKitchenData(date);

    // ── Format Telegram Message (HTML)
    let telegramMsg = `👨‍🍳 <b>BBD KITCHEN ALERT: မနက် ${date} ဟင်းပွဲ (Daily Menu)</b>\n\n`;
    telegramMsg += `📊 <b>ဦးရေ (Headcount): နေ့လယ် ${headcount.totalLunch} ကောင် | ညနေ ${headcount.totalDinner} ကောင်</b>\n\n`;

    if (dailyMenus && dailyMenus.length > 0) {
      dailyMenus.forEach(dm => {
        telegramMsg += `<b>[${dm.meal_type}]</b> ${dm.with_rice ? '🍚 (ထမင်းနှင့်)' : ''}\n`;
        dm.menu_types.forEach(mt => {
          telegramMsg += `• ${mt.menu.name_en}${mt.menu.name_mm ? ` (${mt.menu.name_mm})` : ''}\n`;
        });
        telegramMsg += '\n';
      });
    } else {
      telegramMsg += `<i>ဒီနေ့ ဟင်းပွဲ စီစဉ်မှု မရှိသေးပါ။</i>\n\n`;
    }

    telegramMsg += `🛒 <b>လိုအပ်သော ကုန်ကြမ်းများ (BOM Ingredients):</b>\n`;
    if (aggregatedBOM && aggregatedBOM.length > 0) {
      aggregatedBOM.forEach(bom => {
        const name = bom.name_mm ? `${bom.name} (${bom.name_mm})` : bom.name;
        telegramMsg += `• ${name}: <b>${bom.qty.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${bom.uom}</b>\n`;
      });
    } else {
      telegramMsg += `<i>ကုန်ကြမ်း စာရင်း မရှိသေးပါ။</i>\n`;
    }

    const replyMarkup = {
      inline_keyboard: [[
        { text: '✅ ချက်ပြုတ်ပြီးစီးပါပြီ (Finish Cooking)', callback_data: `finish_cooking_${date}` }
      ]]
    };

    // ── Format Messenger Message (Plain text)
    let messengerMsg = `👨‍🍳 BBD KITCHEN ALERT: ${date} ဟင်းပွဲ\n\n`;
    messengerMsg += `📊 ဦးရေ: နေ့လယ် ${headcount.totalLunch} ကောင် | ညနေ ${headcount.totalDinner} ကောင်\n\n`;

    if (dailyMenus && dailyMenus.length > 0) {
      dailyMenus.forEach(dm => {
        messengerMsg += `[${dm.meal_type}] ${dm.with_rice ? '(ထမင်းနှင့်)' : ''}\n`;
        dm.menu_types.forEach(mt => {
          messengerMsg += `• ${mt.menu.name_en}${mt.menu.name_mm ? ` (${mt.menu.name_mm})` : ''}\n`;
        });
        messengerMsg += '\n';
      });
    }

    messengerMsg += `🛒 ကုန်ကြမ်းများ (BOM):\n`;
    (aggregatedBOM || []).slice(0, 15).forEach(bom => {
      const name = bom.name_mm ? `${bom.name} (${bom.name_mm})` : bom.name;
      messengerMsg += `• ${name}: ${bom.qty.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${bom.uom}\n`;
    });

    // ── Dual-Channel Dispatch (Fail-safe isolated) ──
    const [telegramResult, messengerResult] = await Promise.allSettled([
      sendTelegramKitchenAlert(telegramMsg, replyMarkup),
      sendMessengerKitchenBroadcast(messengerMsg)
    ]);

    const results = {
      targetDate: date,
      headcount,
      menuCount: dailyMenus.length,
      bomCount: aggregatedBOM.length,
      telegram: telegramResult.status === 'fulfilled' ? telegramResult.value : { success: false, reason: telegramResult.reason?.message },
      messenger: messengerResult.status === 'fulfilled' ? messengerResult.value : { success: false, reason: messengerResult.reason?.message }
    };

    console.log('[KITCHEN ALERT] ✅ Dual-channel dispatch complete:', JSON.stringify(results, null, 2));
    return results;

  } catch (err) {
    console.error('[KITCHEN ALERT] ❌ Fatal error in kitchen alert dispatch:', err.message);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// Cron Scheduler: Daily 05:00 AM ICT (Asia/Bangkok)
// ─────────────────────────────────────────────────────────────
export function startKitchenAlertCron() {
  // '0 5 * * *' = Every day at 05:00 AM
  cron.schedule('0 5 * * *', async () => {
    console.log('[CRON] ⏰ Kitchen Daily Alert Cron triggered at 05:00 AM ICT (Asia/Bangkok)');
    try {
      await checkAndSendKitchenAlert();
    } catch (err) {
      console.error('[CRON] ❌ Kitchen alert cron failed:', err.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Bangkok'
  });

  console.log('[CRON] ✅ Kitchen Daily Alert Cron scheduled for 05:00 AM daily (Asia/Bangkok)');
}
