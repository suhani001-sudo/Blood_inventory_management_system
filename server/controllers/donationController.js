import Donation from '../models/Donation.js';
import User from '../models/User.js';

export const createDonation = async (req, res) => {
  try {
    const { bloodGroup, phone, age, lastDonationDate, donationDate, hospital } = req.body;
    
    // Check eligibility - 90 days between donations
    const lastDonation = await Donation.findOne({ 
      donor: req.user.id, 
      status: 'completed' 
    }).sort({ createdAt: -1 });
    
    if (lastDonation) {
      const daysSinceLastDonation = Math.floor(
        (Date.now() - new Date(lastDonation.createdAt)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastDonation < 90) {
        const daysRemaining = 90 - daysSinceLastDonation;
        return res.status(400).json({
          message: `You can donate again after ${daysRemaining} days.`,
          daysRemaining,
        });
      }
    }

    const donation = await Donation.create({
      donor: req.user.id,
      hospital,
      bloodGroup,
      phone,
      age,
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
      donationDate: new Date(donationDate),
    });

    // Populate donor and hospital info
    await donation.populate('donor', 'name email');
    await donation.populate('hospital', 'organizationName email');

    res.status(201).json({
      message: 'Donation request submitted successfully',
      donation,
    });
  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('hospital', 'organizationName')
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHospitalDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ hospital: req.user.id })
      .populate('donor', 'name phone age')
      .sort({ createdAt: -1 });

    res.status(200).json(donations);
  } catch (error) {
    console.error('Get hospital donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDonationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const donation = await Donation.findById(id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if hospital owns this donation
    if (donation.hospital.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const oldStatus = donation.status;
    donation.status = status;
    await donation.save();

    // If status changed to 'completed', add blood to hospital inventory
    if (oldStatus !== 'completed' && status === 'completed') {
      const Inventory = require('../models/Inventory').default;
      
      // Find existing inventory for this blood group at this hospital
      let inventory = await Inventory.findOne({
        organization: req.user.id,
        bloodGroup: donation.bloodGroup,
      });

      if (inventory) {
        // Update existing inventory
        inventory.available = (inventory.available || 0) + 1;
        await inventory.save();
      } else {
        // Create new inventory entry
        await Inventory.create({
          organization: req.user.id,
          bloodGroup: donation.bloodGroup,
          available: 1,
        });
      }
    }

    await donation.populate('donor', 'name phone age');
    
    res.status(200).json({
      message: `Donation ${status} successfully`,
      donation,
    });
  } catch (error) {
    console.error('Update donation status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
