import SalesTrend from "../components/salessummary/SalesTrend";
import CategoryBreakdown from "../components/salessummary/CategoryBreakdown";
import OrderStatus from "../components/salessummary/OrderStatus";
import RegionalSales from "../components/salessummary/RegionalSales";

function SalesSummary() {
  return (
    <div
      style={{
        padding: "25px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1>Sales Summary</h1>

      <SalesTrend />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <CategoryBreakdown />
        <OrderStatus />
      </div>

      <div style={{ marginTop: "20px" }}>
        <RegionalSales />
      </div>
    </div>
  );
}

export default SalesSummary;