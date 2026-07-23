import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ShoppingBag } from 'lucide-react';

export default function OrderStatus() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/sales/orders/status', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch order status');
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
        Failed to load order status: {error}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-sky-500" />
            Order Fulfillment Funnel
          </h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Status breakdown of placed transactions</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 min-h-[220px]">
        <div className="w-full md:w-1/2 h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="count"
                nameKey="status"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                itemStyle={{ color: '#bae6fd', fontSize: '11px' }}
                formatter={(value) => [`${value.toLocaleString()} Orders`, 'Count']}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Centered Total */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {data.reduce((acc, curr) => acc + curr.count, 0).toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total placed</span>
          </div>
        </div>

        {/* Legend listing */}
        <div className="w-full md:w-1/2 space-y-3">
          {data.map((item) => (
            <div key={item.status} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100/40 dark:border-slate-800/40">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.status}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.count.toLocaleString()}</p>
                <p className="text-[9px] text-slate-400 dark:text-slate-500">{item.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
