import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function KPICard({ label, value, change, isPositive, prefix = '', suffix = '', icon: Icon, color = 'sky' }) {
  const colorMaps = {
    sky: 'text-sky-500 bg-sky-50 dark:bg-sky-500/10 border-sky-100 dark:border-sky-500/20',
    emerald: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
    indigo: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20',
    violet: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20'
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between transition-all hover:shadow-md">
      <div className="space-y-2 min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
          {prefix}{value}{suffix}
        </h3>
        {change !== undefined && (
          <div className="flex items-center gap-1">
            <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              isPositive 
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
            }`}>
              {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(change)}%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">vs prev month</span>
          </div>
        )}
      </div>

      <div className={`rounded-xl p-3 border shrink-0 ${colorMaps[color]}`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
    </div>
  );
}
