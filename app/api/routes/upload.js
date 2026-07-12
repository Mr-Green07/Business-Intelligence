const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  uploadFile,
  getUploadHistory,
  getUploadStatus,
} = require("../controllers/uploadController");

// POST /api/upload
router.post("/", protect, uploadFile);

// GET  /api/upload/history
router.get("/history", protect, getUploadHistory);

// GET  /api/upload/:id/status
router.get("/:id/status", protect, getUploadStatus);

module.exports = router;
