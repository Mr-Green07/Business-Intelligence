import { useState } from "react";
import IndiaSvg from "../../assets/india.svg?react";
import RegionInfoPanel from "./RegionInfoPanel";
import { regionData } from "./regionData";
import "./IndiaMap.css";

function IndiaMap() {
  const [selectedState, setSelectedState] = useState(null);
const [hoveredState, setHoveredState] = useState(null);
  const handleClick = (stateName) => {
    setSelectedState(stateName);
  };

  return (
    <div className="dashboard-layout">
      <div className="map-container">

        <IndiaSvg
  className="india-svg"
  onMouseOver={(e) => {
    const stateName = e.target.getAttribute("title");

    if (stateName) {
      setHoveredState(stateName);

      e.target.style.fill = "#22c55e";
    }
  }}
  onMouseOut={(e) => {
    e.target.style.fill = "#d1d5db";
    setHoveredState(null);
  }}
  onClick={(e) => {
    const stateName = e.target.getAttribute("title");

    if (stateName) {
      setSelectedState(stateName);
    }
  }}
/>
{hoveredState && regionData[hoveredState] && (
    <div className="tooltip-card">
      <h3>{hoveredState}</h3>

      <p>
        <strong>Revenue:</strong>{" "}
        {regionData[hoveredState].revenue}
      </p>

      <p>
        <strong>Growth:</strong>{" "}
        {regionData[hoveredState].growth}%
      </p>

      <p>
        <strong>Insight:</strong>{" "}
        {regionData[hoveredState].insight}
      </p>

      <p>
        <strong>Recommendation:</strong>{" "}
        {regionData[hoveredState].recommendation}
      </p>
    </div>
  )}

      </div>

     
      
    </div>
  );
}

export default IndiaMap;