const User = require('../models/User');
const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const EmergencyRequest = require('../models/EmergencyRequest');
const Event = require('../models/Event');
const { getOverallStatistics } = require('../utils/statistics');

// @desc    Get dashboard data for admin
// @route   GET /api/dashboard/admin
// @access  Private (Admin)
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get overall statistics
    const stats = await getOverallStatistics();
    
    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');
    
    // Get recent blood requests
    const recentRequests = await BloodRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('requestedBy', 'name')
      .select('bloodType units status hospital createdAt');
    
    // Get recent emergency requests
    const recentEmergencyRequests = await EmergencyRequest.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('requestedBy', 'name')
      .select('bloodType units status hospital createdAt');
    
    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() }
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('organizer', 'name')
      .select('title date location.coordinates address status');
    
    res.json({
      stats,
      recentUsers,
      recentRequests,
      recentEmergencyRequests,
      upcomingEvents
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard data for donor
// @route   GET /api/dashboard/donor
// @access  Private
exports.getDonorDashboard = async (req, res) => {
  try {
    // Get donor profile
    const donor = await Donor.findOne({ user: req.user.id });
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor profile not found' });
    }
    
    // Get donation history
    const donationHistory = donor.donationHistory.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    ).slice(0, 5);
    
    // Get nearby blood requests
    const nearbyRequests = await BloodRequest.find({
      status: 'open',
      bloodType: donor.bloodType,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: donor.location.coordinates
          },
          $maxDistance: 10000 // 10km
        }
      }
    })
      .limit(5)
      .select('bloodType units hospital createdAt');
    
    // Get nearby emergency requests
    const nearbyEmergencyRequests = await EmergencyRequest.find({
      status: 'open',
      bloodType: donor.bloodType,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: donor.location.coordinates
          },
          $maxDistance: 10000 // 10km
        }
      }
    })
      .limit(5)
      .select('bloodType units hospital createdAt urgencyLevel');
    
    // Get upcoming events
    const upcomingEvents = await Event.find({
      date: { $gte: new Date() },
      $or: [
        { bloodTypesNeeded: 'All' },
        { bloodTypesNeeded: donor.bloodType }
      ],
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: donor.location.coordinates
          },
          $maxDistance: 20000 // 20km
        }
      }
    })
      .sort({ date: 1 })
      .limit(5)
      .select('title date address');
    
    res.json({
      donor: {
        name: donor.name,
        bloodType: donor.bloodType,
        lastDonation: donationHistory[0]?.date || null,
        totalDonations: donor.donationHistory.length
      },
      donationHistory,
      nearbyRequests,
      nearbyEmergencyRequests,
      upcomingEvents
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard data for hospital
// @route   GET /api/dashboard/hospital
// @access  Private (Hospital)
exports.getHospitalDashboard = async (req, res) => {
  try {
    // Get hospital's active requests
    const activeRequests = await BloodRequest.find({
      requestedBy: req.user.id,
      status: { $in: ['open', 'in-progress'] }
    })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get hospital's active emergency requests
    const activeEmergencyRequests = await EmergencyRequest.find({
      requestedBy: req.user.id,
      status: { $in: ['open', 'in-progress'] }
    })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get hospital's request history
    const requestHistory = await BloodRequest.find({
      requestedBy: req.user.id
    })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Get nearby donors count by blood type
    const hospital = await User.findById(req.user.id).select('location');
    
    let nearbyDonorsByBloodType = [];
    
    if (hospital && hospital.location) {
      nearbyDonorsByBloodType = await Donor.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: hospital.location.coordinates
            },
            distanceField: 'distance',
            maxDistance: 20000, // 20km
            query: { isAvailable: true }
          }
        },
        {
          $group: {
            _id: '$bloodType',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
    }
    
    res.json({
      activeRequests,
      activeEmergencyRequests,
      requestHistory,
      nearbyDonorsByBloodType
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
