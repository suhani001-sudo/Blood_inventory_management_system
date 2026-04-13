import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';

export const addInventory = async (req, res) => {
  try {
    const { bloodGroup, quantity, type, organization } = req.body;

    if (!bloodGroup || !quantity || !type) {
      return res
        .status(400)
        .json({ message: 'bloodGroup, quantity and type are required' });
    }

    if (!['IN', 'OUT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type (IN / OUT)' });
    }

    const organizationId =
      req.user.role === 'hospital' ? req.user._id : organization;

    if (!organizationId) {
      return res
        .status(400)
        .json({ message: 'Organization is required for inventory' });
    }

    const organizationUser = await User.findById(organizationId);
    if (!organizationUser || organizationUser.role !== 'hospital') {
      return res.status(400).json({ message: 'Invalid hospital organization' });
    }

    const inventory = await Inventory.create({
      bloodGroup,
      quantity,
      type,
      organization: organizationUser._id,
      createdBy: req.user._id,
    });

    return res.status(201).json(inventory);
  } catch (error) {
    console.error('Add inventory error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getInventory = async (req, res) => {
  try {
    const match = {};

    if (req.user.role === 'hospital') {
      match.organization = req.user._id;
    }

    const summary = await Inventory.aggregate([
      { $match: match },
      {
        $group: {
          _id: { bloodGroup: '$bloodGroup', organization: '$organization' },
          totalIn: {
            $sum: {
              $cond: [{ $eq: ['$type', 'IN'] }, '$quantity', 0],
            },
          },
          totalOut: {
            $sum: {
              $cond: [{ $eq: ['$type', 'OUT'] }, '$quantity', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          bloodGroup: '$_id.bloodGroup',
          organization: '$_id.organization',
          available: { $subtract: ['$totalIn', '$totalOut'] },
        },
      },
    ]);

    const populated = await User.populate(summary, {
      path: 'organization',
      select: 'organizationName name',
    });

    return res.json(populated);
  } catch (error) {
    console.error('Get inventory error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getInventoryByHospital = async (req, res) => {
  try {
    const hospitalId = req.params.id;

    const summary = await Inventory.aggregate([
      {
        $match: {
          organization: new mongoose.Types.ObjectId(hospitalId),
        },
      },
      {
        $group: {
          _id: '$bloodGroup',
          totalIn: {
            $sum: {
              $cond: [{ $eq: ['$type', 'IN'] }, '$quantity', 0],
            },
          },
          totalOut: {
            $sum: {
              $cond: [{ $eq: ['$type', 'OUT'] }, '$quantity', 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          bloodGroup: '$_id',
          available: { $subtract: ['$totalIn', '$totalOut'] },
        },
      },
    ]);

    return res.json(summary);
  } catch (error) {
    console.error('Get hospital inventory error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    if (
      req.user.role === 'hospital' &&
      inventory.organization.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not allowed to delete this record' });
    }

    await inventory.deleteOne();

    return res.json({ message: 'Inventory deleted' });
  } catch (error) {
    console.error('Delete inventory error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

