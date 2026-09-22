import * as opsService from '../service/index.js';
import xlsx from 'xlsx';

// ==========================================
// MENUS
// ==========================================

export async function getMenus(req, res) {
  try {
    const enriched = await opsService.getEnrichedMenus();
    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function createMenu(req, res) {
  try {
    const result = await opsService.createMenu(req.body, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function updateMenu(req, res) {
  try {
    const result = await opsService.updateMenu(req.params.id, req.body, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function deleteMenu(req, res) {
  try {
    await opsService.deleteMenu(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// RECIPES
// ==========================================

export async function createRecipe(req, res) {
  try {
    const result = await opsService.createRecipe(req.body, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function deleteRecipe(req, res) {
  try {
    await opsService.deleteRecipe(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// MENU PLANS
// ==========================================

export async function getMenuPlans(req, res) {
  try {
    const data = await opsService.getAllMenuPlans();
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function importMenuPlan(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { header: "A" });

    const parsedRows = [];
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (!row) continue;

      let dateRaw = row['B'];
      if (!dateRaw || String(dateRaw).trim().toLowerCase() === 'date' || String(dateRaw).trim() === '') continue;
      
      let parsedDate;
      if (typeof dateRaw === 'number') {
         parsedDate = new Date((dateRaw - (25567 + 2)) * 86400 * 1000);
      } else {
         const strDate = String(dateRaw);
         if (strDate.includes('-')) {
             const parts = strDate.split('-');
             if (parts.length === 3) {
                 const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
                 const monthMap = {'Jan':'01', 'Feb':'02', 'Mar':'03', 'Apr':'04', 'May':'05', 'Jun':'06', 'Jul':'07', 'Aug':'08', 'Sep':'09', 'Oct':'10', 'Nov':'11', 'Dec':'12'};
                 const monthStr = parts[1].substring(0, 3);
                 const month = monthMap[monthStr] || '01';
                 const day = parts[0].padStart(2, '0');
                 parsedDate = new Date(`${year}-${month}-${day}T12:00:00Z`);
             } else {
                 parsedDate = new Date(strDate);
             }
         } else {
             parsedDate = new Date(strDate);
         }
      }

      if (isNaN(parsedDate.getTime())) continue;

      const formattedDate = parsedDate.toISOString().split('T')[0];
      const nextRow = (r + 1 < rows.length) ? rows[r+1] : {};

      const mainDish1 = row['E'] ? String(row['E']).trim() : null;
      const mainDish2 = nextRow['E'] ? String(nextRow['E']).trim() : null;
      
      const sideDish1 = row['F'] ? String(row['F']).trim() : null;
      const sideDish2 = nextRow['F'] ? String(nextRow['F']).trim() : null;
      
      const dessert = row['G'] ? String(row['G']).trim() : null;
      const soup = row['H'] ? String(row['H']).trim() : null;
      
      let hasRice = null;
      if (row['I']) hasRice = String(row['I']).trim();
      else if (nextRow['I']) hasRice = String(nextRow['I']).trim();

      parsedRows.push({
        date: formattedDate,
        main_dish_1: mainDish1,
        main_dish_2: mainDish2,
        side_dish_1: sideDish1,
        side_dish_2: sideDish2,
        soup,
        dessert,
        has_rice: hasRice
      });
    }

    const count = await opsService.importMenuPlan(parsedRows);
    return res.json({ success: true, count });
  } catch (err) {
    if (err.message.includes('No valid dates')) {
        return res.status(400).json({ error: err.message });
    }
    console.error('[IMPORT MENU PLAN ERROR]', err);
    return res.status(500).json({ error: err.message });
  }
}

// ==========================================
// SKIP DAYS
// ==========================================

export async function getSkipDays(req, res) {
  try {
    const skips = await opsService.getAllSkipDays();
    return res.json(skips);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function createSkipDay(req, res) {
  try {
    const result = await opsService.createSkipDay(req.body, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// RIDERS
// ==========================================

export async function getRiders(req, res) {
  try {
    const data = await opsService.getActiveRiders();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// ORDERS (Basic CRUD)
// ==========================================

export async function getOrders(req, res) {
  try {
    const enriched = await opsService.getEnrichedOrders(req.user);
    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function createOrder(req, res) {
  try {
    const result = await opsService.createOrder(req.body, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function updateOrder(req, res) {
  try {
    const { custom_delivery_address } = req.body;
    const result = await opsService.updateOrderCustomAddress(req.params.id, custom_delivery_address, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function deleteOrder(req, res) {
  try {
    await opsService.deleteOrder(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// DAILY MENUS
// ==========================================

export async function getDailyMenus(req, res) {
  try {
    const enriched = await opsService.getEnrichedDailyMenus();
    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function createDailyMenu(req, res) {
  try {
    const { date, meal_type, with_rice, menu_types } = req.body;
    const result = await opsService.createDailyMenu({ date, meal_type, with_rice }, menu_types, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function updateDailyMenu(req, res) {
  try {
    const { id } = req.params;
    const { date, meal_type, with_rice, menu_types } = req.body;
    const dailyMenu = await opsService.updateDailyMenu(id, { date, meal_type, with_rice }, menu_types, req.user.id);
    return res.json({ success: true, dailyMenu });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function deleteDailyMenu(req, res) {
  try {
    const { id } = req.params;
    await opsService.deleteDailyMenu(id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// AUTO-GENERATE ORDERS
// ==========================================

export async function autoGenerateOrders(req, res) {
  try {
    const date = req.body.date;
    const userId = req.user.id;
    const authorizationHeader = req.headers.authorization;
    const host = req.get('host');
    const protocol = req.protocol || 'http';
    
    const result = await opsService.autoGenerateOrders(date, userId, authorizationHeader, host, protocol);
    return res.json(result);
  } catch (e) {
    if (e.status === 400) {
      return res.status(400).json({ error: e.message });
    }
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// RIDER ASSIGNMENT
// ==========================================

export async function assignRiderToOrder(req, res) {
  try {
    const { id } = req.params;
    const { rider_id } = req.body;
    
    const result = await opsService.assignRiderToOrder(id, rider_id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ==========================================
// POD PHOTO UPLOAD
// ==========================================

export async function uploadPodPhoto(req, res) {
  try {
    const result = await opsService.uploadPodPhoto(req.body.image);
    return res.json(result);
  } catch (e) {
    if (e.status === 400 || e.message === 'Image data is required' || e.message.includes('Invalid image format')) {
      return res.status(400).json({ error: e.message });
    }
    console.error('[UPLOAD_POD_PHOTO_ERR]', e);
    return res.status(500).json({ error: 'Failed to process proof photo upload' });
  }
}

// ==========================================
// ORDER STATUS
// ==========================================

export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { delivery_status } = req.body;
    
    const result = await opsService.updateOrderStatus(id, delivery_status, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function updateRiderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, proof_of_delivery_url } = req.body;
    
    const result = await opsService.updateRiderStatus(id, status, proof_of_delivery_url, req.user.id);
    return res.json(result);
  } catch (e) {
    console.error('[Rider Status Error]:', e);
    return res.status(500).json({ error: e.message || e });
  }
}

export async function importCostingExcel(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await opsService.importCostingExcel(req.file.buffer);
    return res.json(result);
  } catch (err) {
    console.error('[IMPORT COSTING]', err);
    return res.status(500).json({ error: err.message });
  }
}
