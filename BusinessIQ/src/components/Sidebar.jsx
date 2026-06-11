import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
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
    { name: "Insights", path: "/insights", icon: Lightbulb },
    { name: "Recommendations", path: "/recommendations", icon: ClipboardList },
    { name: "Regions", path: "/regions", icon: MapPinned },
    { name: "Customers", path: "/customers", icon: Users },
    {name:"Data Upload", path:"/data-upload", icon:Menu},
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div
      style={{
        width: open ? "250px" : "70px",
        height: "200vh",
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


        <button
          onClick={() => setOpen(!open)}
          style={{
          background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#e5e7eb",
            cursor: "pointer",
            borderRadius: "12px",
            padding: "8px",
            boxShadow: "0 0 0 rgba(59,130,246,0)",
            transition: "0.2s", 
          

          }}
        >
          {open ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
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