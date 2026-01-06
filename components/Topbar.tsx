
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Bell, Search, LogOut, Settings, User, Sun, Moon, Wallet as WalletIcon, Loader2, Zap } from 'lucide-react';
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
    <header className="h-24 bg-white dark:bg-slate-900 border-b-2 border-slate-100 dark:border-slate-800 flex flex-col sticky top-0 z-30 transition-colors duration-200">
      {/* Activity Ticker */}
      <div className="h-8 bg-slate-900 dark:bg-black text-white flex items-center overflow-hidden border-b-2 border-indigo-600/30 relative">
        <div className="flex items-center gap-4 bg-indigo-600 px-4 h-full z-20 relative">
          <Zap className="w-3 h-3 fill-white" />
          <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Live Ledger</span>
          {/* Angle cut-off for the label */}
          <div className="absolute top-0 -right-4 h-full w-4 bg-indigo-600 [clip-path:polygon(0_0,0_100%,100%_0)]"></div>
        </div>
        
        <div className="flex-1 marquee-container relative h-full">
          <div className="absolute inset-y-0 whitespace-nowrap animate-marquee flex items-center gap-16 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <span>[PLOT-001] Verified by 0x71...976f</span>
            <span className="text-emerald-500">₹8,50,000 Liquidated</span>
            <span>New Asset Minted: Bangalore Heritage</span>
            <span className="text-indigo-400">P2P Lending Vault Active</span>
            <span>[PLOT-003] Yield Payout Distributed</span>
            <span>Identity Verified: User #8492</span>
            {/* Duplicate for seamless loop if needed, but simple marquee works fine here */}
            <span>[PLOT-001] Verified by 0x71...976f</span>
            <span className="text-emerald-500">₹8,50,000 Liquidated</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-between px-8">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg w-full max-w-md border-2 border-transparent focus-within:border-indigo-600 transition-all">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <input 
            type="text" 
            placeholder="Search global assets..." 
            className="bg-transparent border-none focus:ring-0 text-sm ml-3 w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium dark:text-slate-200 outline-none"
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => connectWallet()}
            disabled={isConnecting}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
              shortAddress 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800' 
              : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <WalletIcon className="w-4 h-4" />
            )}
            {shortAddress || 'Connect Wallet'}
          </button>

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 transition-colors p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-transparent hover:border-indigo-600/20"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-4 w-56 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 p-2 shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b-2 border-slate-50 dark:border-slate-700 mb-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={() => { navigate('/account'); setShowMenu(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" /> Account
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <div className="h-[2px] bg-slate-50 dark:bg-slate-700 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Topbar;
