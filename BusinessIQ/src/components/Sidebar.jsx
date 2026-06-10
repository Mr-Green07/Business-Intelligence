import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Package,
  Lightbulb,
  ClipboardList,
  MapPinned,
  Users,
  Settings,
} from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Sales Summary", path: "/sales", icon: BarChart3 },
    { name: "Top Products", path: "/products", icon: Package },
    { name: "Insights", path: "/insights", icon: Lightbulb },
    { name: "Recommendations", path: "/recommendations", icon: ClipboardList },
    { name: "Regions", path: "/regions", icon: MapPinned },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div
      style={{
        width: open ? "250px" : "70px",
        height: "100vh",
        background: "#0f172a",
        color: "white",
        transition: "0.3s",
        padding: "15px",
      }}
    >
      {/* Toggle Button */}
      <div
        style={{
          display: "flex",
          justifyContent: open ? "space-between" : "center",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {open && <h2>DecisionPilot</h2>}

        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Menu */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.name}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  marginBottom: "8px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "white",
                  background: isActive ? "#2563eb" : "transparent",
                  transition: "0.3s",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.style.background.includes("rgb")) {
                    e.currentTarget.style.background = "#1e293b";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains("active")) {
                    e.currentTarget.style.background = "";
                  }
                }}
              >
                <Icon size={20} />
                {open && <span>{item.name}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;