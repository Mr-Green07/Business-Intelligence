<<<<<<< HEAD
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import SalesSummary from "./pages/SalesSummary";

import "./App.css";
=======
import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import LandingPage from './components/LandingPage.jsx'
import './App.css'
>>>>>>> d538f9a (new changes added)

function App() {
  return (
    <>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />
<<<<<<< HEAD

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<SalesSummary />} />
        </Routes>
=======
        <div style={{ width: '1px', backgroundColor: '#e0e0e0' }} />
        <div style={{ flex: 1 }}>
          <LandingPage />
        </div>

        
>>>>>>> d538f9a (new changes added)
      </div>
    </>
  );
}

export default App;