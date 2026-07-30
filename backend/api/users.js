const express = require('express');
const router = express.Router();
const { allQuery } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/activity', authenticateToken, async (req, res) => {
  if (req.user.role.toLowerCase() !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Audit logs are restricted to administrators.' });
  }

  try {
    const rows = await allQuery(`
      SELECT ua.id, ua.action, ua.details, ua.timestamp, u.name as user_name, u.role as user_role
      FROM user_activity ua
      LEFT JOIN users u ON ua.user_id = u.id
      ORDER BY ua.timestamp DESC
      LIMIT 100
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
