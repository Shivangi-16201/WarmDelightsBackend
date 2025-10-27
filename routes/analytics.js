const express = require('express');
const {
  trackEvent,
  getAnalytics,
  getRecentActivity,
} = require('../controllers/analyticsController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/track', trackEvent); // Allow public event tracking
router.get('/', auth, adminAuth, getAnalytics);
router.get('/recent-activity', auth, adminAuth, getRecentActivity);

module.exports = router;
