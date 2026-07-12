/**
 * GET /api/sales/trend  (protected)
 * Month-by-month revenue trend for the current fiscal year.
 */
const getSalesTrend = async (req, res, next) => {
  try {
    const trend = [
      { month: "Jan", revenue: 850000  },
      { month: "Feb", revenue: 920000  },
      { month: "Mar", revenue: 1050000 },
      { month: "Apr", revenue: 980000  },
      { month: "May", revenue: 1100000 },
      { month: "Jun", revenue: 1250000 },
      { month: "Jul", revenue: 1180000 },
      { month: "Aug", revenue: 1320000 },
      { month: "Sep", revenue: 1400000 },
      { month: "Oct", revenue: 1350000 },
      { month: "Nov", revenue: 1500000 },
      { month: "Dec", revenue: 1690000 },
    ];

    res.status(200).json({ trend });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sales/categories  (protected)
 * Revenue breakdown by product category.
 */
const getSalesCategories = async (req, res, next) => {
  try {
    const categories = [
      { name: "Electronics", sales: "₹5.2M", salesRaw: 5200000 },
      { name: "Furniture",   sales: "₹3.1M", salesRaw: 3100000 },
      { name: "Clothing",    sales: "₹2.4M", salesRaw: 2400000 },
    ];

    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sales/orders/status  (protected)
 * Count of orders by fulfilment status.
 */
const getOrderStatus = async (req, res, next) => {
  try {
    const orderStatus = {
      completed: 2750,
      pending:   320,
      cancelled: 178,
      total:     3248,
    };

    res.status(200).json({ orderStatus });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sales/regional  (protected)
 * Revenue by top regions.
 */
const getRegionalSales = async (req, res, next) => {
  try {
    const regions = [
      { region: "Punjab", revenue: "₹3.2M", revenueRaw: 3200000 },
      { region: "Delhi",  revenue: "₹2.7M", revenueRaw: 2700000 },
      { region: "Mumbai", revenue: "₹2.4M", revenueRaw: 2400000 },
    ];

    res.status(200).json({ regions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/sales?from=&to=  (protected)
 * Returns all sales records, optionally filtered by date range.
 */
const getSales = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    // TODO: Replace with DB query filtered by from/to dates.
    const sales = [
      { id: 1, date: "2026-01-15", product: "Laptop",     region: "Punjab",      amount: 75000,  status: "completed" },
      { id: 2, date: "2026-02-03", product: "Smartphone",  region: "Delhi",       amount: 32000,  status: "completed" },
      { id: 3, date: "2026-02-18", product: "Office Chair",region: "Maharashtra", amount: 18500,  status: "pending"   },
      { id: 4, date: "2026-03-07", product: "Laptop",      region: "Karnataka",   amount: 82000,  status: "completed" },
      { id: 5, date: "2026-03-22", product: "T-Shirt",     region: "Gujarat",     amount: 1200,   status: "cancelled" },
    ];

    res.status(200).json({ sales, filters: { from: from || null, to: to || null } });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSalesTrend,
  getSalesCategories,
  getOrderStatus,
  getRegionalSales,
  getSales,
};
