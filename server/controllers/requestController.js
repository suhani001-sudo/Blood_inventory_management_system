import Request from '../models/Request.js';
import User from '../models/User.js';

export const createRequest = async (req, res) => {
  try {
    const { hospital, bloodGroup, quantity } = req.body;

    if (!hospital || !bloodGroup || !quantity) {
      return res
        .status(400)
        .json({ message: 'hospital, bloodGroup and quantity are required' });
    }

    const hospitalUser = await User.findById(hospital);
    if (!hospitalUser || hospitalUser.role !== 'hospital') {
      return res.status(400).json({ message: 'Invalid hospital' });
    }

    const request = await Request.create({
      requester: req.user._id,
      hospital: hospitalUser._id,
      bloodGroup,
      quantity,
      status: 'pending',
    });

    return res.status(201).json(request);
  } catch (error) {
    console.error('Create request error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getRequests = async (req, res) => {
  try {
    const filter = {};

    if (req.user.role === 'hospital') {
      filter.hospital = req.user._id;
    } else if (req.user.role === 'user') {
      filter.requester = req.user._id;
    }

    const requests = await Request.find(filter)
      .populate('requester', 'name email bloodGroup')
      .populate('hospital', 'organizationName');

    return res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (
      req.user.role === 'hospital' &&
      request.hospital.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not allowed to update this request' });
    }

    request.status = status;
    await request.save();

    return res.json(request);
  } catch (error) {
    console.error('Update request error:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

