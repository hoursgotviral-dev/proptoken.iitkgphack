
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Search, LogOut, Settings, User, Sun, Moon, Wallet as WalletIcon, Loader2, Sparkles } from 'lucide-react';
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
    <header className="h-20 bg-white dark:bg-slate-900 border-b-2 border-slate-900 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="flex items-center bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl w-64 border-2 border-slate-900 dark:border-slate-700 focus-within:border-indigo-600 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            className="bg-transparent border-none focus:ring-0 text-[10px] ml-3 w-full placeholder-slate-400 font-black uppercase dark:text-slate-200 outline-none"
          />
        </div>

        {/* Fixed Live Ledger Ticker */}
        <div className="hidden lg:flex items-center h-8 bg-slate-900 dark:bg-black rounded-lg overflow-hidden relative w-96 border border-slate-700">
          <div className="z-20 bg-indigo-600 h-full px-3 flex items-center text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap border-r border-slate-700">
            <Sparkles className="w-3 h-3 mr-1.5 fill-white" /> Live Ledger
          </div>
          <div className="flex-1 relative h-full overflow-hidden flex items-center">
            <div className="animate-marquee-ledger whitespace-nowrap text-[9px] font-black text-indigo-400 uppercase tracking-widest absolute py-1">
              • [BLOCK 18,294,002] MINTED 450 UNITS OF HERITAGE ACRES • SWAP COMPLETED: 1,200 INR TO PLOT-001 • KYC VERIFIED: USER_0x9A...F2 • NEW YIELD SETTLEMENT: ₹12,400 DISBURSED • [BLOCK 18,294,003] MINING ASSET LIQUIDITY •
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button 
          onClick={() => connectWallet()}
          disabled={isConnecting}
          className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
            shortAddress 
            ? 'bg-emerald-100 border-slate-900 text-slate-900 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800' 
            : 'bg-white border-slate-900 text-slate-900 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200'
          }`}
        >
          {isConnecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <WalletIcon className="w-3.5 h-3.5" />
          )}
          {shortAddress || 'Connect Wallet'}
        </button>

        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="text-slate-900 dark:text-slate-200 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-2 border-transparent hover:border-slate-900"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg border-b-4 border-slate-900">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 p-2 shadow-xl overflow-hidden">
              <div className="px-4 py-3 border-b-2 border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                <p className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">{user?.email}</p>
              </div>
              <button 
                onClick={() => { navigate('/account'); setShowMenu(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <User className="w-4 h-4" /> Account
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
              <div className="h-[2px] bg-slate-100 dark:bg-slate-800 my-1"></div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
