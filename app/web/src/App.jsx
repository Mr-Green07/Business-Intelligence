import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SalesSummary from "./pages/SalesSummary";
import Insights from "./pages/Insights";
import Regions from "./pages/Regions";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isLoginPage = location.pathname === "/login";

  // Unauthenticated users can only see the login page
  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated users landing on /login get bounced to dashboard
  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/" replace />;
  }

  // Standalone login page (no Navbar / Sidebar)
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesSummary />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/regions" element={<Regions />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
