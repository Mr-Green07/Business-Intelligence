import React, { createContext, useContext, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SalesSummary from './pages/SalesSummary';
import Insights from './pages/Insights';
import Regions from './pages/Regions';
import Customers from './pages/Customers';
import DataUpload from './pages/DataUpload';
import Settings from './pages/Settings';
import { Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';

// Create Contexts
export const AuthContext = createContext(null);
export const AppContext = createContext(null);

// Login Screen Component (Moved outside App to follow Rules of Hooks and standard best practices)
const LoginScreen = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e293b_0%,#0f172a_100%)] z-0"></div>
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-2xl p-8 z-10 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-sky-500/10 rounded-2xl text-sky-400 mb-3 border border-sky-500/20">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DecisionPilot</h1>
          <p className="text-slate-400 text-sm mt-1">Enterprise Business Intelligence Dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-sm text-red-200">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="simran.yadav@businessiq.com"
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <span className="text-xs text-slate-500">Hint: admin123</span>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-sky-500/50 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-sky-500/10 flex items-center justify-center gap-2 cursor-pointer mt-8"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 text-center">
          <p className="text-xs text-slate-500">Demo User Credentials:</p>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-700/30">
              <p className="text-[10px] font-semibold text-slate-400">Admin</p>
              <p className="text-[9px] text-slate-500 overflow-hidden text-ellipsis">admin@businessiq.com</p>
            </div>
            <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-700/30">
              <p className="text-[10px] font-semibold text-slate-400">Analyst</p>
              <p className="text-[9px] text-slate-500 overflow-hidden text-ellipsis">analyst@businessiq.com</p>
            </div>
            <div className="bg-slate-900/40 p-2 rounded-lg border border-slate-700/30">
              <p className="text-[10px] font-semibold text-slate-400">Viewer</p>
              <p className="text-[9px] text-slate-500 overflow-hidden text-ellipsis">viewer@businessiq.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Declared unconditionally at the top of the component!

  // Sync token and user with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token, user]);

  // Fetch notifications & settings when logged in
  useEffect(() => {
    if (!token) return;

    // Fetch initial settings
    fetch('/api/settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.theme) {
          setTheme(data.theme);
        }
      })
      .catch(err => console.error('Error fetching settings:', err));

    // Fetch initial notifications
    fetch('/api/notifications', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(data.filter(n => n.is_read === 0).length);
        }
      })
      .catch(err => console.error('Error fetching notifications:', err));

  }, [token]);

  // Handle Theme switching
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Real-time WebSocket connection
  useEffect(() => {
    if (!token) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/notifications`;
    
    let ws;
    let reconnectTimeout;

    function connect() {
      console.log('Connecting to WebSocket notifications server...');
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NOTIFICATION') {
            const newNotif = payload.data;
            setNotifications(prev => [newNotif, ...prev]);
            setUnreadCount(prev => prev + 1);
            showToast(newNotif);
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed. Attempting reconnect in 5s...');
        reconnectTimeout = setTimeout(connect, 5000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        ws.close();
      };
    }

    connect();

    return () => {
      if (ws) ws.close();
      clearTimeout(reconnectTimeout);
    };
  }, [token]);

  const showToast = (notif) => {
    setToast(notif);
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const login = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setToken(data.token);
    setUser(data.user);
    navigate('/');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    }
    setToken('');
    setUser(null);
    navigate('/login');
  };

  const markNotificationAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  };

  if (!token) {
    return (
      <AuthContext.Provider value={{ token, user, login, logout }}>
        <Routes>
          <Route path="/login" element={<LoginScreen login={login} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      <AppContext.Provider value={{
        theme,
        setTheme,
        notifications,
        setNotifications,
        unreadCount,
        setUnreadCount,
        markNotificationAsRead
      }}>
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          
          {/* Sidebar */}
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

          {/* Main Layout Container */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            
            {/* Top Navigation */}
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* Dynamic Dashboard Page Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-4 md:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sales" element={<SalesSummary />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/regions" element={<Regions />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/data-upload" element={<DataUpload />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>

          {/* Real-time Toast Notification Alert */}
          {toast && (
            <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 p-4 transform animate-bounce flex gap-3.5">
              {toast.type === 'alert' ? (
                <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              ) : toast.type === 'milestone' ? (
                <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
              ) : (
                <Info className="w-6 h-6 text-sky-500 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{toast.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{toast.message}</p>
              </div>
            </div>
          )}
        </div>
      </AppContext.Provider>
    </AuthContext.Provider>
  );
}
