import React, { useState, useEffect, useContext } from 'react';
import KPICard from './KPICard';
import { AuthContext } from '../../App';
import { IndianRupee, TrendingUp, ShoppingBag, Users, HeartHandshake, DollarSign } from 'lucide-react';

export default function KPISection() {
  const { token } = useContext(AuthContext);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/kpis', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch KPIs');
        return res.json();
      })
      .then(data => {
        setKpis(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 h-28">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-center text-sm text-red-600 dark:bg-red-950/20 dark:border-red-900/40">
        Error loading KPI Metrics: {error}
      </div>
    );
  }

  // Format numbers to Indian numbering format
  const formatIndianNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KPICard
        label="Total Revenue"
        value={formatIndianNumber(kpis.totalRevenue)}
        change={kpis.revenueGrowth}
        isPositive={kpis.revenueGrowth >= 0}
        suffix=" L"
        prefix="₹"
        icon={IndianRupee}
        color="sky"
      />
      <KPICard
        label="Avg Order Value"
        value={formatIndianNumber(kpis.averageOrderValue)}
        isPositive={true}
        prefix="₹"
        icon={TrendingUp}
        color="emerald"
      />
      <KPICard
        label="Total Orders"
        value={formatIndianNumber(kpis.totalOrders)}
        icon={ShoppingBag}
        color="indigo"
      />
      <KPICard
        label="Customer Base"
        value={formatIndianNumber(kpis.totalCustomers)}
        icon={Users}
        color="violet"
      />
      <KPICard
        label="Retention Rate"
        value={kpis.retentionRate}
        suffix="%"
        icon={HeartHandshake}
        color="amber"
      />
      <KPICard
        label="Growth Index"
        value={kpis.revenueGrowth}
        suffix="%"
        isPositive={kpis.revenueGrowth >= 0}
        icon={DollarSign}
        color="rose"
      />
    </div>
  );
}
