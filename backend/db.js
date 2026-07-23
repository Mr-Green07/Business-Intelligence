const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'businessiq.db');

// Delete existing DB for clean initialization if needed
// if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new sqlite3.Database(dbPath);
db.configure("busyTimeout", 10000);

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

const initializeDatabase = async () => {
  console.log('Initializing database at:', dbPath);

  // 1. Users table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT CHECK(role IN ('Admin', 'Analyst', 'Viewer')) DEFAULT 'Viewer',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Sales Data table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS sales_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL, -- YYYY-MM-DD
      state TEXT NOT NULL,
      category TEXT CHECK(category IN ('Electronics', 'Furniture', 'Clothing')) NOT NULL,
      product_name TEXT NOT NULL,
      revenue REAL NOT NULL, -- in INR (Lakhs)
      orders INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    )
  `);

  // 3. Customers table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      state TEXT NOT NULL,
      segment TEXT CHECK(segment IN ('New', 'Returning')) NOT NULL,
      clv REAL NOT NULL, -- Customer Lifetime Value in INR
      retention_status TEXT CHECK(retention_status IN ('Active', 'Inactive')) DEFAULT 'Active',
      acquisition_date TEXT NOT NULL -- YYYY-MM-DD
    )
  `);

  // 4. Insights table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS insights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state TEXT DEFAULT 'all', -- 'all' or specific state
      type TEXT CHECK(type IN ('success', 'warning', 'info')) NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Recommendations table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS recommendations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state TEXT DEFAULT 'all', -- 'all' or specific state
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      impact TEXT CHECK(impact IN ('High', 'Medium', 'Low')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Uploads table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      status TEXT CHECK(status IN ('Completed', 'Failed', 'Processing')) DEFAULT 'Processing',
      record_count INTEGER DEFAULT 0,
      error_message TEXT,
      uploaded_by TEXT NOT NULL,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 7. Notifications table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK(type IN ('alert', 'milestone', 'system')) DEFAULT 'system',
      is_read INTEGER DEFAULT 0, -- 0 = unread, 1 = read
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 8. Settings table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS settings (
      user_id INTEGER PRIMARY KEY,
      theme TEXT DEFAULT 'light',
      email_alerts INTEGER DEFAULT 1,
      auto_insight_generation INTEGER DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 9. User Activity table
  await runQuery(`
    CREATE TABLE IF NOT EXISTS user_activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Seed default users if empty
  const userCount = await getQuery('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('Seeding default users...');
    // In production, use bcryptjs. Here we store simple passwords for ease of login in this demo,
    // but we can support plain-text matching or standard bcrypt. We will use plain-text or clean helper for simple demo.
    await runQuery(`
      INSERT INTO users (email, password, name, role, avatar) VALUES
      ('admin@businessiq.com', 'admin123', 'Simran Yadav', 'Admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran'),
      ('analyst@businessiq.com', 'analyst123', 'Aarav Sharma', 'Analyst', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav'),
      ('viewer@businessiq.com', 'viewer123', 'Rahul Verma', 'Viewer', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul')
    `);
    
    // Seed default settings for user 1
    await runQuery(`INSERT INTO settings (user_id, theme, email_alerts, auto_insight_generation) VALUES (1, 'light', 1, 1)`);
    await runQuery(`INSERT INTO settings (user_id, theme, email_alerts, auto_insight_generation) VALUES (2, 'light', 1, 1)`);
    await runQuery(`INSERT INTO settings (user_id, theme, email_alerts, auto_insight_generation) VALUES (3, 'light', 0, 0)`);
  }

  // Seed Sales Data if empty
  const salesCount = await getQuery('SELECT COUNT(*) as count FROM sales_data');
  if (salesCount.count === 0) {
    console.log('Seeding sales data (this might take a few seconds)...');
    
    const states = [
      'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh',
      'Delhi', 'West Bengal', 'Rajasthan', 'Punjab', 'Haryana',
      'Telangana', 'Kerala', 'Andhra Pradesh'
    ];

    const categories = {
      'Electronics': [
        { name: 'Smartphones Pro X', price: 45000 },
        { name: 'UltraSlim Laptop 15', price: 65000 },
        { name: 'Noise Cancelling Headphones', price: 12000 },
        { name: 'Smart Watch Series 5', price: 8000 },
        { name: '4K Smart LED TV', price: 35000 }
      ],
      'Furniture': [
        { name: 'Ergonomic Office Chair', price: 15000 },
        { name: 'Solid Wood Dining Table', price: 28000 },
        { name: 'Modern Velvet Sofa', price: 42000 },
        { name: 'Modular Bookshelf', price: 9000 },
        { name: 'King Size Bed Frame', price: 25000 }
      ],
      'Clothing': [
        { name: 'Premium Cotton Shirt', price: 1800 },
        { name: 'Slim Fit Denim Jeans', price: 2500 },
        { name: 'Designer Summer Dress', price: 3200 },
        { name: 'Athletic Performance Shoes', price: 4500 },
        { name: 'Warm Winter Bomber Jacket', price: 3800 }
      ]
    };

    // We will generate data over the past 12 months: Aug 2025 to Jul 2026
    const months = [
      '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
      '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'
    ];

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      
      const insertStmt = db.prepare(`
        INSERT INTO sales_data (date, state, category, product_name, revenue, orders, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      for (const month of months) {
        // Base seasonal multiplier
        let seasonalMultiplier = 1.0;
        if (month === '2025-10' || month === '2025-11') seasonalMultiplier = 1.4; // Diwali festival season
        if (month === '2025-12') seasonalMultiplier = 1.25; // End of year sales
        if (month === '2026-03') seasonalMultiplier = 0.9; // Financial year end closing slowdown
        if (month === '2026-05') seasonalMultiplier = 1.15; // Summer sales

        for (const state of states) {
          // State weight
          let stateWeight = 1.0;
          if (state === 'Maharashtra') stateWeight = 2.2;
          else if (state === 'Karnataka') stateWeight = 1.8;
          else if (state === 'Tamil Nadu') stateWeight = 1.6;
          else if (state === 'Delhi') stateWeight = 1.5;
          else if (state === 'Gujarat') stateWeight = 1.4;
          else if (state === 'Uttar Pradesh') stateWeight = 1.3;
          else if (state === 'West Bengal') stateWeight = 1.1;
          else if (state === 'Telangana') stateWeight = 1.2;
          else if (state === 'Kerala') stateWeight = 1.0;
          else if (state === 'Andhra Pradesh') stateWeight = 0.9;
          else if (state === 'Punjab') stateWeight = 0.8;
          else if (state === 'Haryana') stateWeight = 0.8;
          else if (state === 'Rajasthan') stateWeight = 0.7;

          // Generate multiple transactions per state per month
          for (const category of Object.keys(categories)) {
            const products = categories[category];
            
            // Generate 1-3 transactions per category
            const txCount = Math.floor(Math.random() * 2) + 1;
            
            for (let i = 0; i < txCount; i++) {
              const product = products[Math.floor(Math.random() * products.length)];
              
              // Calculate randomized orders and quantity
              const baseQty = Math.floor(Math.random() * 30) + 10;
              const quantity = Math.floor(baseQty * stateWeight * seasonalMultiplier);
              const orders = Math.floor(quantity * (0.6 + Math.random() * 0.3)); // some orders have multi-quantity
              
              // Revenue in Lakhs (INR 1 Lakh = 100,000 INR)
              const rawRevenue = quantity * product.price;
              const revenueLakhs = Math.round((rawRevenue / 100000) * 100) / 100;
              
              // Date in month
              const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
              const dateStr = `${month}-${day}`;

              insertStmt.run(dateStr, state, category, product.name, revenueLakhs, orders, quantity);
            }
          }
        }
      }
      
      insertStmt.finalize();
      db.run('COMMIT');
      console.log('Sales data seeded successfully!');
    });
  }

  // Seed Customers if empty
  const customerCount = await getQuery('SELECT COUNT(*) as count FROM customers');
  if (customerCount.count === 0) {
    console.log('Seeding customer database...');
    const firstNames = ['Amit', 'Rajesh', 'Priya', 'Anjali', 'Sanjay', 'Sunita', 'Vikram', 'Neha', 'Rohan', 'Sneha', 'Deepak', 'Karan', 'Pooja', 'Arjun', 'Meera', 'Vijay', 'Jyoti', 'Kiran', 'Abhishek', 'Ritu'];
    const lastNames = ['Sharma', 'Patel', 'Verma', 'Gupta', 'Singh', 'Reddy', 'Nair', 'Mehta', 'Joshi', 'Chawla', 'Rao', 'Das', 'Kumar', 'Mishra', 'Choudhury', 'Sen', 'Banerjee', 'Gill', 'Yadav', 'Malhotra'];
    const states = [
      'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh',
      'Delhi', 'West Bengal', 'Rajasthan', 'Punjab', 'Haryana',
      'Telangana', 'Kerala', 'Andhra Pradesh'
    ];

    db.serialize(() => {
      db.run('BEGIN TRANSACTION');
      const insertCust = db.prepare(`
        INSERT INTO customers (name, email, state, segment, clv, retention_status, acquisition_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const totalCustomers = 150;
      const emailsUsed = new Set();

      for (let i = 0; i < totalCustomers; i++) {
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${fname} ${lname}`;
        
        let email = `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`;
        let counter = 1;
        while (emailsUsed.has(email)) {
          email = `${fname.toLowerCase()}.${lname.toLowerCase()}${counter}@example.com`;
          counter++;
        }
        emailsUsed.add(email);

        const state = states[Math.floor(Math.random() * states.length)];
        const segment = Math.random() > 0.35 ? 'Returning' : 'New';
        
        // Customer lifetime value in INR
        const clv = segment === 'Returning' 
          ? Math.floor(50000 + Math.random() * 250000) 
          : Math.floor(5000 + Math.random() * 45000);

        const retention_status = Math.random() > 0.15 ? 'Active' : 'Inactive';
        
        // Acquisition date over the last year
        const year = Math.random() > 0.4 ? '2025' : '2026';
        const monthNum = Math.floor(Math.random() * 12) + 1;
        const month = String(monthNum).padStart(2, '0');
        const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const acquisition_date = `${year}-${month}-${day}`;

        insertCust.run(name, email, state, segment, clv, retention_status, acquisition_date);
      }

      insertCust.finalize();
      db.run('COMMIT');
      console.log('Customer data seeded successfully!');
    });
  }

  // Seed Insights if empty
  const insightsCount = await getQuery('SELECT COUNT(*) as count FROM insights');
  if (insightsCount.count === 0) {
    console.log('Seeding default business insights...');
    await runQuery(`
      INSERT INTO insights (state, type, title, description) VALUES
      ('all', 'success', 'Festival Season Revenue Surge', 'Diwali sales in October & November saw a 40% MoM surge in Electronics & Clothing. West Bengal and Maharashtra led the growth chart.'),
      ('all', 'warning', 'High Logistics Costs in Rajasthan', 'Delivery expenses in Rajasthan have risen by 12% due to route inefficiencies. Recommending shifting to localized warehouse hubs in Jaipur.'),
      ('all', 'info', 'New Customer Retention Trend', 'Returning customers now make up 68% of overall revenue, marking a 5% increase from last quarter due to the loyalty program rewards.'),
      ('Maharashtra', 'success', 'Regional Leadership Confirmed', 'Maharashtra remains the top revenue contributor, accounting for over 22% of total sales, with Electronics being the primary driver.'),
      ('Karnataka', 'info', 'Furniture Demand Expansion', 'Solid Wood Dining Tables and Ergonomic Chairs are experiencing an 18% increase in Bangalore sales, driven by remote tech workers.'),
      ('Delhi', 'warning', 'Slight Clothing Slowdown', 'Premium Cotton Shirt sales fell 8% in Delhi during January due to intense competitive local discounting.')
    `);
  }

  // Seed Recommendations if empty
  const recsCount = await getQuery('SELECT COUNT(*) as count FROM recommendations');
  if (recsCount.count === 0) {
    console.log('Seeding default business recommendations...');
    await runQuery(`
      INSERT INTO recommendations (state, title, description, impact) VALUES
      ('all', 'Optimize Inventory for South Zone', 'In anticipation of the upcoming Pongal and Onam seasons, increase regional inventory of Electronics by 25% in warehouses located in Chennai and Kochi.', 'High'),
      ('all', 'Launch Loyalty Phase II in West Zone', 'Introduce Tiered VIP Benefits (Silver, Gold, Platinum) for Maharashtra and Gujarat customer segments to capitalize on high retention ratios.', 'High'),
      ('all', 'Review Logistics Providers in Rajasthan', 'Audit Rajasthan local carriers and negotiate flat-rate terms or transition to a hyper-local fulfillment model in Jaipur/Jodhpur.', 'Medium'),
      ('Delhi', 'Introduce Festive Bundling Promo', 'Bundle Premium Cotton Shirts with Denim Jeans at a promotional 15% discount to counter competitor promotions in Delhi-NCR stores.', 'Medium'),
      ('Uttar Pradesh', 'Expand Tier-2 & Tier-3 Outreach', 'Allocate 15% more marketing budget to influencer campaigns targeting Lucknow, Kanpur, and Varanasi for affordable Clothing ranges.', 'Medium')
    `);
  }

  // Seed Notifications if empty
  const notifCount = await getQuery('SELECT COUNT(*) as count FROM notifications');
  if (notifCount.count === 0) {
    console.log('Seeding default notifications...');
    await runQuery(`
      INSERT INTO notifications (title, message, type) VALUES
      ('Monthly Sales Target Achieved!', 'Congratulations! The overall revenue for June 2026 crossed the target milestone of ₹450 Lakhs.', 'milestone'),
      ('Anomaly Detected: Rajasthan Logistics Cost', 'Rajasthan shipping expenses rose by 12.4% last month. Please check warehouse logs.', 'alert'),
      ('Database Backed Up Successfully', 'The daily system backup process finished successfully without any warnings.', 'system')
    `);
  }

  console.log('Database initialization complete!');
};

module.exports = {
  db,
  initializeDatabase,
  runQuery,
  getQuery,
  allQuery
};
