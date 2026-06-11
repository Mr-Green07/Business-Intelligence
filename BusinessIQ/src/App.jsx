
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import SalesSummary from "./pages/SalesSummary";

import "./App.css";
import LandingPage from "./components/LandingPage";



function App() {
  return (
    <>
      <Navbar />
      <LandingPage />

      <div style={{ display: "flex" }}>
        <Sidebar />


        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesSummary />} />
        </Routes>

      </div>
    </>
  );
}

export default App;