import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import KPISection from '../components/dashboardpages/KPISection';
import { 
  Building, 
  ShoppingBag, 
  Award, 
  Sparkles, 
  Clock, 
  UserCheck, 
  ArrowRight,
  TrendingUp,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch summary highlights and activities in parallel
    const fetchSummary = fetch('/api/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());
    
    let fetchActivity = Promise.resolve([]);
    if (user?.role?.toLowerCase() === 'admin') {
      fetchActivity = fetch('/api/users/activity', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json());
    }

    Promise.all([fetchSummary, fetchActivity])
      .then(([summaryData, activityData]) => {
        setSummary(summaryData);
        setActivity(Array.isArray(activityData) ? activityData.slice(0, 5) : []); // show top 5 only
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching dashboard summary:', err);
        setLoading(false);
      });
  }, [token, user]);

  // Greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,#c084fc_0%,transparent_50%)] opacity-40 z-0"></div>
        <div className="space-y-1.5 z-10">
          <h1 className="text-xl md:text-2xl font-black tracking-tight">{getGreeting()}, {user?.name}!</h1>
          <p className="text-xs text-sky-100 max-w-xl font-medium">
            Welcome to DecisionPilot, your control center. Here are your key metrics, regional updates, and insights for today.
          </p>
        </div>
        <div className="z-10 shrink-0">
          <Link 
            to="/insights" 
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
            Generate New Insights
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <KPISection />

      {/* Highlights & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Highlights Cards */}
        <div className={`space-y-4 flex flex-col justify-between ${user?.role?.toLowerCase() === 'admin' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex-1">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-sky-500" />
              National Business Champions
            </h3>

            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Highlight 1: Top State */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/30 text-center relative overflow-hidden flex flex-col justify-between">
                  <div className="mx-auto p-2 bg-sky-500/10 text-sky-500 rounded-xl border border-sky-500/15 w-max mb-3">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Top State</span>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1 truncate">{summary?.topState}</h4>
                    <p className="text-xs text-sky-600 dark:text-sky-400 font-bold mt-1">₹{summary?.topStateRevenue} Lakhs</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    Highest contributor
                  </div>
                </div>

                {/* Highlight 2: Best Product */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/30 text-center relative overflow-hidden flex flex-col justify-between">
                  <div className="mx-auto p-2 bg-indigo-500/10 text-indigo-500 rounded-xl border border-indigo-500/15 w-max mb-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Top Product</span>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1 truncate" title={summary?.topProduct}>
                      {summary?.topProduct}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1">All-time best seller</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    High volume margin
                  </div>
                </div>

                {/* Highlight 3: Best Category */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/30 text-center relative overflow-hidden flex flex-col justify-between">
                  <div className="mx-auto p-2 bg-violet-500/10 text-violet-500 rounded-xl border border-violet-500/15 w-max mb-3">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Top Category</span>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-1 truncate">{summary?.topCategory}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Maximum demand share</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                    Strong growth focus
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Recent Activity Log */}
        {user?.role?.toLowerCase() === 'admin' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              Audit Log & User Activity
            </h3>
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {activity.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic text-center py-6">
                  No activity logs recorded yet.
                </p>
              ) : (
                activity.map((act) => (
                  <div key={act.id} className="flex gap-3 text-xs items-start">
                    <div className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 dark:text-slate-200 leading-tight">
                        <strong className="font-bold text-slate-900 dark:text-white">{act.user_name}</strong> {act.action}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed truncate">{act.details}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {new Date(act.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        )}

      </div>
    </div>
  );
}
