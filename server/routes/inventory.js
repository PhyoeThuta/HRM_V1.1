import express from 'express';
import { verifyToken, requireOperations } from '../middleware/auth.js';
import * as controller from '../modules/inventory/controller/index.js';

const router = express.Router();

router.use(verifyToken);
router.use(requireOperations);

// ==========================================
// INVENTORY ITEMS
// ==========================================
router.get('/items', controller.getItems);
router.post('/items', controller.createItem);
router.put('/items/:id', controller.updateItem);
router.delete('/items/:id', controller.deleteItem);

// ==========================================
// INVENTORY BALANCES
// ==========================================
router.get('/balances', controller.getBalances);
router.put('/balances/:id', controller.updateBalance);

// ==========================================
// INVENTORY TRANSACTIONS
// ==========================================
router.get('/transactions', controller.getTransactions);
router.post('/transactions', controller.createTransaction);

export default router;
