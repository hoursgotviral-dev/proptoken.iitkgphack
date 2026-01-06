
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  RefreshCcw, 
  CreditCard, 
  UserCircle,
  Building2,
  Sparkles
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const railItems = [
    { name: '1. Verify Asset', path: '/verify', icon: ShieldCheck },
    { name: '2. Fractionalize', path: '/fractional', icon: Layers },
    { name: '3. Swap to INR', path: '/swap', icon: RefreshCcw },
    { name: '4. Pay & Credit', path: '/pay', icon: CreditCard },
    { name: 'PropAI Analyst', path: '/ai', icon: Sparkles },
  ];

  const mainItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Yield Analytics', path: '/yield', icon: TrendingUp },
    { name: 'Account', path: '/account', icon: UserCircle },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800/50 hidden md:flex flex-col h-screen sticky top-0 transition-colors">
      <div className="p-8">
        <Link to="/" className="flex items-center gap-3 text-indigo-600 font-bold text-2xl tracking-tight">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="dark:text-indigo-400">PropToken</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-4">Navigation</p>
          <nav className="space-y-1">
            {mainItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold' 
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-4">Protocol Rails</p>
          <nav className="space-y-1">
            {railItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive && item.name.includes('AI') ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-6">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Polygon Network</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Sync Complete</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
