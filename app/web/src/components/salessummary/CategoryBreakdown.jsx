function CategoryBreakdown() {
  const categories = [
    { name: "Electronics", sales: "₹5.2M" },
    { name: "Furniture", sales: "₹3.1M" },
    { name: "Clothing", sales: "₹2.4M" },
  ];

  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h3>Category Breakdown</h3>

      {categories.map((item, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <span>{item.name}</span>
          <strong>{item.sales}</strong>
        </div>
      ))}
    </div>
  );
}

export default CategoryBreakdown;