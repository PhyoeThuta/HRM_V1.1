import * as opsRepo from '../repository/index.js';
import { inventoryModule } from '../../inventory/index.js';

// ==========================================
// MENUS
// ==========================================

export async function getEnrichedMenus() {
  const menus = await opsRepo.getAllMenus();
  const recipes = await opsRepo.getAllRecipes();
  const items = await inventoryModule.getItemsBasicInfo();

  return menus.map(m => {
    const menuRecipes = recipes?.filter(r => r.menu_id === m.id) || [];
    const enrichedRecipes = menuRecipes.map(r => ({
      ...r,
      inventory_items: items?.find(i => i.id === r.inventory_item_id) || null
    }));
    return { ...m, recipes: enrichedRecipes };
  });
}

export async function createMenu(data, userId) {
  return opsRepo.createMenu({ ...data, created_by: userId });
}

export async function updateMenu(id, data, userId) {
  return opsRepo.updateMenu(id, {
    ...data,
    updated_by: userId,
    updated_at: new Date().toISOString()
  });
}

export async function deleteMenu(id) {
  return opsRepo.deleteMenu(id);
}

// ==========================================
// RECIPES
// ==========================================

export async function createRecipe(data, userId) {
  return opsRepo.createRecipe({ ...data, created_by: userId });
}

export async function deleteRecipe(id) {
  return opsRepo.deleteRecipe(id);
}

// ==========================================
// MENU PLANS
// ==========================================

export async function getAllMenuPlans() {
  return opsRepo.getAllMenuPlans();
}

export async function importMenuPlan(parsedRows) {
  let count = 0;
  for (const row of parsedRows) {
    try {
      await opsRepo.upsertMenuPlan(row);
      count++;
    } catch (error) {
      console.error('Menu Plan Upsert Error for date:', row.date, error);
    }
  }
  if (count === 0) {
    throw new Error('No valid dates found in the file. Ensure the Date is in Column B.');
  }
  return count;
}

// ==========================================
// SKIP DAYS
// ==========================================

export async function getAllSkipDays() {
  return opsRepo.getAllSkipDays();
}

export async function createSkipDay(data, userId) {
  return opsRepo.createSkipDay({ ...data, created_by: userId });
}
