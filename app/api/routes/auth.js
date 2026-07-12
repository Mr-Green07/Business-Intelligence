const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  login,
  logout,
  me,
} = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

// GET  /api/auth/me  (protected)
router.get("/me", protect, me);

module.exports = router;
