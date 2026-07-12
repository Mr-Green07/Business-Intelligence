/**
 * Global Express error handler.
 * Must be registered as the last middleware (4-argument signature).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  console.error(`[Error ${status}] ${err.message}`);
  res.status(status).json({ error: err.message || "Internal Server Error" });
};

module.exports = errorHandler;
