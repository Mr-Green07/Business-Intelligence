import KPICard from "./KPICard";

function KPISection() {
  const kpis = [
    {
      title: "Total Revenue",
      value: "₹12.4M",
      growth: "18%",
    },
    {
      title: "Growth Rate",
      value: "18.2%",
      growth: "3%",
    },
    {
      title: "Orders",
      value: "3,248",
      growth: "8%",
    },
    {
      title: "Customers",
      value: "1,152",
      growth: "5%",
    },
    {
      title: "Top Product",
      value: "Laptop",
      growth: "22%",
    },
    {
      title: "Top Region",
      value: "Punjab",
      growth: "18%",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      {kpis.map((item, index) => (
        <KPICard
          key={index}
          title={item.title}
          value={item.value}
          growth={item.growth}
        />
      ))}
    </div>
  );
}

export default KPISection;