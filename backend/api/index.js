const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const dashboardRoutes = require('./dashboard');
const salesRoutes = require('./sales');
const regionsRoutes = require('./regions');
const customersRoutes = require('./customers');
const insightsRoutes = require('./insights');
const recommendationsRoutes = require('./recommendations');
const uploadRoutes = require('./upload');
const notificationsRoutes = require('./notifications');
const settingsRoutes = require('./settings');
const usersRoutes = require('./users');

// Mount routes
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/sales', salesRoutes);
router.use('/regions', regionsRoutes);
router.use('/customers', customersRoutes);
router.use('/insights', insightsRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/upload', uploadRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/settings', settingsRoutes);
router.use('/users', usersRoutes);

// Base /api endpoints for health check
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'BusinessIQ Enterprise BI API is fully operational!',
    version: '1.0.0',
    database: 'connected'
  });
});

module.exports = router;
