require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes          = require("./routes/auth");
const dashboardRoutes     = require("./routes/dashboard");
const salesRoutes         = require("./routes/sales");
const regionsRoutes       = require("./routes/regions");
const customersRoutes     = require("./routes/customers");
const insightsRoutes      = require("./routes/insights");
const uploadRoutes        = require("./routes/upload");
const notificationsRoutes = require("./routes/notifications");
const settingsRoutes      = require("./routes/settings");

const errorHandler = require("./middleware/errorHandler");

const app = express();

// ── Core middleware ────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/sales",         salesRoutes);
app.use("/api/regions",       regionsRoutes);
app.use("/api/customers",     customersRoutes);
app.use("/api",               insightsRoutes);   // mounts /api/insights & /api/recommendations
app.use("/api/upload",        uploadRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api",               settingsRoutes);   // mounts /api/settings & /api/users/activity

// ── Global error handler ───────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
