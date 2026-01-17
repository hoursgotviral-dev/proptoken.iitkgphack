import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
    <div className="premium-card p-8 border border-emerald-900/5 dark:border-white/5 transition-all">
      <div className="flex items-start justify-between mb-8">
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">{title}</p>
          <h3 className="text-3xl font-black text-emerald-950 dark:text-white tracking-tighter uppercase">{value}</h3>
        </div>
        <div className="p-3 bg-parchment-100 dark:bg-vault-950 rounded-lg border border-parchment-300 dark:border-vault-800">
          <Icon className="w-5 h-5 text-emerald-900 dark:text-emerald-500" />
        </div>
      </div>
      
      {change && (
        <div className="flex items-center gap-3">
          <div className={`flex items-center text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${positive ? 'bg-emerald-900/10 text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-500' : 'bg-red-900/10 text-red-900 dark:bg-red-500/10 dark:text-red-500'}`}>
            {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {change}
          </div>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">30D Delta</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;