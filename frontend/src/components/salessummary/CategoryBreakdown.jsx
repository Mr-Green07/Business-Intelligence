import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Layers } from 'lucide-react';

export default function CategoryBreakdown() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/sales/categories', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="h-80 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-center animate-pulse">
        <div className="h-44 w-44 rounded-full bg-slate-200 dark:bg-slate-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900/40">
        Failed to load categories: {error}
      </div>
    );
  }

  const COLORS = ['#0ea5e9', '#6366f1', '#ec4899'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-500" />
            Product Portfolio Distribution
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Share of categories in overall sales</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 min-h-[220px]">
        <div className="w-full md:w-1/2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="revenue"
                nameKey="category"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ color: '#bae6fd', fontSize: '11px' }}
                formatter={(value) => [`₹${value} Lakhs`, 'Revenue']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom list description */}
        <div className="w-full md:w-1/2 space-y-3">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/40 dark:border-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.category}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white">₹{item.revenue} L</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500">{item.percentage}% share</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
