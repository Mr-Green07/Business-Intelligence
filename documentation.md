# DecisionPilot — Full-Stack BI Enterprise Dashboard
## Comprehensive Academic and Technical Documentation
*Prepared for Academic Defense, Technical Review, and Interview Preparation*

---

## 1. Executive Summary & Project Overview

### 1.1 Overview
**DecisionPilot** (BusinessIQ) is an enterprise-grade Business Intelligence (BI) dashboard designed to capture, process, aggregate, and visualize high-volume sales transactions, customer retention profiles, and regional analytics across **all 28 Indian States and 8 Union Territories (36 regions)**.

Unlike traditional static dashboards, DecisionPilot is a **fully working, integrated full-stack web application**. It features:
1. An embedded, relational transactional database (**SQLite3**).
2. A high-performance REST API and real-time alert broadcasting system (**Node.js, Express, and WebSockets**).
3. A highly interactive, responsive visual interface (**React 19, Vite, Recharts, and Tailwind CSS v3**).
4. An integrated **Analytical Prescriptive Engine** that dynamically parses database rows to generate actionable business alerts and operational instructions.

---

## 2. Full-Stack System Architecture

The project has been refactored from a multi-directory layout into a **unified, integrated single-project flat structure** inside `/BusinessIQ`. This structure resolves CORS challenges, simplifies deployment to a single port (`5000`), and simplifies the development lifecycle.

```
BusinessIQ/
├── package.json               # Monorepo dependencies & start-up orchestrations
├── server.js                  # Express API Server & WebSockets Server
├── db.js                      # Relational SQLite initialization & seeding logic
├── businessiq.db              # Active SQLite database file
├── index.html                 # Single Page Application entry point
├── vite.config.js             # Bundler, compiler proxies & dev server settings
├── tailwind.config.js         # Utility-first styling framework definitions
├── postcss.config.js          # Autoprefixer & CSS compiler setups
├── sample_sales_upload.csv    # Pre-formatted sample dataset for testing uploads
└── src/                       # Frontend SPA source code
    ├── main.jsx               # React virtual DOM bootstrap
    ├── App.jsx                # Global Auth, WS connections, dark theme, and routes
    ├── index.css              # Global styles & 36 custom state path colors
    ├── pages/                 # Full Page Containers (Dashboard, SalesSummary, Regions, etc.)
    └── components/            # Reusable UI Widgets (Navbar, Sidebar, Charts)
```

---

## 3. Tech Stack: Libraries, Use Cases, and Alternatives

This section details the libraries chosen for DecisionPilot, their exact use cases in the application, and the alternatives that would be discussed in a technical interview or thesis defense.

### 3.1 Database Layer

#### SQLite3 (`sqlite3` Node Driver)
* **Use Case in Project**: Stores the complete relational schema (`users`, `sales_data`, `customers`, `insights`, `recommendations`, `uploads`, `notifications`, `settings`, `user_activity`) inside a single local file (`businessiq.db`). Handles complex queries, aggregates, and transactions synchronously.
* **Why Chosen**: Lightweight, serverless, requires zero configuration, has native SQL query support, and is extremely fast for read-heavy operations typical of local BI analytics.
* **Alternatives & Trade-offs**:
  * **PostgreSQL**:
    * *Pros*: Highly scalable, handles heavy write concurrency, robust support for custom data types and analytical window functions.
    * *Cons*: Requires separate server processes, configurations, and connection pools, adding complexity to simple appliances.
  * **MongoDB (NoSQL Document Store)**:
    * *Pros*: High flexibility for semi-structured data, schema-less design, easy scaling.
    * *Cons*: Bad for high-integrity transactional relationships and mathematical aggregations (e.g., sum, averages, and group-by) compared to clean SQL queries.

---

### 3.2 Backend Service Layer

#### Express.js (`express` v4)
* **Use Case in Project**: Acts as the REST API routing hub. Serving user authentication, paginated sales records, dynamic filters, region drill-downs, and audit logs. Also hosts the compiled React assets statically.
* **Why Chosen**: Minimalist, unopinionated, extremely fast, has massive middleware ecosystems (CORS, body parser, multer), and is easy to maintain.
* **Alternatives & Trade-offs**:
  * **NestJS**:
    * *Pros*: Strongly typed (TypeScript native), highly structured architecture (MVC, Dependency Injection), perfect for massive enterprise teams.
    * *Cons*: Steep learning curve, heavy boilerplates, overkill for single-app microservices.
  * **Fastify**:
    * *Pros*: Extremely high throughput, native JSON schema validations, faster than Express.
    * *Cons*: Smaller ecosystem, fewer community plug-ins than Express.
  * **FastAPI (Python)**:
    * *Pros*: Outstanding speed, automatic interactive documentation (OpenAPI), native integration with Python ML/AI libraries.
    * *Cons*: Shifts the tech stack from JavaScript/Node, requiring separate runtime setups in Node-focused infrastructures.

