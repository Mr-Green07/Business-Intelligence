import React, { useState, useEffect, useContext } from 'react';
import { AuthContext, AppContext } from '../App';
import { 
  User, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  Sparkles, 
  Lock, 
  History,
  CheckCircle,
  Eye,
  Edit3,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function Settings() {
  const { token, user } = useContext(AuthContext);
  const { theme, setTheme } = useContext(AppContext);

  // Settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoInsights, setAutoInsights] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Activity logs
  const [activities, setActivities] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);

  useEffect(() => {
    // Fetch user settings
    fetch('/api/settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setEmailAlerts(data.email_alerts);
        setAutoInsights(data.auto_insight_generation);
      })
      .catch(err => console.error('Error fetching settings:', err));

    // Fetch user activity logs
    fetch('/api/users/activity', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setActivities(data || []);
        setLoadingLogs(false);
      })
      .catch(err => {
        console.error('Error fetching activity logs:', err);
        setLoadingLogs(false);
      });
  }, [token]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    saveSettings(newTheme, emailAlerts, autoInsights);
  };

  const handleToggleAlerts = () => {
    const nextAlerts = !emailAlerts;
    setEmailAlerts(nextAlerts);
    saveSettings(theme, nextAlerts, autoInsights);
  };

  const handleToggleInsights = () => {
    const nextInsights = !autoInsights;
    setAutoInsights(nextInsights);
    saveSettings(theme, emailAlerts, nextInsights);
  };

  const saveSettings = (currentTheme, alerts, insights) => {
    setSavingSettings(true);
    setSaveSuccess(false);

    fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        theme: currentTheme,
        email_alerts: alerts,
        auto_insight_generation: insights
      })
    })
      .then(res => res.json())
      .then(() => {
        setSavingSettings(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      })
      .catch(err => {
        console.error('Error updating settings:', err);
        setSavingSettings(false);
      });
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-sky-500" />
          User & App Preferences
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Manage visual styling, alert thresholds, profile credentials, and audit operational activity trails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Preferences & Roles */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Visual Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-800/40 pb-4">
              Dashboard Configurations
            </h3>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Settings saved and sync'd with database!
              </div>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Color Palette Theme</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Toggle light or dark screen palettes</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    theme === 'light' 
                      ? 'bg-white text-sky-500 shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    theme === 'dark' 
                      ? 'bg-slate-900 text-sky-400 shadow-md' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  Dark
                </button>
              </div>
            </div>

            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-4">
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Daily Digest Email Alerts</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Receive summarized business alerts in your inbox</p>
              </div>
              <button
                onClick={handleToggleAlerts}
                className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${emailAlerts ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {/* AI Insights Engine Toggle */}
            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-4">
              <div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Automated Insight Refreshes</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Let AI engine automatically generate findings after uploads</p>
              </div>
              <button
                onClick={handleToggleInsights}
                className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${autoInsights ? 'bg-sky-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${autoInsights ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </button>
            </div>

          </div>

          {/* Role Explanations */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-800/40 pb-4">
              Role-Based Access Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Admin Card */}
              <div className="p-4 rounded-xl border border-sky-100 dark:border-sky-500/10 bg-sky-50/20 dark:bg-sky-500/5 space-y-2">
                <span className="text-[9px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  Admin Privilege
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Full Database Powers</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Permissions to bulk import sales files, run the insights generator, read log data, and update user preferences.
                </p>
              </div>

              {/* Analyst Card */}
              <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/10 bg-indigo-50/20 dark:bg-indigo-500/5 space-y-2">
                <span className="text-[9px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                  <Edit3 className="w-3.5 h-3.5" />
                  Analyst Privilege
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Trigger AI Audits</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Permissions to read all metrics, run the insights engine, filter transactions, and configure personal UI modes.
                </p>
              </div>

              {/* Viewer Card */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 space-y-2">
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Viewer Privilege
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Read-Only Access</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Permissions to view national KPIs, browse sales summaries, read map analytics, and receive alert digests.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Profile Card & Recent Activity log */}
        <div className="space-y-6">
          
          {/* User Account Profile Info */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center space-y-4">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran'}
              alt={user?.name}
              className="w-20 h-20 rounded-full mx-auto ring-4 ring-slate-100 dark:ring-slate-800"
            />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
              <div className="inline-block text-[9px] font-bold text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10 px-2.5 py-1 rounded-full mt-2 border border-sky-100/50">
                {user?.role} Access Level
              </div>
            </div>
          </div>

          {/* Detailed chron history activities */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-[350px]">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-400" />
              Chronological Audit Log
            </h3>

            {loadingLogs ? (
              <div className="h-full bg-slate-100 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40 pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="py-3 text-xs flex gap-2.5 items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 dark:text-slate-200 leading-tight">
                        <strong className="font-bold text-slate-900 dark:text-white">{act.user_name}</strong>: {act.action}
                      </p>
                      <p className="text-[10px] text-slate-400 leading-relaxed truncate mt-0.5">{act.details}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(act.timestamp).toLocaleDateString([], { dateStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
