import express from 'express';
import { createDonation, getUserDonations, getHospitalDonations, updateDonationStatus } from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createDonation);
router.get('/user', protect, getUserDonations);

// Hospital routes
router.get('/hospital', protect, getHospitalDonations);
router.patch('/:id/status', protect, updateDonationStatus);

export default router;
