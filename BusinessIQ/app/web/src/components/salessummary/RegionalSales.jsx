function RegionalSales() {
  const regions = [
    { region: "Punjab", revenue: "₹3.2M" },
    { region: "Delhi", revenue: "₹2.7M" },
    { region: "Mumbai", revenue: "₹2.4M" },
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
      <h3>Regional Sales</h3>

      <table style={{ width: "100%", marginTop: "15px" }}>
        <thead>
          <tr>
            <th align="left">Region</th>
            <th align="left">Revenue</th>
          </tr>
        </thead>

        <tbody>
          {regions.map((item, index) => (
            <tr key={index}>
              <td>{item.region}</td>
              <td>{item.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RegionalSales;