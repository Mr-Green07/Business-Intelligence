function Insights() {
  const insights = [
    "Revenue increased by 18% compared to last month.",
    "Laptop contributes 22% of total revenue.",
    "Punjab is the highest revenue-generating region.",
    "Returning customers account for 64% of sales.",
    "Order completion rate is above 90%.",
    "Electronics is the fastest-growing category."
  ];

  return (
    <div
      style={{
        padding: "25px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Business Insights</h1>

      <div
        style={{
          display: "grid",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {insights.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            💡 {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Insights;