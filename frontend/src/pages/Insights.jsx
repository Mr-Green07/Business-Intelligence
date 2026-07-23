import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { 
  Lightbulb, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Info,
  ExternalLink,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Settings
} from 'lucide-react';

export default function Insights() {
  const { token } = useContext(AuthContext);
  const [insights, setInsights] = useState([]);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningEngine, setRunningEngine] = useState(false);
  const [engineResult, setEngineResult] = useState(null);

  const fetchInsightsAndRecommendations = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/insights', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/recommendations', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ])
      .then(([insightsData, recsData]) => {
        setInsights(insightsData || []);
        setRecs(recsData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching insights/recs:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInsightsAndRecommendations();
  }, [token]);

  const triggerInsightsEngine = () => {
    setRunningEngine(true);
    setEngineResult(null);

    fetch('/api/insights/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setRunningEngine(false);
        setEngineResult(data);
        fetchInsightsAndRecommendations(); // Refresh lists immediately
      })
      .catch(err => {
        console.error('Error running engine:', err);
        setRunningEngine(false);
      });
  };

  return (
    <div className="space-y-6">
      
      {/* AI Action Header */}
      <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-30%,#38bdf8_0%,transparent_40%)] opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_130%,#6366f1_0%,transparent_50%)] opacity-30 z-0"></div>
        
        <div className="space-y-2 z-10">
          <h2 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-sky-400 animate-pulse" />
            DecisionPilot Prescriptive Engine
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            The background prescriptive analytics engine monitors regional logs, transaction trends, and client parameters to compute actionable operational recommendations.
          </p>
        </div>

        <div className="z-10 shrink-0">
          <button
            onClick={triggerInsightsEngine}
            disabled={runningEngine}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 disabled:from-slate-800 disabled:to-slate-800 border border-white/10 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-sky-500/10 cursor-pointer text-white disabled:cursor-not-allowed"
          >
            {runningEngine ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing logs...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Prescriptive Engine
              </>
            )}
          </button>
        </div>
      </div>

      {/* Engine run summary result */}
      {engineResult && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl flex items-start gap-3.5 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-400">{engineResult.message}</h4>
            <p className="text-emerald-700 dark:text-emerald-500 mt-1">
              Data audit complete. Generated <strong className="font-bold">{engineResult.generatedInsightsCount}</strong> new state insights and <strong className="font-bold">{engineResult.generatedRecommendationsCount}</strong> target action recommendations.
            </p>
          </div>
        </div>
      )}

      {/* Main insights/recs grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Insights list */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-max">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-sky-500" />
                Current Business Insights ({insights.length})
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Automated findings on active transactions</p>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              ))}
            </div>
          ) : insights.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-12 text-center">
              No insights found. Click "Run Prescriptive Engine" above to parse transaction logs.
            </p>
          ) : (
            <div className="space-y-4">
              {insights.map((ins) => (
                <div 
                  key={ins.id}
                  className={`p-4 border rounded-2xl flex gap-3.5 items-start ${
                    ins.type === 'warning'
                      ? 'bg-rose-50/20 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20'
                      : ins.type === 'success'
                      ? 'bg-emerald-50/20 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20'
                      : 'bg-sky-50/20 border-sky-100 dark:bg-sky-500/5 dark:border-sky-500/20'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {ins.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                    ) : ins.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-sky-500" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{ins.title}</h4>
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-500 px-1.5 py-0.5 rounded-full uppercase shrink-0">
                        {ins.state}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ins.description}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Detected on {new Date(ins.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI recommendations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-max">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-500" />
                Strategic Prescriptions ({recs.length})
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Automated actionable mitigations</p>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
              ))}
            </div>
          ) : recs.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic py-12 text-center">
              No recommendations found. Run the engine to generate actions.
            </p>
          ) : (
            <div className="space-y-4">
              {recs.map((rec) => (
                <div 
                  key={rec.id}
                  className="p-4 bg-violet-50/20 border border-violet-100/60 dark:bg-violet-500/5 dark:border-violet-500/20 rounded-2xl flex gap-3.5 items-start"
                >
                  <div className="shrink-0 p-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{rec.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 uppercase ${
                        rec.impact === 'High'
                          ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-extrabold'
                          : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}>
                        {rec.impact} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {rec.description}
                    </p>
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-50 dark:border-slate-800/40">
                      <span className="text-[10px] text-slate-400">
                        Scope: <strong className="font-semibold text-slate-600 dark:text-slate-300">{rec.state === 'all' ? 'National portfolio' : rec.state}</strong>
                      </span>
                      <button className="text-[10px] text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1.5 font-bold cursor-pointer">
                        Implement Task
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
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
