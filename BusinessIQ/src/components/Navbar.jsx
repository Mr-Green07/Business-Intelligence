function Navbar() {
  return (
    <nav
      style={{
        height: "60px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h2>DecisionPilot</h2>

      <div>
        <span>🔔</span>
        <span style={{ marginLeft: "15px" }}>👤 Analyst</span>
      </div>
    </nav>
  );
}
export default Navbar;