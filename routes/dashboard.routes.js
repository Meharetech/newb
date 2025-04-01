const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// @route   GET /api/dashboard/admin
// @desc    Get dashboard data for admin
// @access  Private (Admin)
router.get('/admin', [auth, checkRole(['admin'])], dashboardController.getAdminDashboard);

// @route   GET /api/dashboard/donor
// @desc    Get dashboard data for donor
// @access  Private
router.get('/donor', auth, dashboardController.getDonorDashboard);

// @route   GET /api/dashboard/hospital
// @desc    Get dashboard data for hospital
// @access  Private (Hospital)
router.get('/hospital', [auth, checkRole(['hospital'])], dashboardController.getHospitalDashboard);

module.exports = router;
