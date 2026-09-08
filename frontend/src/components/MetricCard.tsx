import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendGood?: boolean; // If true, up is good; if false, up is bad (e.g., waiting time)
  icon: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'indigo' | 'amber' | 'emerald' | 'rose';
  alertBadge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  change,
  trend,
  trendGood = true,
  icon,
  variant = 'cyan',
  alertBadge
}) => {
  const variantGradients = {
    cyan: 'from-cyan-500/15 via-transparent to-transparent text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40',
    purple: 'from-purple-500/15 via-transparent to-transparent text-purple-400 border-purple-500/20 group-hover:border-purple-500/40',
    indigo: 'from-indigo-500/15 via-transparent to-transparent text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/40',
    amber: 'from-amber-500/15 via-transparent to-transparent text-amber-400 border-amber-500/20 group-hover:border-amber-500/40',
    emerald: 'from-emerald-500/15 via-transparent to-transparent text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40',
    rose: 'from-rose-500/15 via-transparent to-transparent text-rose-400 border-rose-500/20 group-hover:border-rose-500/40'
  };

  const getTrendColor = () => {
    if (!trend || trend === 'neutral') return 'text-slate-400 bg-slate-800/50';
    const isPositive = (trend === 'up' && trendGood) || (trend === 'down' && !trendGood);
    return isPositive
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className={`relative group p-5 rounded-2xl border glass-panel transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 overflow-hidden bg-gradient-to-br ${variantGradients[variant]}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-current opacity-5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium tracking-wider text-slate-400 dark:text-slate-400 uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              {value}
            </span>
            {alertBadge && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                {alertBadge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl border backdrop-blur-md bg-slate-800/60 dark:bg-slate-900/60 border-slate-700/50 text-inherit shadow-inner`}>
          {icon}
        </div>
      </div>

      {(change || subtext) && (
        <div className="mt-4 pt-3 border-t border-slate-800/40 dark:border-slate-800/60 flex items-center justify-between text-xs">
          {change && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium ${getTrendColor()}`}>
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
          {subtext && (
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px] text-right">
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
