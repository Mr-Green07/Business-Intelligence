const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

// Store uploads in memory for the stub; swap for disk/S3 storage when live.
const upload = multer({ storage: multer.memoryStorage() }).single("file");

// In-memory upload history — replace with DB persistence.
const uploadHistory = [
  {
    id:         "a1b2c3d4-0000-0000-0000-000000000001",
    filename:   "sales_q1_2026.csv",
    uploadedAt: "2026-03-31T10:15:00.000Z",
    status:     "completed",
    rows:       1240,
  },
  {
    id:         "a1b2c3d4-0000-0000-0000-000000000002",
    filename:   "customers_march.xlsx",
    uploadedAt: "2026-03-28T08:45:00.000Z",
    status:     "completed",
    rows:       380,
  },
];

/**
 * POST /api/upload  (protected)
 * Accepts a multipart/form-data file upload.
 */
const uploadFile = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(err);

    try {
      if (!req.file) {
        const e = new Error("No file provided.");
        e.status = 400;
        return next(e);
      }

      const record = {
        id:         uuidv4(),
        filename:   req.file.originalname,
        uploadedAt: new Date().toISOString(),
        status:     "processing",
        rows:       null,
      };

      uploadHistory.unshift(record);

      // TODO: Parse file, validate schema, persist rows to DB, update status.
      res.status(202).json({
        message: "File accepted for processing.",
        upload:  record,
      });
    } catch (e) {
      next(e);
    }
  });
};

/**
 * GET /api/upload/history  (protected)
 */
const getUploadHistory = async (req, res, next) => {
  try {
    res.status(200).json({ history: uploadHistory });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/upload/:id/status  (protected)
 */
const getUploadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const record = uploadHistory.find((u) => u.id === id);

    if (!record) {
      const err = new Error(`Upload with id "${id}" not found.`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ upload: record });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadFile, getUploadHistory, getUploadStatus };
