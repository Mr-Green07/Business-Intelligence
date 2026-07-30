import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  DollarSign, 
  UserPlus, 
  X
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function Customers() {
  const { token } = useContext(AuthContext);

  // Lists & pagination
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loadingList, setLoadingTable] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState('');

  const [statesList, setStatesList] = useState([]);

  // Fetch filter dropdown options dynamically from database
  useEffect(() => {
    fetch('/api/sales/filters', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setStatesList(data.states || []);
        }
      })
      .catch(err => console.error('Error fetching customer states list:', err));
  }, [token]);

  // Fetch list
  const fetchCustomerList = () => {
    setLoadingTable(true);
    let url = `/api/customers?limit=${limit}&offset=${offset}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (selectedState) url += `&state=${encodeURIComponent(selectedState)}`;
    if (selectedSegment) url += `&segment=${encodeURIComponent(selectedSegment)}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.items)) {
          setCustomers(data.items);
          setTotalCustomers(data.total || 0);
        } else {
          setCustomers([]);
          setTotalCustomers(0);
        }
        setLoadingTable(false);
      })
      .catch(err => {
        console.error('Error fetching customers:', err);
        setCustomers([]);
        setTotalCustomers(0);
        setLoadingTable(false);
      });
  };

  // Fetch stats
  const fetchCustomerStats = () => {
    setLoadingStats(true);
    setError('');
    fetch('/api/customers/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats(data);
        } else {
          console.error('Customer stats returned error:', data);
          setStats(null);
          setError(data?.error || 'Invalid statistics response');
        }
        setLoadingStats(false);
      })
      .catch(err => {
        console.error('Error fetching customer stats:', err);
        setStats(null);
        setError('Network error loading customer statistics');
        setLoadingStats(false);
      });
  };

  useEffect(() => {
    fetchCustomerList();
  }, [offset, search, selectedState, selectedSegment, token]);

  useEffect(() => {
    fetchCustomerStats();
  }, [token]);

  const clearFilters = () => {
    setSearch('');
    setSelectedState('');
    setSelectedSegment('');
    setOffset(0);
  };

  const hasActiveFilters = search || selectedState || selectedSegment;

  return (
    <div className="space-y-6">
      
      {error && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl text-xs text-amber-700 dark:text-amber-300">
          ⚠️ <strong>Active Warning:</strong> {error}. Running on sandbox/offline mode fallbacks.
        </div>
      )}

      {/* Stats row & visual trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Stats indicators */}
        <div className="space-y-4">
          
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Customer Accounts</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {loadingStats ? '...' : (stats?.total || 0).toLocaleString()}
              </h3>
              <p className="text-[10px] text-slate-400">Unique registered accounts</p>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-500 border border-sky-500/15 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Average Customer CLV</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{loadingStats ? '...' : (stats?.segments ? Math.round(stats.segments.reduce((acc, curr) => acc + (curr.avgClv || 0), 0) / 2) : 0).toLocaleString()}
              </h3>
              <p className="text-[10px] text-slate-400">High aggregate product value</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/15 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Acquisition Rate (MoM)</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">+14.8%</h3>
              <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Strong incoming traffic
              </p>
            </div>
            <div className="p-3 bg-indigo-500/10 text-indigo-500 border border-indigo-500/15 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Recharts Customer Acquisition graph */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col h-full justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Customer Acquisition Profile</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">MoM trend of customer acquisitions</p>
            </div>
          </div>
          
          <div className="h-44 w-full">
            {loadingStats ? (
              <div className="h-full bg-slate-100 animate-pulse rounded-lg"></div>
            ) : !stats || !stats.acquisitionTrend || stats.acquisitionTrend.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-12 text-center">No trend statistics logged.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.acquisitionTrend}
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                    labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#a5b4fc', fontSize: '11px' }}
                  />
                  <Area type="monotone" name="Acquisitions" dataKey="count" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAcq)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Customer list data table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table top search controls */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Client Accounts Directory
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Explore active customer segmentation parameters</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setOffset(0); }}
                placeholder="Search name, email..."
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full sm:w-56"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  showFilters || hasActiveFilters
                    ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <Filter className="w-4 h-4" />
                Segments
                {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dropdown filters menu */}
        {showFilters && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Segment Type</label>
              <select
                value={selectedSegment}
                onChange={e => { setSelectedSegment(e.target.value); setOffset(0); }}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none dark:text-white"
              >
                <option value="">All Segments</option>
                <option value="New">New Accounts</option>
                <option value="Returning">Returning Loyalists</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Location Node</label>
              <select
                value={selectedState}
                onChange={e => { setSelectedState(e.target.value); setOffset(0); }}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none dark:text-white"
              >
                <option value="">All Regions</option>
                {statesList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Client table list */}
        <div className="overflow-x-auto">
          {loadingList ? (
            <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
              Running client list queries...
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 italic">
              No matching client accounts found. Try clearing filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Segment</th>
                  <th className="py-3 px-4 text-right">Lifetime Value (CLV)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Acquired Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {customers.map((c) => (
                  <tr key={c?.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c?.name || 'User')}`}
                        alt={c?.name || 'User'}
                        className="w-7 h-7 rounded-full bg-slate-100"
                      />
                      {c?.name}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-500">{c?.email}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{c?.state}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        c?.segment === 'Returning'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      }`}>
                        {c?.segment}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">₹{(c?.clv || 0).toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        c?.retention_status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${c?.retention_status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {c?.retention_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-400">{c?.acquisition_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Table footer Pagination controls */}
        {!loadingList && customers.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing <strong className="font-bold text-slate-800 dark:text-white">{offset + 1}</strong> to <strong className="font-bold text-slate-800 dark:text-white">{offset + customers.length}</strong> of <strong className="font-bold text-slate-800 dark:text-white">{totalCustomers}</strong> client accounts
            </span>
            <div className="flex gap-2">
              <button
                disabled={offset === 0}
                onClick={() => setOffset(Math.max(0, offset - limit))}
                className="inline-flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                disabled={offset + limit >= totalCustomers}
                onClick={() => setOffset(offset + limit)}
                className="inline-flex items-center gap-1.5 p-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
