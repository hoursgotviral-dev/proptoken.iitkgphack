import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Search, LogOut, Settings, User, Sun, Moon, Wallet as WalletIcon, Loader2, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Topbar: React.FC = () => {
  const { user, signOut, connectWallet, isConnecting } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  const shortAddress = user?.walletAddress 
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : null;

  return (
    <header className="h-20 bg-white/80 dark:bg-obsidian-950/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 transition-all">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="w-full bg-slate-50 dark:bg-white/5 pl-11 pr-5 py-2.5 rounded-full border-none text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fintech-purple-600/10 dark:focus:ring-neon-emerald/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => connectWallet()}
          disabled={isConnecting}
          className={`hidden md:flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 border ${
            shortAddress 
            ? 'bg-fintech-purple-50 dark:bg-neon-emerald/10 border-fintech-purple-100 dark:border-neon-emerald/20 text-fintech-purple-600 dark:text-neon-emerald' 
            : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-fintech-purple-600/30'
          }`}
        >
          {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <WalletIcon className="w-4 h-4" />}
          {shortAddress || 'Activate App'}
        </button>

        <div className="flex items-center gap-1">
          <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-fintech-purple-600 dark:hover:text-neon-emerald transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-obsidian-950"></span>
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-fintech-purple-600 dark:hover:text-neon-emerald transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="relative ml-2">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-1 pl-3 rounded-full border border-slate-200 dark:border-white/10 hover:border-fintech-purple-600 dark:hover:border-neon-emerald transition-all bg-white dark:bg-white/5 shadow-sm"
          >
            <span className="hidden lg:block text-xs font-bold text-slate-700 dark:text-slate-300 mr-1">{user?.name.split(' ')[0]}</span>
            <div className="w-8 h-8 rounded-full bg-fintech-purple-600 dark:bg-neon-emerald flex items-center justify-center text-white dark:text-obsidian-950 font-bold text-xs">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-obsidian-900 rounded-fintech border border-slate-100 dark:border-white/10 p-2 shadow-xl animate-fintech-fade z-50 overflow-hidden">
              <div className="px-4 py-4 border-b border-slate-50 dark:border-white/5 mb-1">
                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="space-y-0.5">
                <button 
                  onClick={() => { navigate('/account'); setShowMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors group"
                >
                  <User className="w-4 h-4 group-hover:text-fintech-purple-600 dark:group-hover:text-neon-emerald" /> Account
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg transition-colors group">
                  <Settings className="w-4 h-4 group-hover:text-fintech-purple-600 dark:group-hover:text-neon-emerald" /> Security
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;