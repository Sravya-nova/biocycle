import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'emerald' | 'mint' | 'amber' | 'blue';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'emerald'
}) => {
  const borderColors = {
    emerald: 'border-emerald-700/40 hover:border-emerald-500/60',
    mint: 'border-teal-700/40 hover:border-teal-500/60',
    amber: 'border-amber-700/40 hover:border-amber-500/60',
    blue: 'border-blue-700/40 hover:border-blue-500/60'
  };

  const iconBg = {
    emerald: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50',
    mint: 'bg-teal-950/80 text-teal-300 border border-teal-800/50',
    amber: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
    blue: 'bg-blue-950/80 text-blue-400 border border-blue-800/50'
  };

  return (
    <div className={`glass-panel p-5 transition-all duration-300 ${borderColors[accentColor]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline space-x-1.5 mt-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
            {unit && <span className="text-sm font-semibold text-emerald-300/80">{unit}</span>}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconBg[accentColor]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
            trend.isPositive ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/40' : 'bg-red-900/50 text-red-300 border border-red-700/40'
          }`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};
