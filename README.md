# DecisionPilot — Enterprise BI Dashboard

DecisionPilot is a state-of-the-art, interactive Business Intelligence dashboard designed to visualize real-time sales transactions, regional performance metrics, customer demographics, and dynamic analytical recommendations across 13 Indian states.

This application is a **fully working full-stack implementation** featuring an SQLite database, Express backend, and a React + Vite + Tailwind CSS frontend with rich charting, SVG maps, and real-time WebSocket notifications.

---

## 🏗 Full-Stack Architecture

### 1. Database (SQLite3)
- Stores information across relational tables: `users`, `sales_data`, `customers`, `insights`, `recommendations`, `uploads`, `notifications`, `settings`, and `user_activity`.
- Pre-populated on initialization with a robust, randomized dataset representing 12 months of high-volume transactions, 150 unique clients, and multiple system logs.

### 2. Backend Server (Express & WS)
- Standard Express REST endpoints (under `/api/*`) handle user authentication (JWT-based), paginated sales journals, client analytics, and setting configs.
- Real-time updates are pushed instantaneously using Node's `ws` library (on `/ws/notifications`) for on-screen live notifications during file imports or insight compiles.
- Contains an **Analytical Prescriptive Engine** (`/api/insights/generate`) that scans the SQL dataset programmatically for geographic drops or concentration risks, compiling live findings and actions.

### 3. Frontend Web Client (React, Vite, Recharts, Tailwind CSS)
- Fully responsive dashboard utilizing **Tailwind CSS (v3)** and **Lucide Icons**.
- Built with **Recharts** representing MoM sales trends, categories pie charts, and fulfillment funnels.
- Features **`@vishalvoid/react-india-map`** rendering an interactive India SVG map with hover tooltips and click drill-down capabilities.
- Fully integrated pages:
  - **Dashboard**: High-level sales, averages, retention, and recent team activities.
  - **Sales Summary**: Recharts trends, portfolios, and a full paginated transaction journal with search/filter capabilities.
  - **Regional Analytics**: Interactive India map coupled with a deep drill-down analytics card, state categories charts, and state insights/prescriptions.
  - **Insights & AI**: A command center to trigger the AI Prescriptive Engine with live progress spinner and instant refresh of discovered actions.
  - **Customer Analytics**: CLV summaries, retention rates, acquisition charts, and full search-enabled directory of customer accounts.
  - **Bulk Data Upload**: Drag-and-drop CSV importer with error logs, templates, and history.
  - **Settings**: Adjust light/dark themes (propagating instantly), toggle notifications, and inspect chronological system audit trails.

---

## 📡 API Endpoints Implemented

### Authentication
```
POST   /api/auth/login              # User login → returns JWT token
POST   /api/auth/logout             # Log out and track activity
GET    /api/auth/me                 # Decodes JWT for active profile
```

### Dashboard & KPIs
```
GET    /api/dashboard/kpis          # Aggregates real-time Revenue, AOV, Orders, Retention
GET    /api/dashboard/summary       # Fetches top state, best seller, and max category
```

### Sales
```
GET    /api/sales/trend             # 12-Month MoM revenue and volume trend coordinates
GET    /api/sales/categories        # Product category share totals & percentages
GET    /api/sales/orders/status     # Status ratios of placed transactions
GET    /api/sales/regional          # Geographic zone aggregates and growth averages
GET    /api/sales?from=&to=...      # Paginated, filter-enabled sales transaction journal
```

### Regions
```
GET    /api/regions                 # Map indicators for all 13 Indian states
GET    /api/regions/:stateName      # Deep drilldown stats for a specific state
GET    /api/regions/:stateName/insights        # State-specific warning/success findings
GET    /api/regions/:stateName/recommendations # State-specific action items
```

### Customers
```
GET    /api/customers               # Paginated client list with search & location filters
GET    /api/customers/stats         # Acquisition trends, CLV averages, and status ratios
GET    /api/customers/:id           # Individual customer details
```

### Insights & AI Engine
```
GET    /api/insights                # Current catalog of insights
GET    /api/recommendations         # Current catalog of strategic recommendations
POST   /api/insights/generate       # Triggers programmatic audit of SQL tables and updates lists
```

