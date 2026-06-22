// Mock customer records — replace with DB queries when live.
const MOCK_CUSTOMERS = [
  { id: 1,  name: "Aarav Sharma",   email: "aarav@example.in",   region: "Punjab",      totalOrders: 12, totalSpend: "₹48,000",  status: "active"   },
  { id: 2,  name: "Priya Nair",     email: "priya@example.in",   region: "Kerala",       totalOrders: 8,  totalSpend: "₹22,500",  status: "active"   },
  { id: 3,  name: "Rohit Mehta",    email: "rohit@example.in",   region: "Maharashtra",  totalOrders: 5,  totalSpend: "₹15,200",  status: "inactive" },
  { id: 4,  name: "Kavya Reddy",    email: "kavya@example.in",   region: "Telangana",    totalOrders: 19, totalSpend: "₹71,000",  status: "active"   },
  { id: 5,  name: "Arjun Singh",    email: "arjun@example.in",   region: "Delhi",        totalOrders: 3,  totalSpend: "₹9,800",   status: "active"   },
  { id: 6,  name: "Sneha Patil",    email: "sneha@example.in",   region: "Karnataka",    totalOrders: 14, totalSpend: "₹55,600",  status: "active"   },
  { id: 7,  name: "Vikram Joshi",   email: "vikram@example.in",  region: "Rajasthan",    totalOrders: 7,  totalSpend: "₹28,300",  status: "inactive" },
  { id: 8,  name: "Ananya Das",     email: "ananya@example.in",  region: "West Bengal",  totalOrders: 11, totalSpend: "₹41,900",  status: "active"   },
  { id: 9,  name: "Karan Gupta",    email: "karan@example.in",   region: "Haryana",      totalOrders: 6,  totalSpend: "₹19,400",  status: "active"   },
  { id: 10, name: "Divya Iyer",     email: "divya@example.in",   region: "Tamil Nadu",   totalOrders: 9,  totalSpend: "₹34,700",  status: "active"   },
];

/**
 * GET /api/customers  (protected)  ?page=1&limit=10
 */
const getCustomers = async (req, res, next) => {
  try {
    const page  = parseInt(req.query.page  || "1",  10);
    const limit = parseInt(req.query.limit || "10", 10);
    const start = (page - 1) * limit;
    const end   = start + limit;

    const paginated = MOCK_CUSTOMERS.slice(start, end);

    res.status(200).json({
      customers: paginated,
      pagination: {
        page,
        limit,
        total:      MOCK_CUSTOMERS.length,
        totalPages: Math.ceil(MOCK_CUSTOMERS.length / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/customers/stats  (protected)
 */
const getCustomerStats = async (req, res, next) => {
  try {
    const stats = {
      totalCustomers:      1152,
      activeCustomers:     987,
      inactiveCustomers:   165,
      returningCustomers:  738,   // ~64 % of total
      newThisMonth:        84,
      averageOrderValue:   "₹3,820",
      topCustomerRegion:   "Punjab",
    };

    res.status(200).json({ stats });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/customers/:id  (protected)
 */
const getCustomerById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === id);

    if (!customer) {
      const err = new Error(`Customer with id ${id} not found.`);
      err.status = 404;
      return next(err);
    }

    res.status(200).json({ customer });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCustomers, getCustomerStats, getCustomerById };
