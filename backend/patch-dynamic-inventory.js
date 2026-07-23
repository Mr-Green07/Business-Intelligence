const fs = require('fs');
const path = require('path');

// 1. Patch db.js to remove category CHECK constraint
const dbPath = path.join(__dirname, 'db.js');
if (fs.existsSync(dbPath)) {
  let dbContent = fs.readFileSync(dbPath, 'utf8');
  
  // Replace SQL check constraint on category inside sales_data CREATE TABLE
  dbContent = dbContent.replace(
    /category TEXT CHECK\(category IN \('Electronics', 'Furniture', 'Clothing'\)\) NOT NULL,/g,
    "category TEXT NOT NULL,"
  );
  
  fs.writeFileSync(dbPath, dbContent, 'utf8');
  console.log('Successfully patched db.js CHECK constraint');
} else {
  console.error('db.js not found at:', dbPath);
}

// 2. Patch server.js to:
// - Remove validCategories validation check in /api/upload
// - Add /api/sales/filters endpoint
const serverPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverPath)) {
  let serverContent = fs.readFileSync(serverPath, 'utf8');
  
  // Add /api/sales/filters endpoint right before Sales Service Endpoints
  const filtersEndpoint = `// ==========================================
// Sales Options Filters Endpoint (Dynamic Category and Product listing)
// ==========================================
app.get('/api/sales/filters', authenticateToken, async (req, res) => {
  try {
    const categories = await allQuery('SELECT DISTINCT category FROM sales_data ORDER BY category ASC');
    const states = await allQuery('SELECT DISTINCT state FROM sales_data ORDER BY state ASC');
    const products = await allQuery('SELECT DISTINCT product_name FROM sales_data ORDER BY product_name ASC');
    res.json({
      categories: categories.map(c => c.category),
      states: states.map(s => s.state),
      products: products.map(p => p.product_name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

`;

  if (!serverContent.includes('/api/sales/filters')) {
    serverContent = serverContent.replace(
      /\/\/ ==========================================\n\/\/ 3\. Sales Service Endpoints\n\/\/ ==========================================/g,
      filtersEndpoint + '// ==========================================\n// 3. Sales Service Endpoints\n// =========================================='
    );

    // Remove validCategories definition and validation in /api/upload
    serverContent = serverContent.replace(
      /const validCategories = \['Electronics', 'Furniture', 'Clothing'\];/g,
      ""
    );

    serverContent = serverContent.replace(
      /if \(!category \|\| !validCategories\.includes\(category\)\) \{[^}]*\}/g,
      `if (!category || category.trim().length === 0) {
              throw new Error(\`Row \${lineIndex + 1}: Category string is empty or invalid.\`);
            }`
    );

    fs.writeFileSync(serverPath, serverContent, 'utf8');
    console.log('Successfully patched server.js upload check and filters api');
  } else {
    console.log('server.js already contains filters API, skipping...');
  }
} else {
  console.error('server.js not found at:', serverPath);
}

// 3. Patch SalesSummary.jsx to dynamically fetch category filters
const salesSummaryPath = path.join(__dirname, 'src', 'pages', 'SalesSummary.jsx');
if (fs.existsSync(salesSummaryPath)) {
  let summaryContent = fs.readFileSync(salesSummaryPath, 'utf8');

  if (!summaryContent.includes('categoriesList, setCategoriesList')) {
    // Add state for dynamic lists
    const stateInjections = `  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loadingTable, setLoadingTable] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  // Dynamic filter lists loaded from database
  const [statesList, setStatesList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);`;

    summaryContent = summaryContent.replace(
      /const \[sales, setSales\] = useState\(\[\]\);\s*const \[totalSales, setTotalSales\] = useState\(0\);\s*const \[loadingTable, setLoadingTable\] = useState\(true\);\s*const \[limit\] = useState\(10\);\s*const \[offset, setOffset\] = useState\(0\);/g,
      stateInjections
    );

    // Strip hardcoded statesList and categoriesList definitions
    summaryContent = summaryContent.replace(
      /const statesList = \[[^\]]*\];/g,
      ""
    );
    summaryContent = summaryContent.replace(
      /const categoriesList = \[[^\]]*\];/g,
      ""
    );

    // Fetch filter options on load inside useEffect
    const fetchFiltersEffect = `  // Fetch filter dropdown options dynamically from database
  useEffect(() => {
    fetch('/api/sales/filters', {
      headers: { Authorization: \`Bearer \${token}\` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStatesList(data.states || []);
          setCategoriesList(data.categories || []);
        }
      })
      .catch(err => console.error('Error fetching filter lists:', err));
  }, [token]);`;

    // Place the fetchFiltersEffect inside the file right before the fetchSalesRecords call
    summaryContent = summaryContent.replace(
      /\/\/ Fetch sales records/g,
      fetchFiltersEffect + '\n\n  // Fetch sales records'
    );

    fs.writeFileSync(salesSummaryPath, summaryContent, 'utf8');
    console.log('Successfully patched SalesSummary.jsx for dynamic category list');
  } else {
    console.log('SalesSummary.jsx is already dynamic, skipping...');
  }
} else {
  console.error('SalesSummary.jsx not found at:', salesSummaryPath);
}

// 4. Patch Customers.jsx to dynamically fetch states filter list
const customersPath = path.join(__dirname, 'src', 'pages', 'Customers.jsx');
if (fs.existsSync(customersPath)) {
  let customersContent = fs.readFileSync(customersPath, 'utf8');

  if (!customersContent.includes('statesList, setStatesList')) {
    // Strip hardcoded statesList
    customersContent = customersContent.replace(
      /const statesList = \[[^\]]*\];/g,
      ""
    );

    // Inject statesList state
    const stateListInjection = `  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loadingList, setLoadingTable] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [statesList, setStatesList] = useState([]);`;

    customersContent = customersContent.replace(
      /const \[customers, setCustomers\] = useState\(\[\]\);\s*const \[totalCustomers, setTotalCustomers\] = useState\(0\);\s*const \[loadingList, setLoadingTable\] = useState\(true\);\s*const \[limit\] = useState\(10\);\s*const \[offset, setOffset\] = useState\(0\);/g,
      stateListInjection
    );

    // Load state listings dynamically on mount
    const fetchCustomersStates = `  // Fetch filter dropdown options dynamically from database
  useEffect(() => {
    fetch('/api/sales/filters', {
      headers: { Authorization: \`Bearer \${token}\` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStatesList(data.states || []);
        }
      })
      .catch(err => console.error('Error fetching customer states list:', err));
  }, [token]);`;

    customersContent = customersContent.replace(
      /\/\/ Fetch list/g,
      fetchCustomersStates + '\n\n  // Fetch list'
    );

    fs.writeFileSync(customersPath, customersContent, 'utf8');
    console.log('Successfully patched Customers.jsx for dynamic states list');
  } else {
    console.log('Customers.jsx is already dynamic, skipping...');
  }
} else {
  console.error('Customers.jsx not found at:', customersPath);
}

console.log('\nAll patches successfully checked and integrated!');
