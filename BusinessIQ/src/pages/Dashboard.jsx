import KPISection from "../components/dashboardpages/KPISection";

function Dashboard() {
  return (
    <div
      style={{
        flex: 1,
        padding: "25px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Dashboard</h1>

      <KPISection />

      {/* Quick Insights */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div className="card">
          <h3>Revenue Insight</h3>
          <p>Revenue increased by 18% this month.</p>
        </div>

        <div className="card">
          <h3>Best Product</h3>
          <p>Laptop contributes 22% of total sales.</p>
        </div>

        <div className="card">
          <h3>Top Region</h3>
          <p>Punjab generated the highest revenue.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;