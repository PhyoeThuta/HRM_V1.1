import * as repository from '../repository/index.js';

// The unified in-memory Mutex coordinates concurrent mutations across the exact same Node.js process.
// Multiple processes, containers, or replicas would require database-level concurrency control.
class Mutex {
  constructor() {
    this._queue = [];
    this._locked = false;
  }
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
    resolve(() => {
      this._locked = false;
      this._dispatch();
    });
  }
}
const inventoryMutex = new Mutex();

// ==========================================
// ITEMS
// ==========================================
export async function getItems() {
  return await repository.getItems({ order: 'name_eng', ascending: true });
}

export async function getItemsBasicInfo() {
  return await repository.getItemsBasicInfo();
}

export async function createItemAndBalance(data, userId) {
  const itemData = { ...data, created_by: userId };
  const item = await repository.createItem(itemData);
  
  if (item) {
    await repository.createBalance({
      item_id: item.id,
      current_quantity: 0,
      min_quantity: data.min_quantity || 0,
      one_unit_cost: data.one_unit_cost || 0,
      created_by: userId
    });
  }
  return item;
}

export async function updateItem(id, data, userId) {
  const updateData = {
    ...data,
    updated_by: userId,
    updated_at: new Date().toISOString()
  };
  return await repository.updateItem(id, updateData);
}

export async function deleteItem(id) {
  return await repository.deleteItem(id);
}

// For import-costing in Operations
export async function getOrCreateItemForCosting(name, uom) {
  const existing = await repository.getItemByName(name, true);
  if (existing) {
    return { id: existing.id, created: false };
  }
  const newItem = await repository.createItem({
    name_eng: name,
    category: 'RECIPE_INGREDIENT',
    unit_of_measure: uom
  }, true);
  return { id: newItem.id, created: true };
}

// ==========================================
// BALANCES
// ==========================================
export async function getBalancesEnriched() {
  const balances = await repository.getBalances();
  const items = await repository.getItems();
  
  return balances.map(b => ({
    ...b,
    inventory_items: items.find(i => i.id === b.item_id) || null
  }));
}

export async function getBalancesCosts() {
  return await repository.getBalancesCosts();
}

export async function updateBalance(id, data, userId) {
  const updateData = {
    ...data,
    updated_by: userId,
    updated_at: new Date().toISOString()
  };
  return await repository.updateBalance(id, updateData);
}

// ==========================================
// TRANSACTIONS & MUTATIONS
// ==========================================
export async function getTransactionsEnriched() {
  const transactions = await repository.getTransactions({ order: 'created_at', ascending: false, limit: 100 });
  const items = await repository.getItemsBasicInfo();
  
  return transactions.map(t => ({
    ...t,
    inventory_items: items.find(i => i.id === t.item_id) || null
  }));
}

// Shared mutation path for manual transactions
export async function createManualTransaction(data, userId) {
  const release = await inventoryMutex.acquire();
  try {
    const { item_id, transaction_type, quantity_change, unit_price_at_transaction, reference_type, reference_id } = data;
    
    const balance = await repository.getBalanceByItemId(item_id);
    if (!balance) throw new Error('Balance record not found for this item');
    
    const changeAmount = parseFloat(quantity_change);
    let newQty = parseFloat(balance.current_quantity);
    
    if (transaction_type === 'PURCHASE_IN') {
      newQty += changeAmount;
    } else if (transaction_type === 'USAGE_OUT' || transaction_type === 'SPOILAGE') {
      newQty -= changeAmount;
    } else if (transaction_type === 'ADJUSTMENT') {
      newQty = changeAmount;
    }

    const tx = await repository.createTransaction({
      item_id,
      transaction_type,
      quantity_change: changeAmount,
      unit_price_at_transaction,
      reference_type,
      reference_id,
      created_by: userId
    });
    
    await repository.updateBalance(balance.id, {
      current_quantity: newQty,
      last_restocked_at: transaction_type === 'PURCHASE_IN' ? new Date().toISOString() : balance.last_restocked_at,
      updated_by: userId,
      updated_at: new Date().toISOString()
    });

    return { tx, newQty };
  } finally {
    release();
  }
}

// Shared mutation path for Operations BOM deductions
export async function deductStockForBOM(deductions, orderId, userId) {
  // deductions is an object: { [itemId]: totalQtyToDeduct }
  const release = await inventoryMutex.acquire();
  try {
    const now = new Date().toISOString();
    
    for (const [itemId, deductQty] of Object.entries(deductions)) {
      const balData = await repository.getBalanceByItemId(itemId);
      if (!balData) {
        throw new Error(`Missing inventory balance for item ${itemId}`);
      }
      
      await repository.createTransaction({
        item_id: itemId,
        transaction_type: 'USAGE_OUT',
        quantity_change: deductQty,
        reference_type: orderId.includes('BATCH') ? 'ORDER_BATCH' : 'ORDER', // If it's a single order, 'ORDER', if batch it can be adapted or just use orderId
        reference_id: orderId,
        created_by: userId
      });

      await repository.updateBalance(balData.id, {
        current_quantity: parseFloat(balData.current_quantity) - parseFloat(deductQty),
        updated_by: userId,
        updated_at: now
      });
    }
  } finally {
    release();
  }
}
