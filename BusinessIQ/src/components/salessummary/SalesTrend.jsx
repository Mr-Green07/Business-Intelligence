function SalesTrend() {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Monthly Revenue Trend</h3>

      <div
        style={{
          height: "250px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          marginTop: "15px",
          borderRadius: "10px",
        }}
      >
        Revenue Chart Here
      </div>
    </div>
  );
}

export default SalesTrend;