import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../App';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Map, 
  Lightbulb, 
  Users, 
  UploadCloud, 
  Settings as SettingsIcon,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

export default function Sidebar({ open, setOpen }) {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Sales Summary', path: '/sales', icon: TrendingUp },
    { name: 'Regional Analytics', path: '/regions', icon: Map },
    { name: 'Insights & AI', path: '/insights', icon: Lightbulb },
    { name: 'Customer Analytics', path: '/customers', icon: Users },
    { name: 'Bulk Data Upload', path: '/data-upload', icon: UploadCloud },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <>
      {/* Mobile backdrop overlay - Shows when sidebar is OPEN on mobile/tablet. Clicking it SHRINKS/CLOSES the sidebar! */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 h-screen z-50 flex flex-col border-r border-slate-200/80 bg-slate-900 text-slate-400 transition-all duration-300 dark:border-slate-800 shrink-0
          ${open ? 'w-64' : 'w-20'} 
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            {open && (
              <span className="text-base font-bold text-white tracking-wide truncate">
                DecisionPilot
              </span>
            )}
          </div>
          
          {/* Shrink / Expand button: Visible on all devices (mobile, tablet, and desktop) for full flexibility! */}
          <button
            onClick={() => setOpen(!open)}
            className="flex rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
            title={open ? "Shrink Sidebar" : "Expand Sidebar"}
          >
            {open ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  // On mobile/tablet, close the sidebar automatically when a menu item is clicked
                  if (window.innerWidth < 1024) {
                    setOpen(false);
                  }
                }}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold tracking-wide transition-all cursor-pointer
                  ${isActive 
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/10 font-bold' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }
                `}
                title={!open ? item.name : ''}
              >
                <Icon className={`h-5 w-5 shrink-0 ${open ? '' : 'mx-auto'}`} />
                {open && <span className="truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card footer */}
        <div className="border-t border-slate-800 p-4 shrink-0 bg-slate-950/20">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Simran'}
              alt={user?.name}
              className="h-9 w-9 rounded-full ring-2 ring-slate-800 shrink-0"
            />
            {open && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-block text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-full truncate">
                    {user?.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
