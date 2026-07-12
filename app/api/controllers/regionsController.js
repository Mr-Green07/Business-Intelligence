// Mock data mirrors regionData.jsx in the frontend exactly.
const REGION_DATA = {
  Punjab: {
    revenue: "₹12.4M", growth: 18, orders: 2100, customers: 1500,
    topProduct: "Electronics",
    insight: "Electronics sales rising rapidly.",
    recommendation: "Increase inventory by 15%.",
  },
  Maharashtra: {
    revenue: "₹55M", growth: 24, orders: 6800, customers: 4200,
    topProduct: "Mobiles",
    insight: "Highest revenue contributor.",
    recommendation: "Open another warehouse.",
  },
  Karnataka: {
    revenue: "₹48M", growth: 21, orders: 5900, customers: 3900,
    topProduct: "Laptops",
    insight: "Bengaluru driving strong tech sales.",
    recommendation: "Expand premium inventory.",
  },
  Rajasthan: {
    revenue: "₹18M", growth: 9, orders: 2400, customers: 1700,
    topProduct: "Home Decor",
    insight: "Steady growth in urban markets.",
    recommendation: "Increase digital marketing.",
  },
  Haryana: {
    revenue: "₹27M", growth: 14, orders: 3200, customers: 2200,
    topProduct: "Automotive",
    insight: "Strong B2B demand from Gurgaon.",
    recommendation: "Target enterprise customers.",
  },
  "Jammu and Kashmir": {
    revenue: "₹9M", growth: 6, orders: 1100, customers: 800,
    topProduct: "Winter Wear",
    insight: "Seasonal demand driving sales.",
    recommendation: "Prepare winter inventory early.",
  },
  "Madhya Pradesh": {
    revenue: "₹23M", growth: 11, orders: 2900, customers: 2100,
    topProduct: "Agricultural Equipment",
    insight: "Tier-2 cities showing strong adoption.",
    recommendation: "Expand distribution network.",
  },
  Odisha: {
    revenue: "₹17M", growth: 8, orders: 2200, customers: 1600,
    topProduct: "Consumer Goods",
    insight: "Coastal regions performing well.",
    recommendation: "Increase retail partnerships.",
  },
  "West Bengal": {
    revenue: "₹34M", growth: 16, orders: 4300, customers: 3100,
    topProduct: "Fashion",
    insight: "Kolkata remains the strongest market.",
    recommendation: "Launch festive campaigns.",
  },
  Bihar: {
    revenue: "₹15M", growth: 7, orders: 1900, customers: 1400,
    topProduct: "Affordable Smartphones",
    insight: "Customer base expanding steadily.",
    recommendation: "Focus on customer retention.",
  },
  Gujarat: {
    revenue: "₹21M", growth: -2, orders: 3850, customers: 2800,
    topProduct: "Clothing",
    insight: "Demand slowing in apparel segment.",
    recommendation: "Run promotional campaigns.",
  },
  Delhi: {
    revenue: "₹31M", growth: 12, orders: 3800, customers: 2800,
    topProduct: "Fashion",
    insight: "Premium category performing well.",
    recommendation: "Expand premium offerings.",
  },
  Telangana: {
    revenue: "₹42M", growth: 19, orders: 5200, customers: 3400,
    topProduct: "Electronics",
    insight: "Strong growth in Hyderabad.",
    recommendation: "Increase inventory levels.",
  },
};

/**
 * GET /api/regions  (protected)
 */
const getRegions = async (req, res, next) => {
  try {
    const regions = Object.entries(REGION_DATA).map(([stateName, data]) => ({
      stateName,
      ...data,
    }));

    res.status(200).json({ regions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/regions/:stateName  (protected)
 */
const getRegionByState = async (req, res, next) => {
  try {
    const { stateName } = req.params;
    const region = REGION_DATA[stateName];

    if (!region) {
      const err = new Error(`Region "${stateName}" not found.`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ stateName, ...region });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/regions/:stateName/insights  (protected)
 */
const getRegionInsights = async (req, res, next) => {
  try {
    const { stateName } = req.params;
    const region = REGION_DATA[stateName];

    if (!region) {
      const err = new Error(`Region "${stateName}" not found.`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ stateName, insight: region.insight });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/regions/:stateName/recommendations  (protected)
 */
const getRegionRecommendations = async (req, res, next) => {
  try {
    const { stateName } = req.params;
    const region = REGION_DATA[stateName];

    if (!region) {
      const err = new Error(`Region "${stateName}" not found.`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ stateName, recommendation: region.recommendation });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRegions,
  getRegionByState,
  getRegionInsights,
  getRegionRecommendations,
};
