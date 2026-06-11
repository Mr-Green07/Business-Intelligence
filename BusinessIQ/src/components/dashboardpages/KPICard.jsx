function KPICard({ title, value, growth }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        minWidth: "220px",
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          margin: "10px 0",
          color: "#111827",
        }}
      >
        {value}
      </h2>

      <p
        style={{
          color: "#16a34a",
          margin: 0,
          fontWeight: "bold",
        }}
      >
        ↑ {growth}
      </p>
    </div>
  );
}

export default KPICard;