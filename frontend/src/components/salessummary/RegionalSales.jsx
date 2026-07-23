import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { Map, ArrowUpRight, ShieldAlert } from 'lucide-react';

export default function RegionalSales() {
  const { token } = useContext(AuthContext);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/sales/regional', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch regional sales');
        return res.json();
      })
      .then(data => {
        setRegions(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900/40">
        Failed to load regional data: {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Map className="w-4 h-4 text-sky-500" />
            Regional Sales Breakdown
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Macro-regional performance metrics</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3 px-2">Geographic Zone</th>
              <th className="py-3 px-2 text-right">Revenue (₹ Lakhs)</th>
              <th className="py-3 px-2 text-right">Total Orders</th>
              <th className="py-3 px-2 text-right">YoY Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
            {regions.map((reg) => (
              <tr key={reg.region} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3.5 px-2 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  {reg.region} Zone
                </td>
                <td className="py-3.5 px-2 text-right font-semibold text-slate-900 dark:text-white">
                  ₹{reg.revenue.toLocaleString()} L
                </td>
                <td className="py-3.5 px-2 text-right font-medium text-slate-500">
                  {reg.orders.toLocaleString()}
                </td>
                <td className="py-3.5 px-2 text-right">
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-0.5 font-bold">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    +{reg.growth}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
