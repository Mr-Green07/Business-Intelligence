const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getSalesTrend,
  getSalesCategories,
  getOrderStatus,
  getRegionalSales,
  getSales,
} = require("../controllers/salesController");

// GET /api/sales/trend
router.get("/trend", protect, getSalesTrend);

// GET /api/sales/categories
router.get("/categories", protect, getSalesCategories);

// GET /api/sales/orders/status
router.get("/orders/status", protect, getOrderStatus);

// GET /api/sales/regional
router.get("/regional", protect, getRegionalSales);

// GET /api/sales?from=&to=
router.get("/", protect, getSales);

module.exports = router;
