import IndiaMap from "../components/dashboardpages/IndiaMap";

function Regions() {
  return (
    <div
      style={{
        padding: "25px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
          color: "#0f172a",
        }}
      >
        Regional Analytics
      </h1>

      <IndiaMap />
    </div>
  );
}

export default Regions;