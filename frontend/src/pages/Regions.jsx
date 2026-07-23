import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import IndiaMap from '../components/dashboardpages/IndiaMap';
import RegionInfoPanel from '../components/dashboardpages/RegionInfoPanel';
import { Map, ArrowRight, ListFilter, Building } from 'lucide-react';

export default function Regions() {
  const { token } = useContext(AuthContext);
  const [activeState, setActiveState] = useState('');
  const [stateSummaries, setStateSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    // Fetch aggregated summaries for all states to populate the maps and selectors
    fetch('/api/regions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Safe check to verify data is indeed an array
        if (Array.isArray(data)) {
          setStateSummaries(data);
          
          // Select Maharashtra by default as the starting state, or the first state in array
          if (data.length > 0) {
            const topState = data[0].state || 'Maharashtra';
            setActiveState(topState);
          } else {
            setActiveState('Maharashtra');
          }
        } else {
          // If server returned an error object instead of an array
          console.error('API returned non-array data:', data);
          setError(data.error || 'Invalid server response structure');
          setStateSummaries([]);
          setActiveState('Maharashtra');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching regional summaries:', err);
        setError('Network error: Could not reach the server');
        setStateSummaries([]);
        setActiveState('Maharashtra');
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-sky-500" />
          Interactive Regional Sales Analytics
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Explore state-level sales performance, regional customer profiles, logistics alerts, and AI action prescriptions.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl text-xs text-amber-700 dark:text-amber-300">
          ⚠️ <strong>Active Warning:</strong> {error}. Running on sandbox/offline mode fallbacks.
        </div>
      )}

      {/* 2-Column Split: Map on left, State metrics Drilldown on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Center Column: State List Selector + India Map */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick List Selector buttons */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <ListFilter className="w-4 h-4 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quick State Select</span>
            </div>
            
            {loading ? (
              <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1 w-full">
                {(Array.isArray(stateSummaries) ? stateSummaries : []).map((summary) => (
                  <button
                    key={summary?.state}
                    onClick={() => setActiveState(summary?.state)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                      activeState === summary?.state
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/10 font-bold'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100 dark:bg-slate-850 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {summary?.state}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map wrapper */}
          <IndiaMap 
            activeState={activeState} 
            onStateSelect={setActiveState} 
            stateSummaries={Array.isArray(stateSummaries) ? stateSummaries : []} 
          />

          {/* Highlights comparison table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Regional Leaderboard Table</h3>
            {loading ? (
              <div className="h-32 bg-slate-100 rounded w-full animate-pulse"></div>
            ) : !Array.isArray(stateSummaries) || stateSummaries.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No states summaries available.</p>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-2">State Node</th>
                    <th className="py-2.5 px-2 text-right">Revenue</th>
                    <th className="py-2.5 px-2 text-right">Orders Volume</th>
                    <th className="py-2.5 px-2 text-right">Acquired Clients</th>
                    <th className="py-2.5 px-2 text-right">Growth Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                  {stateSummaries.slice(0, 5).map((row, idx) => (
                    <tr 
                      key={row?.state} 
                      onClick={() => setActiveState(row?.state)}
                      className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${
                        activeState === row?.state ? 'bg-sky-50/40 dark:bg-sky-500/5' : ''
                      }`}
                    >
                      <td className="py-3 px-2 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">#0{idx+1}</span>
                        {row?.state}
                      </td>
                      <td className="py-3 px-2 text-right font-semibold text-slate-900 dark:text-white">₹{row?.revenue || 0} L</td>
                      <td className="py-3 px-2 text-right">{(row?.orders || 0).toLocaleString()}</td>
                      <td className="py-3 px-2 text-right font-medium">{row?.customers || 0}</td>
                      <td className="py-3 px-2 text-right">
                        <span className="text-emerald-500 font-bold">+{row?.growth || 0}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

        {/* Right Column: Drilled down state info panel */}
        <div className="lg:col-span-1 h-max lg:sticky lg:top-20">
          <RegionInfoPanel stateName={activeState} />
        </div>

      </div>
    </div>
  );
}
