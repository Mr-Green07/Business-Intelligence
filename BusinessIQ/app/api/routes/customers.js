const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getCustomers,
  getCustomerStats,
  getCustomerById,
} = require("../controllers/customersController");

// GET /api/customers  (?page=&limit=)
router.get("/", protect, getCustomers);

// GET /api/customers/stats
router.get("/stats", protect, getCustomerStats);

// GET /api/customers/:id
router.get("/:id", protect, getCustomerById);

module.exports = router;
