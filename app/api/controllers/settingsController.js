// In-memory settings store — replace with DB persistence.
let appSettings = {
  appName:        "DecisionPilot",
  defaultCurrency: "INR",
  timezone:        "Asia/Kolkata",
  dateFormat:      "DD/MM/YYYY",
  language:        "en-IN",
  theme:           "light",
  notificationsEnabled: true,
  autoRefreshInterval:  30,   // seconds
};

// Mock activity log — replace with DB query.
const activityLog = [
  { userId: 1, action: "Logged in",              timestamp: "2026-06-22T08:00:00.000Z" },
  { userId: 1, action: "Viewed Dashboard",        timestamp: "2026-06-22T08:01:30.000Z" },
  { userId: 1, action: "Generated insights",      timestamp: "2026-06-22T08:05:00.000Z" },
  { userId: 1, action: "Uploaded sales_q1.csv",   timestamp: "2026-06-22T08:10:00.000Z" },
  { userId: 1, action: "Viewed Regional Analytics",timestamp: "2026-06-22T08:15:00.000Z" },
];

/**
 * GET /api/settings  (protected)
 */
const getSettings = async (req, res, next) => {
  try {
    res.status(200).json({ settings: appSettings });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/settings  (protected)
 * Body: Partial or full settings object.
 */
const updateSettings = async (req, res, next) => {
  try {
    // Merge incoming values over current settings (shallow merge).
    appSettings = { ...appSettings, ...req.body };
    // TODO: Persist updated settings to DB.
    res.status(200).json({ message: "Settings updated.", settings: appSettings });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/users/activity  (protected)
 */
const getUserActivity = async (req, res, next) => {
  try {
    // TODO: Filter by req.user.id and support pagination.
    res.status(200).json({ activity: activityLog });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings, getUserActivity };
