
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon: LucideIcon;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {change}
          </div>
        )}
      </div>
      <p className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
    </div>
  );
};

export default StatCard;
