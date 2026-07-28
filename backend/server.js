const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { initializeDatabase } = require('./db');
const { setupWebSockets } = require('./utils/websocket');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initializeDatabase().then(() => {
  console.log('Database initialized successfully.');
}).catch(err => {
  console.error('Database initialization failed:', err);
});

// WebSocket setup
const server = http.createServer(app);
setupWebSockets(server);

// API Routes
app.use('/api', apiRouter);

// Catch-all API 404 handler to guarantee we always return JSON for missing API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.originalUrl} not found` });
});

// Serve React frontend built files in production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Catch-all for React Router SPA fallback (must be after API routes)
app.use((req, res) => {
  if (req.method === 'GET') {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  } else {
    res.status(404).end();
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`
  ======================================================
    BusinessIQ Enterprise BI Server
  ======================================================
    Port: ${PORT}
    API Endpoint: http://localhost:${PORT}/api
    WebSockets: ws://localhost:${PORT}/ws/notifications
  ======================================================
  `);
});
