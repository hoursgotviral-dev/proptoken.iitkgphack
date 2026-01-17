import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  RefreshCcw, 
  CreditCard, 
  UserCircle,
  Building2,
  Sparkles,
  PlusCircle,
  BarChart3,
  ShoppingBag,
  Layers,
  ArrowUpRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const investorRails = [
    { name: 'Browse Plots', path: '/marketplace', icon: ShoppingBag },
    { name: 'Withdraw / Sell', path: '/swap', icon: ArrowUpRight },
    { name: 'Wallet Credits', path: '/pay', icon: CreditCard },
    { name: 'Smart Advisor', path: '/ai', icon: Sparkles },
  ];

  const builderRails = [
    { name: 'List Property', path: '/builder/list', icon: PlusCircle },
    { name: 'Verify Asset', path: '/verify', icon: ShieldCheck },
    { name: 'Tokenize', path: '/builder/tokenize', icon: Layers },
    { name: 'Yield Stats', path: '/yield', icon: BarChart3 },
    { name: 'PropAI Help', path: '/ai', icon: Sparkles },
  ];

  const mainItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/account', icon: UserCircle },
  ];

  const railItems = user?.role === 'BUILDER' ? builderRails : investorRails;

  return (
    <aside className="w-64 bg-white dark:bg-obsidian-950 hidden md:flex flex-col h-screen sticky top-0 transition-all border-r border-slate-100 dark:border-white/5 shadow-sm z-20">
      <div className="p-8 border-b border-slate-50 dark:border-white/5">
        <Link to="/" className="flex items-center gap-3 text-fintech-purple-600 dark:text-neon-emerald group">
          <div className="w-10 h-10 bg-fintech-purple-600 dark:bg-neon-emerald rounded-xl flex items-center justify-center text-white dark:text-obsidian-950 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none dark:text-white">PropToken</span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-neon-emerald/50 uppercase tracking-widest mt-1">Daily Wealth</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-10 scrollbar-hide">
        <section>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-4">Portfolio</p>
          <nav className="space-y-1.5">
            {mainItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-3 rounded-fintech transition-all group ${
                    isActive 
                      ? 'bg-fintech-purple-50 dark:bg-neon-emerald/10 text-fintech-purple-600 dark:text-neon-emerald' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-fintech-purple-600 dark:hover:text-neon-emerald hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-fintech-purple-600 dark:text-neon-emerald' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </section>

        <section>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4 mb-4">
            {user?.role === 'BUILDER' ? 'Builder Hub' : 'Invest'}
          </p>
          <nav className="space-y-1.5">
            {railItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-5 py-3 rounded-fintech transition-all group ${
                    isActive 
                      ? 'bg-fintech-purple-50 dark:bg-neon-emerald/10 text-fintech-purple-600 dark:text-neon-emerald' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-fintech-purple-600 dark:hover:text-neon-emerald hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-fintech-purple-600 dark:text-neon-emerald' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </section>
      </div>

      <div className="p-6 mt-auto">
        <div className="p-4 rounded-fintech bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-neon-emerald/20 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-neon-emerald" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Verified & Safe</span>
            <span className="text-[10px] text-slate-400">Trusted by 10k+</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;