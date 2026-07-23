import React, { useContext } from 'react';
import { IndiaMap as ReactIndiaMap } from '@vishalvoid/react-india-map';
import { AppContext } from '../../App';

export default function IndiaMap({ activeState, onStateSelect, stateSummaries }) {
  const { theme } = useContext(AppContext);

  // Map state IDs from package to names in database
  const stateIdToName = {
    "IN-AP": "Andhra Pradesh",
    "IN-AR": "Arunachal Pradesh",
    "IN-AS": "Assam",
    "IN-BR": "Bihar",
    "IN-CT": "Chhattisgarh",
    "IN-GA": "Goa",
    "IN-GJ": "Gujarat",
    "IN-HR": "Haryana",
    "IN-HP": "Himachal Pradesh",
    "IN-JH": "Jharkhand",
    "IN-KA": "Karnataka",
    "IN-KL": "Kerala",
    "IN-MP": "Madhya Pradesh",
    "IN-MH": "Maharashtra",
    "IN-MN": "Manipur",
    "IN-ML": "Meghalaya",
    "IN-MZ": "Mizoram",
    "IN-NL": "Nagaland",
    "IN-OR": "Odisha",
    "IN-PB": "Punjab",
    "IN-RJ": "Rajasthan",
    "IN-SK": "Sikkim",
    "IN-TN": "Tamil Nadu",
    "IN-TG": "Telangana",
    "IN-TR": "Tripura",
    "IN-UP": "Uttar Pradesh",
    "IN-UT": "Uttarakhand",
    "IN-WB": "West Bengal",
    "IN-AN": "Andaman and Nicobar",
    "IN-CH": "Chandigarh",
    "IN-DN": "Dadra and Nagar Haveli and Daman and Diu",
    "IN-DL": "Delhi",
    "IN-JK": "Jammu and Kashmir",
    "IN-LA": "Ladakh",
    "IN-LD": "Lakshadweep",
    "IN-PY": "Puducherry"
  };

  // Convert summaries into StateData structure for the map component
  const stateData = Object.entries(stateIdToName).map(([id, name]) => {
    const summary = stateSummaries?.find(s => s.state === name) || {};
    return {
      id,
      customData: {
        name,
        revenue: summary.revenue || 0,
        orders: summary.orders || 0,
        customers: summary.customers || 0,
        growth: summary.growth || 0
      }
    };
  });

  const handleStateClick = (stateId) => {
    const stateName = stateIdToName[stateId];
    if (stateName) {
      onStateSelect(stateName);
    }
  };

  // Styles based on current active theme
  const mapStyle = theme === 'dark' ? {
    backgroundColor: 'transparent',
    hoverColor: '#0284c7', // Sky-600
    stroke: '#1e293b', // Slate-800
    strokeWidth: 1.5,
    tooltipConfig: {
      backgroundColor: '#0f172a', // Slate-900
      textColor: '#ffffff'
    }
  } : {
    backgroundColor: 'transparent',
    hoverColor: '#bae6fd', // Sky-200
    stroke: '#e2e8f0', // Slate-200
    strokeWidth: 1.5,
    tooltipConfig: {
      backgroundColor: '#1e293b', // Slate-800
      textColor: '#ffffff'
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm relative min-h-[500px]">
      <div className="absolute top-4 left-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">National Analytics Map</h3>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Click on a highlighted state to drill down</p>
      </div>

      <div className="w-full max-w-lg mx-auto india-map-container">
        <ReactIndiaMap
          stateData={stateData}
          onStateClick={handleStateClick}
          mapStyle={mapStyle}
        />
      </div>

      {/* Interactive Legend */}
      <div className="absolute bottom-4 right-4 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700 backdrop-blur-sm text-[10px] space-y-1.5">
        <p className="font-bold text-slate-700 dark:text-slate-300">Sales Intensity</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-sky-100 dark:bg-sky-950 rounded border border-sky-200 dark:border-sky-800"></span>
          <span className="text-slate-500 dark:text-slate-400">&lt; ₹50 Lakhs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-sky-300 dark:bg-sky-600 rounded"></span>
          <span className="text-slate-500 dark:text-slate-400">₹50 - ₹150 Lakhs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-sky-600 dark:bg-sky-400 rounded"></span>
          <span className="text-slate-500 dark:text-slate-400">&gt; ₹150 Lakhs</span>
        </div>
      </div>
    </div>
  );
}