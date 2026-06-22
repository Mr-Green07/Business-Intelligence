# DecisionPilot — Business Intelligence Dashboard

A React-based Business Intelligence dashboard for visualizing sales, regional analytics, customer insights, and KPIs across Indian states.

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.2.6 | UI library |
| **Vite** | 8.0.12 | Build tool & dev server |
| **React Router DOM** | 7.17.0 | Client-side routing |
| **Tailwind CSS** | 4.3.0 | Utility-first styling |
| **Recharts** | 3.8.1 | Charting & data visualization |
| **Lucide React** | 1.17.0 | Icon library |
| **@vishalvoid/react-india-map** | 1.2.0 | India SVG map component |
| **vite-plugin-svgr** | 5.2.0 | SVG as React components |
| **ESLint** | 10.3.0 | Code linting |

---

## 📁 Project Structure

```
BusinessIQ/
├── index.html                         # HTML entry point
├── vite.config.js                     # Vite config (React + Tailwind + SVGR plugins)
├── tailwind.config.cjs                # Tailwind CSS configuration
├── package.json
├── public/
└── src/
    ├── main.jsx                       # App entry — BrowserRouter wrapping
    ├── App.jsx                        # Root layout — Navbar + Sidebar + Routes
    ├── assets/
    │   └── india.svg                  # India map SVG asset
    ├── components/
    │   ├── Navbar.jsx                 # Top navigation bar with search, notifications, profile
    │   ├── Sidebar.jsx                # Collapsible sidebar with navigation links
    │   ├── dashboardpages/
    │   │   ├── KPISection.jsx         # Grid of KPI metric cards
    │   │   ├── KPICard.jsx            # Individual KPI card (revenue, growth, orders, etc.)
    │   │   ├── IndiaMap.jsx           # Interactive India map with state hover/click
    │   │   ├── RegionInfoPanel.jsx    # State detail panel (revenue, orders, insights)
    │   │   ├── regionData.jsx         # Static region-wise data (13 Indian states)
    │   │   ├── IndiaMap.css           # India map styles
    │   │   ├── RegionInfoPanel.css    # Region panel styles
    │   │   ├── InsightsPanel.jsx      # (Planned) Insights display panel
    │   │   ├── RecommendationPanel.jsx # (Planned) Recommendations panel
    │   │   └── SalesChart.jsx         # (Planned) Sales chart component
    │   └── salessummary/
    │       ├── SalesTrend.jsx         # Monthly revenue trend (placeholder)
    │       ├── CategoryBreakdown.jsx  # Sales by category (Electronics, Furniture, Clothing)
    │       ├── OrderStatus.jsx        # Order status (Completed, Pending, Cancelled)
    │       └── RegionalSales.jsx      # Revenue by region table
    └── pages/
        ├── Dashboard.jsx              # Main dashboard — KPIs + quick insights
        ├── SalesSummary.jsx           # Sales overview — trends, categories, orders, regions
        ├── Insights.jsx               # Business insights listing
        ├── Regions.jsx                # Regional analytics — interactive India map
        ├── Customers.jsx              # (Planned) Customer analytics
        └── Settings.jsx               # (Planned) App settings
```

---

## 🔀 Frontend Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | KPI cards, revenue insights, best product, top region |
| `/sales` | Sales Summary | Revenue trend, category breakdown, order status, regional sales |
| `/insights` | Insights | List of business insights with key metrics |
| `/regions` | Regions | Interactive India map with state-level analytics |
| `/recommendations` | Recommendations | *(Planned)* AI-generated recommendations |
| `/customers` | Customers | *(Planned)* Customer segmentation & analytics |
| `/data-upload` | Data Upload | *(Planned)* Upload CSV/Excel data files |
| `/settings` | Settings | *(Planned)* User & app preferences |

---

## 🔧 Backend Services to Connect

The frontend currently uses static/hardcoded data. The following backend services need to be built and connected:

### 1. Authentication Service
- User login/logout & session management
- Role-based access (Admin, Analyst, Viewer)
- JWT token-based authentication

### 2. Sales Data Service
- Aggregate sales data from databases (PostgreSQL / MongoDB)
- Revenue calculations, growth rate computation
- Time-series data for trend charts
- Category-wise and region-wise breakdowns

### 3. Regional Analytics Service
- State-wise revenue, orders, customer count
- Growth metrics per region
- Top product per region
- Auto-generated insights & recommendations per state

