const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationsController");

// GET   /api/notifications
router.get("/", protect, getNotifications);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", protect, markAsRead);

module.exports = router;
