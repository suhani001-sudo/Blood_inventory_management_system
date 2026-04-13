import express from 'express';
import {
  createRequest,
  getRequests,
  updateRequestStatus,
} from '../controllers/requestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('user'), createRequest);

router.get('/', protect, getRequests);

router.put('/:id', protect, authorizeRoles('hospital', 'admin'), updateRequestStatus);

export default router;

