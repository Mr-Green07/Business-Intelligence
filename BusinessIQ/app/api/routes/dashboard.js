const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getKPIs, getSummary } = require("../controllers/dashboardController");

// GET /api/dashboard/kpis
router.get("/kpis", protect, getKPIs);

// GET /api/dashboard/summary
router.get("/summary", protect, getSummary);

module.exports = router;
