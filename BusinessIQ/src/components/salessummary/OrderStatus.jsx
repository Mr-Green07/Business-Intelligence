function OrderStatus() {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Order Status</h3>

      <p>✅ Completed : 2750</p>
      <p>⏳ Pending : 320</p>
      <p>❌ Cancelled : 178</p>
    </div>
  );
}

export default OrderStatus;