### Data Upload
```
POST   /api/upload                  # Handles multipart/form-data CSV files and parses rows
GET    /api/upload/history          # Full historical list of processed CSV log files
GET    /api/upload/:id/status       # Progress status of a specific import job
```

### Notifications
```
GET    /api/notifications           # List of 50 most recent alert notifications
PATCH  /api/notifications/:id/read  # Mark an unread alert as read
WS     /ws/notifications            # Persistent WebSocket link for real-time alerts
```

---

## 🚀 How to Run the Website

The entire application runs **integrated on a single port (5000)** because the Express backend is pre-configured to host and serve the React production bundle! This guarantees zero configuration discrepancies or CORS issues.

### Prerequisites
- Node.js ≥ 18
- npm

### 1. Install all dependencies
In the root directory (`/BusinessIQ`), run:
```bash
npm run install-all
```
*This command automatically initializes configurations and installs packages for the root, backend, and frontend environments.*

### 2. Build the Frontend
Compile the React source files into optimized static distribution files:
```bash
npm run build-frontend
```

### 3. Start the Server
Boot up the SQLite database and launch the Express + WS server:
```bash
npm run start
```

### 4. Visit the Application
Open your web browser and go to:
**`http://localhost:5000`**

---

## 👤 Credentials for Demo Login

When you boot up the website, log in using any of the pre-seeded credentials:

| Role | Username | Password |
|---|---|---|
| **Admin** | `admin@businessiq.com` | `admin123` |
| **Analyst** | `analyst@businessiq.com` | `analyst123` |
| **Viewer** | `viewer@businessiq.com` | `viewer123` |

---

## 📁 Project Structure Built

```
BusinessIQ/
├── package.json                       # Monorepo controller & start script scripts
├── README.md                          # Guides & API documentation
├── backend/
│   ├── package.json                   # Express & SQLite dependencies
│   ├── businessiq.db                  # Persisted SQLite database
│   ├── db.js                          # Database initialization, schemas, and seeder
│   └── server.js                      # Express REST controllers + WebSockets Server
└── frontend/
    ├── package.json                   # React, Tailwind, Recharts, Map dependencies
    ├── index.html                     # HTML entry point
    ├── vite.config.js                 # Dev server proxying & plugins
    ├── tailwind.config.js             # Tailwind spacing, themes, and colors configurations
    ├── postcss.config.js              # CSS autoprefix processors
    └── src/
        ├── main.jsx                   # React boot wrapper
        ├── App.jsx                    # Auth State + WebSocket client + Routing layout
        ├── index.css                  # CSS directives & scrollbar styling
        ├── pages/
        │   ├── Dashboard.jsx          # Welcome, KPIs, champions, recent audit logs
        │   ├── SalesSummary.jsx       # Recharts summaries + paginated transaction table
        │   ├── Regions.jsx            # State selector + India SVG Map + Drilldown metrics
        │   ├── Insights.jsx           # Prescriptive AI control center with "Run Engine" trigger
        │   ├── Customers.jsx          # Client ratios, acquisition graphs, searchable directory
        │   ├── DataUpload.jsx         # Drag-and-drop CSV upload + sample CSV downloads
        │   └── Settings.jsx           # Dark/Light mode switch, configurations, chron history
        └── components/
            ├── Navbar.jsx             # Top bar with unread notifications popover & profiles
            ├── Sidebar.jsx            # Left collapsible navigation links list
            ├── dashboardpages/
            │   ├── KPICard.jsx        # Individual stat cards (AOV, revenue, growth)
            │   ├── KPISection.jsx     # Grid container for KPICards
            │   ├── IndiaMap.jsx       # Renders IndiaMap SVG and highlights selected node
            │   └── RegionInfoPanel.jsx# Renders horizontal categories charts, insights & recs
            └── salessummary/
                ├── SalesTrend.jsx     # AreaChart showing MoM revenue & orders volumes
                ├── CategoryBreakdown.jsx# PieChart representing product portfolios
                ├── OrderStatus.jsx    # DoughnutChart representing fulfillment funnel
                └── RegionalSales.jsx  # Macro regional zone table with growth indicators
```
