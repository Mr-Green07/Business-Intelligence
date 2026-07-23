import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../App';
import { 
  Building, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Award, 
  Bookmark, 
  AlertTriangle, 
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RegionInfoPanel({ stateName }) {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!stateName) return;

    setLoading(true);
    setError('');

    // Fetch state stats, insights, and recommendations in parallel
    Promise.all([
      fetch(`/api/regions/${stateName}`, { headers: { Authorization: `Bearer ${token}` } }).then(res => {
        if (!res.ok) throw new Error('Failed to fetch state analytics');
        return res.json();
      }),
      fetch(`/api/regions/${stateName}/insights`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch(`/api/regions/${stateName}/recommendations`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ])
      .then(([stats, stateInsights, stateRecs]) => {
        if (stats && !stats.error) {
          setData(stats);
          setInsights(Array.isArray(stateInsights) ? stateInsights : []);
          setRecs(Array.isArray(stateRecs) ? stateRecs : []);
        } else {
          throw new Error(stats?.error || 'Invalid server response');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message || 'Offline or Server offline');
        setLoading(false);
      });
  }, [stateName, token]);

  if (!stateName) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        <Building className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Region Selected</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[240px]">
          Click on any state on the map or choose from the list to visualize state-level analytics, insights, and inventory actions.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="text-center text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
          Failed to load region details: {error || 'No data returned'}
        </div>
      </div>
    );
  }

  // Bar colors mapping
  const colors = ['#0ea5e9', '#6366f1', '#ec4899'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Title */}
      <div className="bg-slate-50/50 dark:bg-slate-800/30 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-sky-500" />
            {data.state || 'State'} Analytics
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Comprehensive regional performance drilldown</p>
        </div>
        <span className="text-[10px] font-bold text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10 px-2.5 py-1 rounded-full">
          Active Node
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Revenue</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹{data.revenue || 0} L</p>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500 font-semibold">+11.2%</span> vs target
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{(data.orders || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
              <ShoppingBag className="w-3 h-3 text-slate-400" />
              avg. ₹{data.orders > 0 ? Math.round((data.revenue || 0) * 100000 / data.orders).toLocaleString() : 0}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Customers</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{data.customers || 0}</p>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400">
              <Users className="w-3 h-3 text-slate-400" />
              Active in state
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg. CLV</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">₹{(data.avgClv || 0).toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500">
              <TrendingUp className="w-3 h-3 text-sky-500" />
              High lifetime value
            </div>
          </div>
        </div>

        {/* Highlights Banner */}
        <div className="bg-sky-50/40 dark:bg-sky-500/5 border border-sky-100 dark:border-sky-500/10 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-sky-950 dark:text-sky-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-sky-500" />
            Product & Category Leaderboard
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-white dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/40">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Top Category</span>
              <p className="font-bold text-slate-800 dark:text-white mt-0.5 truncate">{data.topCategory || 'N/A'}</p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/40">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Top Product</span>
              <p className="font-bold text-slate-800 dark:text-white mt-0.5 truncate">{data.topProduct || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        {data.categoryBreakdown && data.categoryBreakdown.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider">Category Revenue (₹ Lakhs)</h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.categoryBreakdown}
                  layout="vertical"
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }} 
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#bae6fd', fontSize: '11px' }}
                  />
                  <Bar dataKey="revenue" radius={6} barSize={14}>
                    {
                      data.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Regional Insights List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-sky-500" />
            Regional Insights
          </h4>
          {insights.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/30">
              No active insights for {data.state} yet. Run the generator engine in the Insights page to trigger automated findings.
            </p>
          ) : (
            <div className="space-y-3">
              {insights.map(ins => (
                <div 
                  key={ins?.id} 
                  className={`p-3.5 rounded-xl border text-xs flex gap-3 ${
                    ins?.type === 'warning' 
                      ? 'bg-amber-50/40 border-amber-100 text-amber-900 dark:bg-amber-500/5 dark:border-amber-500/20 dark:text-amber-200'
                      : ins?.type === 'success'
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-900 dark:bg-emerald-500/5 dark:border-emerald-500/20 dark:text-emerald-200'
                      : 'bg-sky-50/40 border-sky-100 text-sky-900 dark:bg-sky-500/5 dark:border-sky-500/20 dark:text-sky-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {ins?.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : ins?.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-sky-500" />
                    )}
                  </div>
                  <div>
                    <h5 className="font-bold">{ins?.title}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ins?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Regional Recommendations Actions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-violet-500" />
            AI Prescribed Actions
          </h4>
          {recs.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/30">
              No recommendations prescribed for {data.state} yet. Run the engine.
            </p>
          ) : (
            <div className="space-y-3">
              {recs.map(rec => (
                <div 
                  key={rec?.id} 
                  className="p-3.5 bg-violet-50/40 border border-violet-100 dark:bg-violet-500/5 dark:border-violet-500/20 rounded-xl text-xs flex gap-3"
                >
                  <div className="shrink-0 p-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg self-start">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h5 className="font-bold text-slate-900 dark:text-white truncate">{rec?.title}</h5>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        rec?.impact === 'High' 
                          ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400' 
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        {rec?.impact} Impact
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{rec?.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
