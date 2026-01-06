
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
  ChevronRight,
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
    <aside className="w-64 bg-white dark:bg-slate-900 border-r-2 border-slate-100 dark:border-slate-800 hidden md:flex flex-col h-screen sticky top-0 transition-colors duration-200">
      <div className="p-8 flex items-center gap-3 text-indigo-600 font-extrabold text-2xl tracking-tighter">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Building2 className="w-6 h-6" />
        </div>
        <span className="dark:text-indigo-400">PropToken</span>
      </div>

      <div className="px-6 mb-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2">Main</p>
        <nav className="space-y-1">
          {mainItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="font-bold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6">
        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-4 mb-2">Value Rail</p>
        <nav className="space-y-1">
          {railItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive && item.name.includes('AI') ? 'animate-pulse' : ''}`} />
                  <span className="font-bold text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-xl p-5 text-white border-b-4 border-indigo-600">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Status</p>
          <p className="text-sm font-black">PRO INVESTOR</p>
          <div className="w-full bg-slate-800 dark:bg-slate-700 h-1.5 rounded-full mt-3">
            <div className="bg-indigo-500 h-full w-2/3 rounded-full"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
