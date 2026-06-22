const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getRegions,
  getRegionByState,
  getRegionInsights,
  getRegionRecommendations,
} = require("../controllers/regionsController");

// GET /api/regions
router.get("/", protect, getRegions);

// GET /api/regions/:stateName
router.get("/:stateName", protect, getRegionByState);

// GET /api/regions/:stateName/insights
router.get("/:stateName/insights", protect, getRegionInsights);

// GET /api/regions/:stateName/recommendations
router.get("/:stateName/recommendations", protect, getRegionRecommendations);

module.exports = router;
