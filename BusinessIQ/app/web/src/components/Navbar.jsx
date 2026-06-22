import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      style={{
        height: "70px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 25px",
        position: "relative",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: "24px", color: "#111827" }}>
          DecisionPilot
        </h2>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "20px",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search insights..."
          style={{
            padding: "10px 15px",
            width: "260px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            outline: "none",
          }}
        />

        {/* Notification */}
        <button
          style={{
            border: "none",
            background: "#f3f4f6",
            padding: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          🔔
        </button>

        {/* Analyst Profile */}
        <div
          onClick={() => setShowProfile(!showProfile)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#f8fafc",
            padding: "8px 12px",
            borderRadius: "12px",
            cursor: "pointer",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#2563eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {user?.name ?? "User"}
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#6b7280",
              }}
            >
              {user?.role ?? "Analyst"}
            </div>
          </div>
        </div>
      </div>

      {/* Analyst Dropdown Panel */}
      {showProfile && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "25px",
            width: "340px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          {/* Profile Header */}
          <div>
            <h3 style={{ margin: 0 }}>👤 {user?.name ?? "User"}</h3>
            <p
              style={{
                color: "#6b7280",
                margin: "5px 0",
              }}
            >
              {user?.email ?? ""}
            </p>
          </div>

          <hr />

          {/* Activity */}
          <div>
            <h4>📊 Activity Summary</h4>

            <p>Insights Reviewed: 18</p>
            <p>Reports Generated: 7</p>
            <p>Data Uploads: 3</p>
            <p>Recommendations Created: 5</p>
          </div>

          <hr />

          {/* Tasks */}
          <div>
            <h4>🔔 Pending Tasks</h4>

            <ul>
              <li>Review North Region decline</li>
              <li>Validate June sales upload</li>
              <li>Analyze Product B growth</li>
            </ul>
          </div>

          <hr />

          {/* Alerts */}
          <div>
            <h4>📈 Business Alerts</h4>

            <p style={{ color: "#dc2626" }}>North Region sales down 15%</p>

            <p style={{ color: "#f59e0b" }}>Product A concentration risk</p>

            <p style={{ color: "#16a34a" }}>Customer retention up 8%</p>
          </div>

          <hr />

          {/* Actions */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <button style={btnStyle}>⚙️ Settings</button>

            <button style={btnStyle}>📄 My Reports</button>

            <button
              style={{
                ...btnStyle,
                background: "#ef4444",
                color: "white",
                border: "none",
              }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

const btnStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  cursor: "pointer",
};

export default Navbar;
