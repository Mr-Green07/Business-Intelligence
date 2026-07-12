/**
 * GET /api/dashboard/kpis  (protected)
 * Returns the six headline KPI cards shown on the Dashboard.
 */
const getKPIs = async (req, res, next) => {
  try {
    const kpis = [
      { title: "Total Revenue",  value: "₹12.4M", growth: "18%"  },
      { title: "Growth Rate",    value: "18.2%",  growth: "3%"   },
      { title: "Orders",         value: 3248,      growth: "8%"   },
      { title: "Customers",      value: 1152,      growth: "5%"   },
      { title: "Top Product",    value: "Laptop",  growth: "22%"  },
      { title: "Top Region",     value: "Punjab",  growth: "18%"  },
    ];

    res.status(200).json({ kpis });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/dashboard/summary  (protected)
 * Returns a brief narrative summary for the dashboard.
 */
const getSummary = async (req, res, next) => {
  try {
    const summary = {
      revenueInsight:  "Revenue increased by 18% this month.",
      bestProduct:     "Laptop contributes 22% of total sales.",
      topRegion:       "Punjab is the highest revenue-generating region.",
      returningCustomers: "Returning customers account for 64% of sales.",
      orderCompletion:    "Order completion rate is above 90%.",
    };

    res.status(200).json({ summary });
  } catch (err) {
    next(err);
  }
};

module.exports = { getKPIs, getSummary };
