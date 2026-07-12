const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getSettings,
  updateSettings,
  getUserActivity,
} = require("../controllers/settingsController");

// GET /api/settings
router.get("/settings", protect, getSettings);

// PUT /api/settings
router.put("/settings", protect, updateSettings);

// GET /api/users/activity
router.get("/users/activity", protect, getUserActivity);

module.exports = router;
