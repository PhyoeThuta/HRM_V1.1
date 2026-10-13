import * as service from '../service/index.js';

// ==========================================
// INVENTORY ITEMS
// ==========================================
export const getItems = async (req, res) => {
  try {
    const items = await service.getItems();
    return res.json(items);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const data = req.body;
    const result = await service.createItemAndBalance(data, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await service.updateItem(id, data, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await service.deleteItem(id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// ==========================================
// INVENTORY BALANCES
// ==========================================
export const getBalances = async (req, res) => {
  try {
    const enriched = await service.getBalancesEnriched();
    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const updateBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await service.updateBalance(id, data, req.user.id);
    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// ==========================================
// INVENTORY TRANSACTIONS
// ==========================================
export const getTransactions = async (req, res) => {
  try {
    const enriched = await service.getTransactionsEnriched();
    return res.json(enriched);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { item_id, transaction_type, quantity_change, unit_price_at_transaction, reference_type, reference_id } = req.body;
    
    const result = await service.createManualTransaction({
      item_id, 
      transaction_type, 
      quantity_change, 
      unit_price_at_transaction, 
      reference_type, 
      reference_id
    }, req.user.id);

    return res.json({ success: true, transaction: result.tx, new_quantity: result.newQty });
  } catch (e) {
    if (e.message === 'Balance record not found for this item') {
      return res.status(404).json({ error: e.message });
    }
    return res.status(500).json({ error: e.message });
  }
};
