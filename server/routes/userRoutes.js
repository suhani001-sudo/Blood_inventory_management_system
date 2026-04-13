import express from 'express';
import { getUsers, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All authenticated users can read users (used for listing hospitals)
router.get('/', protect, getUsers);

// Only admin can delete users
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

export default router;