### 4. Customer Analytics Service
- Customer segmentation (new vs returning)
- Customer lifetime value (CLV) calculations
- Retention rate analytics
- Customer acquisition trends

### 5. Insights & Recommendations Engine
- AI/ML-based insight generation from sales data
- Automated business recommendations
- Anomaly detection (e.g., sudden revenue drops)
- Trend prediction

### 6. Data Upload Service
- CSV / Excel file upload & parsing
- Data validation and cleaning
- Bulk import into database
- Upload history tracking

### 7. Notification Service
- Business alerts (revenue drops, target achievements)
- Real-time notifications via WebSocket
- Alert configuration & thresholds

---

## 📂 Backend API Folder Structure (Express.js)

```
api/
├── package.json                    # Dependencies & scripts
├── .env                            # Environment variables (DB URL, JWT secret, port)
├── .env.example                    # Template for other developers
│
├── src/
│   ├── server.js                   # Entry point — starts Express, connects DB
│   ├── app.js                      # Express app setup (middleware, routes, error handler)
│   │
│   ├── config/
│   │   ├── db.js                   # MongoDB/PostgreSQL connection config
│   │   ├── env.js                  # Loads & validates env variables
│   │   └── cors.js                 # CORS config (allow your Vite frontend)
│   │
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification middleware
│   │   ├── errorHandler.js         # Global error handler
│   │   ├── validate.js             # Request body/param validation (Joi/Zod)
│   │   └── upload.js               # Multer config for CSV/Excel uploads
│   │
│   ├── routes/
│   │   ├── index.js                # Route aggregator — mounts all sub-routers
│   │   ├── auth.routes.js          # POST /login, /logout, GET /me
│   │   ├── dashboard.routes.js     # GET /kpis, /summary
│   │   ├── sales.routes.js         # GET /trend, /categories, /orders/status, /regional
│   │   ├── regions.routes.js       # GET /, /:stateName, /:stateName/insights
│   │   ├── customers.routes.js     # GET /, /stats, /:id
│   │   ├── insights.routes.js      # GET /, POST /generate
│   │   ├── upload.routes.js        # POST /, GET /history, /:id/status
│   │   ├── notifications.routes.js # GET /, PATCH /:id/read
│   │   └── settings.routes.js      # GET /, PUT /
│   │
│   ├── controllers/
│   │   ├── auth.controller.js      # Login/logout/profile logic
│   │   ├── dashboard.controller.js # KPI aggregation logic
│   │   ├── sales.controller.js     # Sales trend, category, order computations
│   │   ├── regions.controller.js   # State-wise analytics logic
│   │   ├── customers.controller.js # Customer segmentation, CLV
│   │   ├── insights.controller.js  # Insight generation logic
│   │   ├── upload.controller.js    # File parsing, validation, bulk import
│   │   ├── notifications.controller.js # Alert management
│   │   └── settings.controller.js  # User preferences CRUD
│   │
│   ├── models/
│   │   ├── User.js                 # User schema (name, email, role, password hash)
│   │   ├── Sale.js                 # Sales records (product, amount, region, date, category)
│   │   ├── Customer.js             # Customer schema (name, region, orders, CLV)
│   │   ├── Region.js               # Region/state metadata
│   │   ├── Insight.js              # Generated insights storage
│   │   ├── Notification.js         # Alerts & notifications
│   │   ├── Upload.js               # Upload job tracking (filename, status, rows)
│   │   └── Setting.js              # User preferences
│   │
│   ├── services/
│   │   ├── auth.service.js         # Password hashing, JWT sign/verify
│   │   ├── sales.service.js        # Revenue aggregation, growth calc, time-series
│   │   ├── regions.service.js      # State-level analytics computation
│   │   ├── customers.service.js    # Segmentation, retention, CLV algorithms
│   │   ├── insights.service.js     # AI/rule-based insight generation
│   │   ├── upload.service.js       # CSV/Excel parsing (with xlsx/papaparse)
│   │   └── notification.service.js # Alert thresholds, WebSocket broadcasting
│   │
│   ├── utils/
│   │   ├── apiResponse.js          # Standardized { success, data, message } wrapper
│   │   ├── apiError.js             # Custom error class with status codes
│   │   ├── logger.js               # Winston/Pino logging setup
│   │   └── constants.js            # Enums (roles, order statuses, categories)
│   │
│   └── websocket/
│       └── notifications.ws.js     # WebSocket server for real-time alerts
│
├── seeds/
│   └── seed.js                     # Seed DB with static regionData + sample sales
│
└── tests/
    ├── auth.test.js
    ├── sales.test.js
    └── regions.test.js
```

