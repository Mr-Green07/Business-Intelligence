const { runQuery } = require('../db');

// Helper to log user activity
async function logActivity(userId, action, details = '') {
  try {
    await runQuery(
      'INSERT INTO user_activity (user_id, action, details) VALUES (?, ?, ?)',
      [userId, action, details]
    );
  } catch (err) {
    console.error('Error logging activity:', err);
  }
}

module.exports = {
  logActivity
};
