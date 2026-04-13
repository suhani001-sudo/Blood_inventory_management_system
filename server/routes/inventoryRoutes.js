import express from 'express';
import {
  addInventory,
  getInventory,
  getInventoryByHospital,
  deleteInventory,
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/add', protect, authorizeRoles('hospital', 'admin'), addInventory);

router.get('/', protect, getInventory);

router.get('/hospital/:id', protect, getInventoryByHospital);

router.delete('/:id', protect, authorizeRoles('hospital', 'admin'), deleteInventory);

export default router;

