const express = require('express');
const router = express.Router();
const { getQuery, allQuery, runQuery } = require('../db');
const { authenticateToken } = require('../middleware/auth');
const { logActivity } = require('../utils/activity');
const { broadcastNotification } = require('../utils/websocket');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await allQuery('SELECT * FROM insights ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate', authenticateToken, async (req, res) => {
  try {
    console.log('Running Insights Generation Engine...');

    const catStats = await allQuery('SELECT category, SUM(revenue) as rev FROM sales_data GROUP BY category');
    const totalRevRow = await getQuery('SELECT SUM(revenue) as total_rev FROM sales_data');
    const totalRev = totalRevRow.total_rev;

    const stateRevs = await allQuery('SELECT state, SUM(revenue) as rev, SUM(orders) as orders FROM sales_data GROUP BY state ORDER BY rev ASC');
    const lowestState = stateRevs[0];
    const highestState = stateRevs[stateRevs.length - 1];

    const generatedInsights = [];
    const generatedRecommendations = [];

    if (lowestState) {
      const insightDesc = `An analysis of regional transaction logs reveals that ${lowestState.state} has the lowest revenue contribution at ₹${Math.round(lowestState.revenue || lowestState.rev)} Lakhs across ${lowestState.orders} orders.`;
      const insightTitle = `Low Revenue Volume in ${lowestState.state}`;
      
      const exists = await getQuery('SELECT id FROM insights WHERE title = ?', [insightTitle]);
      if (!exists) {
        await runQuery(
          'INSERT INTO insights (state, type, title, description) VALUES (?, ?, ?, ?)',
          [lowestState.state, 'warning', insightTitle, insightDesc]
        );
        generatedInsights.push({ state: lowestState.state, type: 'warning', title: insightTitle, description: insightDesc });
      }

      const recTitle = `Establish Localized Promotions in ${lowestState.state}`;
      const recDesc = `Design and implement hyper-local promotional campaigns and price elasticity adjustments in ${lowestState.state} to boost order volumes and active customer counts.`;
      
      const recExists = await getQuery('SELECT id FROM recommendations WHERE title = ?', [recTitle]);
      if (!recExists) {
        await runQuery(
          'INSERT INTO recommendations (state, title, description, impact) VALUES (?, ?, ?, ?)',
          [lowestState.state, recTitle, recDesc, 'Medium']
        );
        generatedRecommendations.push({ state: lowestState.state, title: recTitle, description: recDesc, impact: 'Medium' });
      }
    }

    if (catStats && catStats.length > 0) {
      const topCat = catStats.reduce((max, c) => c.rev > max.rev ? c : max, catStats[0]);
      const pct = Math.round((topCat.rev / totalRev) * 100);
      
      if (pct > 40) {
        const insightTitle = `High Category Dependency: ${topCat.category}`;
        const insightDesc = `${topCat.category} continues to dominate the sales portfolio, accounting for ${pct}% of overall revenue. High concentration of sales carries structural portfolio risks.`;
        
        const exists = await getQuery('SELECT id FROM insights WHERE title = ?', [insightTitle]);
        if (!exists) {
          await runQuery(
            'INSERT INTO insights (state, type, title, description) VALUES (?, ?, ?, ?)',
            ['all', 'info', insightTitle, insightDesc]
          );
          generatedInsights.push({ state: 'all', type: 'info', title: insightTitle, description: insightDesc });
        }

        const recTitle = `Diversify Product Portfolio`;
        const recDesc = `Increase marketing allocations towards underperforming product classes by 15% and introduce bundled cross-category discounts to reduce concentration dependency on ${topCat.category}.`;
        
        const recExists = await getQuery('SELECT id FROM recommendations WHERE title = ?', [recTitle]);
        if (!recExists) {
          await runQuery(
            'INSERT INTO recommendations (state, title, description, impact) VALUES (?, ?, ?, ?)',
            ['all', recTitle, recDesc, 'High']
          );
          generatedRecommendations.push({ state: 'all', title: recTitle, description: recDesc, impact: 'High' });
        }
      }
    }

    if (generatedInsights.length > 0) {
      const notifTitle = `Engine Generated ${generatedInsights.length} New Insights`;
      const notifMsg = `The BI analytics engine finished data parsing and compiled ${generatedInsights.length} new business insights and recommendations.`;
      
      await runQuery('INSERT INTO notifications (title, message, type) VALUES (?, ?, ?)', [notifTitle, notifMsg, 'system']);
      
      const newNotif = await getQuery('SELECT * FROM notifications ORDER BY id DESC LIMIT 1');
      broadcastNotification(newNotif);
    }

    await logActivity(req.user.id, 'Trigger Insights Generation', `Generated ${generatedInsights.length} insights and ${generatedRecommendations.length} recommendations.`);

    res.json({
      success: true,
      message: 'Insights engine run completed successfully!',
      generatedInsightsCount: generatedInsights.length,
      generatedRecommendationsCount: generatedRecommendations.length,
      insights: generatedInsights,
      recommendations: generatedRecommendations
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
