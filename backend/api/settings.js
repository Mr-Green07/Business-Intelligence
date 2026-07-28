const express = require('express');
const router = express.Router();
const { getQuery, runQuery } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { logActivity } = require('../utils/activity');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const row = await getQuery('SELECT theme, email_alerts, auto_insight_generation FROM settings WHERE user_id = ?', [req.user.id]);
    if (!row) {
      await runQuery('INSERT INTO settings (user_id, theme, email_alerts, auto_insight_generation) VALUES (?, "light", 1, 1)', [req.user.id]);
      return res.json({ theme: 'light', email_alerts: 1, auto_insight_generation: 1 });
    }
    res.json({
      theme: row.theme,
      email_alerts: row.email_alerts === 1,
      auto_insight_generation: row.auto_insight_generation === 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/', authenticateToken, async (req, res) => {
  const { theme, email_alerts, auto_insight_generation } = req.body;
  try {
    await runQuery(
      `INSERT INTO settings (user_id, theme, email_alerts, auto_insight_generation)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
       theme = excluded.theme,
       email_alerts = excluded.email_alerts,
       auto_insight_generation = excluded.auto_insight_generation`,
      [req.user.id, theme, email_alerts ? 1 : 0, auto_insight_generation ? 1 : 0]
    );
    await logActivity(req.user.id, 'Update Settings', `Changed theme to ${theme}, notifications to ${email_alerts}`);
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
