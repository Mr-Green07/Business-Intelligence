import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'
import './App.css'

function App() {
  
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Main content goes here */}
          <h1>Welcome to DecisionPilot</h1>
          <p>Your AI-powered business insights dashboard.</p>
        </div>
      </div>
    </>
  )
}

export default App
