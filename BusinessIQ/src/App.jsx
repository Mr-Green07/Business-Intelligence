
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import SalesSummary from "./pages/SalesSummary";
import Insights from "./pages/Insights";
import Regions from "./pages/Regions";



function App() {
  return (
    <>
      <Navbar />
 

      <div style={{ display: "flex" }}>
        <Sidebar />


        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesSummary />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/regions" element={<Regions />} />
        </Routes>

      </div>
    </>
  );
}

export default App;