#### WebSockets (`ws` library)
* **Use Case in Project**: Establish a persistent, bi-directional connection (`ws://localhost:5000/ws/notifications`) between the client browser and the server. Used to push instant milestone and failure notifications to the screen during background processes (such as CSV file uploads or insights generation).
* **Why Chosen**: Pure-JS, highly lightweight WebSocket driver with minimal overhead and solid raw socket events handling.
* **Alternatives & Trade-offs**:
  * **Socket.io**:
    * *Pros*: Automatic fallback to HTTP long-polling if WebSockets are blocked, built-in reconnection logic, and namespace support.
    * *Cons*: Slightly heavier client-server handshake, requires using Socket.io proprietary clients instead of native browser `WebSocket` APIs.
  * **Server-Sent Events (SSE)**:
    * *Pros*: Native HTTP protocol (no protocol upgrade), simple unidirectional server-to-client push, automatic reconnects.
    * *Cons*: Unidirectional only (cannot send messages back from client on the same channel), and has lower concurrent connection limits under HTTP/1.1.

---

### 3.3 Frontend Layer

#### React 19 (`react` & `react-dom`)
* **Use Case in Project**: Powers the Single Page Application (SPA). Organizes views into modular component nodes, manages states (such as active state maps, filter queries, lists), and handles contexts (`AuthContext`, `AppContext`).
* **Why Chosen**: Declarative component-driven model, virtual DOM rendering speeds, and industry-wide dominance for BI applications.
* **Alternatives & Trade-offs**:
  * **Vue.js**:
    * *Pros*: Simpler single-file templates, flatter learning curve, highly reactive out-of-the-box.
    * *Cons*: Smaller ecosystem for specialized analytics charting than React.
  * **Svelte**:
    * *Pros*: No virtual DOM overhead (compiles directly to vanilla JS at build time), smaller bundle sizes, lightning-fast reactivity.
    * *Cons*: Smaller enterprise adoption, fewer pre-built library adapters.

#### Recharts (`recharts` v2)
* **Use Case in Project**: Renders the core analytics visual charts. This includes the gradient monthly revenue trend Area Chart, the product category share Pie Chart, the fulfillment funnel doughnut, and the vertical bar chart inside the state analytics drill-down.
* **Why Chosen**: Built specifically as native React components, fully declarative, easily styleable with Tailwind, responsive out-of-the-box, and uses SVG rendering.
* **Alternatives & Trade-offs**:
  * **Chart.js (via react-chartjs-2)**:
    * *Pros*: Canvas-based (highly performant for thousands of data coordinates), lightweight.
    * *Cons*: Not native to React (uses a wrapper around a 2D canvas context), harder to make responsive and style with Tailwind.
  * **D3.js**:
    * *Pros*: The gold standard for data visualization. Infinite flexibility, can draw any custom geometry or layout imaginable.
    * *Cons*: Extremely steep learning curve, manual DOM manipulation that directly conflicts with React's Virtual DOM rendering principles.

---

## 4. Key Functions Written and Code Walkthrough

This section conducts a deep dive into the critical functions written for this project, highlighting their use cases, design patterns, and why they prevent common full-stack bugs.

### 4.1 Server-Side Fuzzy State Name Normalizer (`server.js`)

