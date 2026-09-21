import * as service from './service/index.js';

// ==========================================
// PUBLIC INVENTORY MODULE INTERFACE
// ==========================================
// This file exposes only the capabilities required by external domains
// (e.g., Operations, Cron). It explicitly DOES NOT expose the repository internals.

export const inventoryModule = {
  // Methods for Operations Domain
  getOrCreateItemForCosting: service.getOrCreateItemForCosting,
  getItemsBasicInfo: service.getItemsBasicInfo,
  getBalancesCosts: service.getBalancesCosts,
  deductStockForBOM: service.deductStockForBOM,
  
  // Methods for Cron Jobs
  getItems: service.getItems
};
