import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import SalesTrend from '../components/salessummary/SalesTrend';
import CategoryBreakdown from '../components/salessummary/CategoryBreakdown';
import OrderStatus from '../components/salessummary/OrderStatus';
import RegionalSales from '../components/salessummary/RegionalSales';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X, ArrowDown } from 'lucide-react';

export default function SalesSummary() {
  const { token } = useContext(AuthContext);
  
  // Transaction table states
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loadingTable, setLoadingTable] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);

  // Filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const statesList = [
    'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh',
    'Delhi', 'West Bengal', 'Rajasthan', 'Punjab', 'Haryana',
    'Telangana', 'Kerala', 'Andhra Pradesh'
  ];

  const categoriesList = ['Electronics', 'Furniture', 'Clothing'];

  // Fetch sales records
  const fetchSalesRecords = () => {
    setLoadingTable(true);
    let url = `/api/sales?limit=${limit}&offset=${offset}`;
    if (fromDate) url += `&from=${fromDate}`;
    if (toDate) url += `&to=${toDate}`;
    if (selectedState) url += `&state=${selectedState}`;
    if (selectedCategory) url += `&category=${selectedCategory}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSales(data.items || []);
        setTotalSales(data.total || 0);
        setLoadingTable(false);
      })
      .catch(err => {
        console.error('Error fetching sales table:', err);
        setLoadingTable(false);
      });
  };

  useEffect(() => {
    fetchSalesRecords();
  }, [offset, fromDate, toDate, selectedState, selectedCategory, token]);

  // Handle filter clearing
  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedState('');
    setSelectedCategory('');
    setOffset(0);
  };

  const hasActiveFilters = fromDate || toDate || selectedState || selectedCategory;

  return (
    <div className="space-y-8">
      
      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SalesTrend />
        <CategoryBreakdown />
        <OrderStatus />
        <RegionalSales />
      </div>

      {/* Raw Data Table Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              Sales Transaction Journal
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Explore, search, and audit transaction items</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                showFilters || hasActiveFilters
                  ? 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-100 dark:border-sky-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700/80'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filters Panel dropdown */}
        {showFilters && (
          <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={e => { setFromDate(e.target.value); setOffset(0); }}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={e => { setToDate(e.target.value); setOffset(0); }}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">State Region</label>
              <select
                value={selectedState}
                onChange={e => { setSelectedState(e.target.value); setOffset(0); }}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none dark:text-white"
              >
                <option value="">All States</option>
                {statesList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Product Category</label>
              <select
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setOffset(0); }}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:outline-none dark:text-white"
              >
                <option value="">All Categories</option>
                {categoriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Sales Table list */}
        <div className="overflow-x-auto">
          {loadingTable ? (
            <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
              Running transaction queries...
            </div>
          ) : sales.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 italic">
              No matching records found. Try clearing filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4 text-right">Revenue (₹ Lakhs)</th>
                  <th className="py-3 px-4 text-right">Orders</th>
                  <th className="py-3 px-4 text-right">Units Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {sales.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/25 transition-colors">
                    <td className="py-3.5 px-4 font-medium">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.state}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.category === 'Electronics'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400'
                          : item.category === 'Furniture'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                          : 'bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-100">{item.product_name}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">₹{item.revenue} L</td>
                    <td className="py-3.5 px-4 text-right">{item.orders}</td>
                    <td className="py-3.5 px-4 text-right font-medium text-slate-500">{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination bar */}
        {!loadingTable && sales.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Showing <strong className="font-bold text-slate-800 dark:text-white">{offset + 1}</strong> to <strong className="font-bold text-slate-800 dark:text-white">{offset + sales.length}</strong> of <strong className="font-bold text-slate-800 dark:text-white">{totalSales}</strong> journal rows
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
                disabled={offset + limit >= totalSales}
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
