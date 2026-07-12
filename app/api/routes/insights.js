const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getInsights,
  getRecommendations,
  generateInsights,
} = require("../controllers/insightsController");

// GET  /api/insights
router.get("/insights", protect, getInsights);

// GET  /api/recommendations
router.get("/recommendations", protect, getRecommendations);

// POST /api/insights/generate
router.post("/insights/generate", protect, generateInsights);

module.exports = router;
