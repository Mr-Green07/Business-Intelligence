// Insight strings mirror those shown in Insights.jsx.
const INSIGHTS = [
  "Revenue increased by 18% compared to last month.",
  "Laptop contributes 22% of total revenue.",
  "Punjab is the highest revenue-generating region.",
  "Returning customers account for 64% of sales.",
  "Order completion rate is above 90%.",
  "Electronics is the fastest-growing category.",
];

const RECOMMENDATIONS = [
  "Increase Electronics inventory in Punjab and Telangana by 15%.",
  "Launch a festive campaign targeting West Bengal customers.",
  "Introduce a loyalty programme to improve customer retention in Bihar.",
  "Expand premium product offerings in Delhi and Karnataka.",
  "Run promotional campaigns to reverse the declining trend in Gujarat.",
  "Prepare winter inventory for Jammu and Kashmir ahead of the season.",
];

/**
 * GET /api/insights  (protected)
 */
const getInsights = async (req, res, next) => {
  try {
    res.status(200).json({ insights: INSIGHTS });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/recommendations  (protected)
 */
const getRecommendations = async (req, res, next) => {
  try {
    res.status(200).json({ recommendations: RECOMMENDATIONS });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/insights/generate  (protected)
 * TODO: Trigger an AI/ML pipeline to generate fresh insights from live DB data.
 */
const generateInsights = async (req, res, next) => {
  try {
    // Returning the same static insights until the generation pipeline is wired up.
    res.status(200).json({
      message: "Insights generated successfully.",
      insights: INSIGHTS,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getInsights, getRecommendations, generateInsights };