```javascript
function normalizeStateName(stateStr) {
  if (!stateStr) return '';
  const clean = stateStr.trim().replace(/\s+/g, ' ').toLowerCase();

  const variations = {
    'jammu & kashmir': 'Jammu and Kashmir',
    'jammu and kashmir': 'Jammu and Kashmir',
    'j&k': 'Jammu and Kashmir',
    'j and k': 'Jammu and Kashmir',
    'jk': 'Jammu and Kashmir',
    
    'andaman & nicobar': 'Andaman and Nicobar',
    'andaman and nicobar': 'Andaman and Nicobar',
    'andaman & nicobar islands': 'Andaman and Nicobar',
    'andaman and nicobar islands': 'Andaman and Nicobar',
    'andaman nicobar': 'Andaman and Nicobar',
    
    'dadra & nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra and nagar haveli': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra and nagar haveli and daman and diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra & nagar haveli and daman & diu': 'Dadra and Nagar Haveli and Daman and Diu',

    'delhi ncr': 'Delhi',
    'ncr': 'Delhi',
    'odisha': 'Odisha',
    'orissa': 'Odisha',
    'pondicherry': 'Puducherry',
    'puducherry': 'Puducherry'
  };

  if (variations[clean]) {
    return variations[clean];
  }

  const validStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar',
    'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const matched = validStates.find(s => s.toLowerCase() === clean);
  if (matched) return matched;

  // Substring fuzzy fallbacks
  if (clean.includes('kashmir') || clean.includes('jammu')) return 'Jammu and Kashmir';
  if (clean.includes('bengal')) return 'West Bengal';
  if (clean.includes('tamilnadu') || clean.includes('tamil nadu')) return 'Tamil Nadu';
  if (clean.includes('andhra')) return 'Andhra Pradesh';
  if (clean.includes('arunachal')) return 'Arunachal Pradesh';
  if (clean.includes('himachal')) return 'Himachal Pradesh';
  if (clean.includes('madhya')) return 'Madhya Pradesh';
  if (clean.includes('chhattisgarh') || clean.includes('chatisgarh')) return 'Chhattisgarh';

  return null;
}
```
* **Use Case**: Cleanses, standardizes, and normalizes state name inputs during bulk CSV uploads.
* **Why it matters**: In real-world BI tools, different systems output different punctuation for the same state (e.g., `Jammu & Kashmir` vs. `Jammu and Kashmir` vs. `J&K`). Without this function, any slight string mismatch would violate our integrity checks and trigger a database reject, crashing the batch transaction.
* **Interview Point**: This is a classic example of **defensive programming**. Instead of forcing users to strictly sanitize their CSV formatting manually, the backend absorbs the variation gracefully, improving User Experience (UX) and transaction success ratios.

---

### 4.2 Bulletproof Transactional CSV Parser & Statement finalizer (`server.js`)