### 🔑 Key Dependencies

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` or `pg` | MongoDB ORM / PostgreSQL client |
| `jsonwebtoken` | JWT auth tokens |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin requests from Vite |
| `dotenv` | Environment variable loading |
| `multer` | File upload handling |
| `papaparse` / `xlsx` | CSV / Excel parsing |
| `joi` or `zod` | Request validation |
| `winston` or `pino` | Logging |
| `ws` or `socket.io` | WebSocket for real-time notifications |
| `nodemon` | Dev auto-restart |

### 💡 Why This Structure

- **Routes → Controllers → Services → Models** — clean separation of concerns. Routes handle HTTP, controllers orchestrate, services contain business logic, models define data shape.
- **Middleware layer** catches auth, validation, and errors before they hit controllers.
- **Seeds folder** lets you migrate existing static data (from `regionData.jsx`, `KPISection.jsx`, etc.) into the database.
- **WebSocket module** is isolated for real-time notifications.

---

## 📡 API Endpoints to Integrate

### Authentication
```
POST   /api/auth/login              # User login → returns JWT token
POST   /api/auth/logout             # Invalidate session
GET    /api/auth/me                 # Get current user profile
```

### Dashboard & KPIs
```
GET    /api/dashboard/kpis          # Fetch all KPI metrics (revenue, growth, orders, customers)
GET    /api/dashboard/summary       # Quick insights for dashboard cards
```

### Sales
```
GET    /api/sales/trend             # Monthly revenue trend data (for SalesTrend chart)
GET    /api/sales/categories        # Category-wise breakdown (Electronics, Furniture, etc.)
GET    /api/sales/orders/status     # Order status counts (completed, pending, cancelled)
GET    /api/sales/regional          # Region-wise revenue table data
GET    /api/sales?from=&to=         # Sales data with date filters
```

### Regions
```
GET    /api/regions                 # All regions with summary data
GET    /api/regions/:stateName      # Detailed data for a specific state
GET    /api/regions/:stateName/insights        # Insights for a state
GET    /api/regions/:stateName/recommendations # Recommendations for a state
```

### Customers
```
GET    /api/customers               # Customer list with pagination
GET    /api/customers/stats         # Customer analytics (retention, CLV, segmentation)
GET    /api/customers/:id           # Individual customer details
```

### Insights & Recommendations
```
GET    /api/insights                # All generated business insights
GET    /api/recommendations         # AI-generated recommendations
POST   /api/insights/generate       # Trigger new insight generation
```

### Data Upload
```
POST   /api/upload                  # Upload CSV/Excel file
GET    /api/upload/history          # List of past uploads
GET    /api/upload/:id/status       # Status of a specific upload job
```

### Notifications
```
GET    /api/notifications           # Fetch all notifications
PATCH  /api/notifications/:id/read  # Mark notification as read
WS     /ws/notifications            # WebSocket for real-time alerts
```

### User / Settings
```
GET    /api/settings                # Get user preferences
PUT    /api/settings                # Update user preferences
GET    /api/users/activity          # User activity summary (reports, uploads, etc.)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation
```bash
cd BusinessIQ
npm install
```

### Development
```bash
npm run dev
```
The app runs on `http://localhost:5173` by default.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📊 Current Data Sources (Static)

The app currently uses hardcoded data in the following files — these should be replaced with API calls:

| File | Data | Replace With |
|---|---|---|
| `regionData.jsx` | 13 Indian states with revenue, growth, orders, insights | `GET /api/regions` |
| `KPISection.jsx` | 6 KPI metrics (revenue, growth, orders, etc.) | `GET /api/dashboard/kpis` |
| `CategoryBreakdown.jsx` | 3 product categories with sales | `GET /api/sales/categories` |
| `OrderStatus.jsx` | Order status counts | `GET /api/sales/orders/status` |
| `RegionalSales.jsx` | 3 regions with revenue | `GET /api/sales/regional` |
| `Insights.jsx` | 6 static insight strings | `GET /api/insights` |

---

## 👤 Authors

- **Simran Yadav** — Business Analyst

---

## 📄 License

This project is private and not open-sourced.
