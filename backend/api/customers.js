const express = require('express');
const router = express.Router();
const { getQuery, allQuery } = require('../db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  const { search = '', state = '', segment = '', limit = 10, offset = 0 } = req.query;

  let query = 'SELECT * FROM customers WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR email LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (state) {
    query += ' AND state = ?';
    params.push(state);
  }
  if (segment) {
    query += ' AND segment = ?';
    params.push(segment);
  }

  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');

  query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  try {
    const totalRow = await getQuery(countQuery, params.slice(0, params.length - 2));
    const items = await allQuery(query, params);

    res.json({
      total: totalRow.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
      items
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const segments = await allQuery('SELECT segment, COUNT(*) as count, AVG(clv) as avg_clv FROM customers GROUP BY segment');
    const retention = await allQuery('SELECT retention_status, COUNT(*) as count FROM customers GROUP BY retention_status');
    const totalRow = await getQuery('SELECT COUNT(*) as count FROM customers');
    
    // Monthly acquisition trend over the past months
    const acquisitionRows = await allQuery(`
      SELECT SUBSTR(acquisition_date, 1, 7) as month, COUNT(*) as count
      FROM customers
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      total: totalRow.count,
      segments: segments.map(s => ({
        segment: s.segment,
        count: s.count,
        avgClv: Math.round(s.avg_clv)
      })),
      retention: retention.map(r => ({
        status: r.retention_status,
        count: r.count
      })),
      acquisitionTrend: acquisitionRows.map(a => ({
        month: a.month,
        count: a.count
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await getQuery('SELECT * FROM customers WHERE id = ?', [id]);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
