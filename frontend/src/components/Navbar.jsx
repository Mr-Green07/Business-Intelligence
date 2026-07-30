import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, AppContext } from '../App';
import { Bell, Search, Sun, Moon, LogOut, ShieldAlert, BadgeInfo, CheckCircle, ChevronDown, Check } from 'lucide-react';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);
  const { theme, setTheme, notifications, unreadCount, markNotificationAsRead } = useContext(AppContext);
  
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    // Persist in backend
    const token = localStorage.getItem('token');
    fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ theme: nextTheme })
    }).catch(err => console.error(err));
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 md:px-6">
      
      {/* Left side: Hamburger Toggle & Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-800 w-64 border border-transparent dark:border-slate-700/40">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search records, states..."
            className="bg-transparent text-sm focus:outline-none w-full text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right side: Actions, Notifications, Profile */}
      <div className="flex items-center gap-4">
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent dark:border-slate-800"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent dark:border-slate-800"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden transform origin-top-right transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800">
                <h3 className="font-semibold text-slate-950 dark:text-white text-sm">Notifications</h3>
                <span className="text-xs text-sky-500 font-medium bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded-full">{unreadCount} Unread</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                    <p className="text-xs mt-1">All caught up! No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => notif.is_read === 0 && markNotificationAsRead(notif.id)}
                      className={`flex gap-3 p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${notif.is_read === 0 ? 'bg-sky-50/30 dark:bg-sky-500/5' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {notif.type === 'alert' ? (
                          <ShieldAlert className="h-5 w-5 text-red-500" />
                        ) : notif.type === 'milestone' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <BadgeInfo className="h-5 w-5 text-sky-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className={`text-xs font-semibold text-slate-900 dark:text-white truncate ${notif.is_read === 0 ? 'text-sky-700 dark:text-sky-400' : ''}`}>
                            {notif.title}
                          </h4>
                          {notif.is_read === 0 && (
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 block">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 text-center border-t border-slate-100 dark:border-slate-800">
                <Link
                  to="/settings"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  Configure Notification Settings
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-xl p-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all border border-transparent dark:border-slate-800"
          >
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran'}
              alt={user?.name}
              className="h-8 w-8 rounded-full ring-2 ring-slate-100 dark:ring-slate-800"
            />
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">{user?.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{user?.role}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden md:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden transform origin-top-right transition-all">
              <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-950 dark:text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user?.email}</p>
                <span className="inline-block text-[9px] font-semibold text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-500/10 px-2 py-0.5 rounded-full mt-2 border border-sky-100 dark:border-sky-500/10">
                  {user?.role}
                </span>
              </div>

              <div className="p-1.5 divide-y divide-slate-50 dark:divide-slate-800/40">
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    App Preferences
                  </Link>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