```javascript
app.post('/api/upload', authenticateToken, upload.single('file'), async (req, res) => {
  // ... check file exists and record upload job as 'Processing' inside uploads table ...

  fs.readFile(filePath, 'utf8', async (err, data) => {
    try {
      const lines = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      // ... parse headers and map indexes ...

      await runQuery('BEGIN TRANSACTION');

      const stmt = db.prepare(`
        INSERT INTO sales_data (date, state, category, product_name, revenue, orders, quantity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      try {
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i].split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
          if (row.length < requiredHeaders.length) continue;

          // ... extract fields ...
          const state = normalizeStateName(rawState);

          // ... strict validations ...
          if (!state) throw new Error(`Row ${i + 1}: State "${rawState}" is invalid.`);
          if (isNaN(revenue) || revenue <= 0) throw new Error(`Row ${i + 1}: Revenue must be positive.`);

          // Synchronous await to prevent race-conditions and locks in SQLite
          await new Promise((resolve, reject) => {
            stmt.run([date, state, category, product_name, revenue, orders, quantity], function(runErr) {
              if (runErr) reject(runErr);
              else resolve();
            });
          });
          successCount++;
        }

        await runQuery('COMMIT');
      } catch (loopErr) {
        await runQuery('ROLLBACK'); // Roll back on any row error to guarantee consistency
        throw loopErr;
      } finally {
        stmt.finalize(); // ALWAYS finalize to release SQLite read/write lock!
      }

      // ... Update upload record to 'Completed', and trigger success WebSockets notification ...

    } catch (parseErr) {
      // ... Update upload record to 'Failed' with parseErr.message, trigger failure notification ...
    }
  });
});
```
* **Use Case**: Handles bulk uploads of CSV data.
* **Why it matters**: 
  1. **Awaiting Async Operations**: Because `stmt.run()` is asynchronous, executing it inside a standard loop without `await` would cause Node to call `COMMIT` immediately while SQLite is still writing. This leads to database lockups and corrupted states. Wrapping each `run` in a Promise solves this.
  2. **Preventing SQL Leaks via `finally`**: If a single row is invalid, it throws a validation error. If `stmt.finalize()` is not enclosed in a `finally` block, the prepared statement is left dangling in memory, locking the database and blocking all future queries with a `SQLITE_BUSY` error.
* **Interview Point**: Emphasizes mastery over **ACID properties (Atomicity, Consistency, Isolation, Durability)**. The batch is treated as a single atomic transaction: either every row is successfully imported, or the entire file is rejected, keeping the analytical ledger perfectly clean.

---

### 4.3 Prescriptive BI Insights Engine (`server.js`)

```javascript
app.post('/api/insights/generate', authenticateToken, async (req, res) => {
  try {
    // 1. Audit category distribution concentration ratios
    const catStats = await allQuery('SELECT category, SUM(revenue) as rev FROM sales_data GROUP BY category');
    const totalRevRow = await getQuery('SELECT SUM(revenue) as total_rev FROM sales_data');
    const totalRev = totalRevRow.total_rev;

    // 2. Identify the lowest-performing state to design mitigation promos
    const stateRevs = await allQuery('SELECT state, SUM(revenue) as rev, SUM(orders) as orders FROM sales_data GROUP BY state ORDER BY rev ASC');
    const lowestState = stateRevs[0];

    const generatedInsights = [];

    // Analyze high dependency on a single category
    if (catStats && catStats.length > 0) {
      const topCat = catStats.reduce((max, c) => c.rev > max.rev ? c : max, catStats[0]);
      const pct = Math.round((topCat.rev / totalRev) * 100);
      
      if (pct > 40) {
        const title = `High Category Dependency: ${topCat.category}`;
        const desc = `${topCat.category} dominates the portfolio at ${pct}% of overall revenue. Concentration carries structural inventory risks.`;
        
        // Save to DB as an active insight
        await runQuery('INSERT INTO insights (state, type, title, description) VALUES (?, ?, ?, ?)', ['all', 'info', title, desc]);
      }
    }
    // ... write actions to DB and broadcast via WebSockets ...
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```
* **Use Case**: Runs heuristics on raw transaction records to extract business insights and strategic actions.
* **Why it matters**: This converts a simple descriptive dashboard (which only shows *what happened*) into a **prescriptive BI tool** (which advises *what to do*), adding high business value.

---

### 4.4 Rules of Hooks & Early Return Bug Resolution (`App.jsx`)

#### The Problem:
Previously, the sidebar collapsible state was declared *after* the early-return auth statement:
```javascript
// ❌ CRASH: Violates React's Rules of Hooks
export default function App() {
  const [token, setToken] = useState('');

  if (!token) {
    return <LoginScreen />; // App returns early if not authenticated
  }

  const [sidebarOpen, setSidebarOpen] = useState(true); // Hook called conditionally!
  return <Layout />
}
```
* **Why it crashed (Minified React Error #310)**: On initial load, the user is logged out, so the component returns early (6 hooks are called). After typing credentials and logging in, `token` changes to a string, the early return is skipped, and React suddenly executes `useState(true)` for the first time. React notices that the number of hooks and their call order changed between renders, throwing a fatal crash.

#### The Fix:
I moved all hooks (including `sidebarOpen`) to the very top of `App.jsx`, preceding any early returns, and decoupled `LoginScreen` into a separate, parent-scoped functional component.
```javascript
// ✅ CORRECT: Hooks called unconditionally on every render!
export default function App() {
  const [token, setToken] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Moved to the top!

  if (!token) {
    return <LoginScreen login={login} />;
  }
  return <Layout />
}
```
* **Interview Point**: Demonstrates a deep understanding of React's fiber architecture and rendering loop. React relies on the call order of hooks to link state values across re-renders. Changing hook order breaks state links.

---

## 5. Lecturer & Interview Preparation: Core Q&A

These ten questions represent critical topics a lecturer or a senior software architect would raise during a project defense or system review.

### Q1: Why did you choose SQLite instead of an in-memory JSON array or local files?
* **Answer**: Storing state inside in-memory arrays causes data to vanish every time the server restarts or crashes. Using flat JSON files creates write-concurrency collisions and lacks database schema indexes. SQLite provides a lightweight, transactional (ACID), SQL-compliant relational model stored in a single local file. This enables complex query joins and aggregations directly in database memory while persisting data safely.

### Q2: Explain why wrapping asynchronous SQLite queries inside a standard `for` loop causes database locks, and how you solved it.
* **Answer**: Node's `sqlite3` driver executes `stmt.run()` asynchronously. In a standard loop, Node executes these operations concurrently in the background. If the loop ends and immediately calls `COMMIT` or `stmt.finalize()`, those actions fire while background inserts are still active, resulting in a database collision and throwing `SQLITE_BUSY` errors. I solved this by wrapping `stmt.run` in a Promise and using `await` inside the loop, forcing Node to wait for each database write to complete sequentially before moving to the next row or committing.

### Q3: Why is the `finally` block with `stmt.finalize()` critical in the file upload endpoint?
* **Answer**: If a validation error is thrown while parsing rows (such as an incorrect date format or an invalid state), the loop throws an error and instantly exits to the `catch` block. If `stmt.finalize()` is not enclosed in a `finally` block, it is skipped. The prepared statement remains open in memory, permanently holding a write lock on the database and crashing all future queries with a database locked error. The `finally` block guarantees cleanup in both success and error cases.

### Q4: How does your React app handle state preservation and theme switching when the user refreshes their browser?
* **Answer**: I coupled React state with `localStorage` hooks inside `App.jsx`. When the user logs in, their JWT token and profile details are saved to `localStorage`. On mount, states are initialized directly from `localStorage` values. Theme changes (Light/Dark mode) are written to the backend settings database using `PUT /api/settings` and simultaneously applied to the HTML document classes, ensuring settings persist across sessions and devices.

### Q5: What is "Minified React Error #310", and how did you resolve it in the layout?
* **Answer**: Error #310 represents a violation of the Rules of Hooks, indicating that a hook was called out of order or conditionally. In the old `App.jsx`, `useState(true)` for the sidebar was declared below an early return `if (!token)` block. When a user logged in, React executed this hook for the first time, violating hook count rules and crashing the app. I resolved this by placing all state hooks unconditionally at the very top of `App.jsx` before any conditional statements.

### Q6: How does the application handle page refreshes in production when using client-side routing?
* **Answer**: In client-side routing (React Router), URLs like `/sales` or `/regions` do not exist as physical files on the server. If a user refreshes the page on `/sales`, the server looks for a folder named `sales`, fails, and throws a 404 error. I resolved this by adding a wildcard routing handler `app.get('/*path')` in Express. If a request is not an API call, Express redirects and serves the static `index.html` file, allowing React Router to intercept the URL and render the correct sub-page on the client side.

### Q7: Why is it important that a REST API returns JSON errors instead of HTML on invalid sub-routes?
* **Answer**: If the frontend makes an API call to a misspelled route and the server returns a 404 HTML page instead of JSON, calling `res.json()` inside React tries to parse the HTML string `<!DOCTYPE html>`. This fails, throwing an uncaught `SyntaxError: Unexpected token <` in the browser console, crashing the user's view. To prevent this, I added a catch-all JSON error middleware `app.use('/api/*', ...)` that guarantees any invalid or missing API request always returns a clean JSON error response, keeping the React client crash-free.

### Q8: How did you solve the overlapping sidebar issue on mobile and tablet devices?
* **Answer**: I re-architected the layout styles inside `Sidebar.jsx`. On desktop (`lg` screens and up), the sidebar behaves as a static, relative flex element that sits side-by-side with the content. When collapsed, it smoothly decreases from `w-64` to `w-20` and the content expands to fill the space. On mobile/tablets, the sidebar becomes a `fixed z-50` sliding drawer, complete with a dark backdrop overlay that closes the menu when clicked, ensuring it never overlaps content.

### Q9: Why is the server-side state name normalizer function critical for data consistency?
* **Answer**: In real-world data feeds, string inputs vary (e.g., `Jammu & Kashmir` vs. `Jammu and Kashmir` vs. `J&K`). If database keys do not match exactly, analytical aggregates will treat them as different entities, splitting the metrics and breaking charts. The `normalizeStateName` function standardizes all historical, abbreviated, and punctuation variations on-the-fly to canonical names, ensuring data integrity.

### Q10: How do WebSockets improve the user experience of the Bulk Data Upload page?
* **Answer**: File parsing and bulk database insertions run asynchronously in the background. Instead of forcing the user to wait or poll the server repeatedly to check if their file is done processing, the backend simply accepts the file, returns a `"Processing"` status, and closes the request. Once SQLite finishes importing the records, the backend uses WebSockets to push a success milestone notification directly to the user's screen in real time, reducing server load and network overhead.
