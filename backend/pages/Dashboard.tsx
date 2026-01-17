
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { db } from '../db.ts';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Building2, 
  Wallet as WalletIcon, 
  Layers, 
  ChevronRight, 
  PlusCircle, 
  ShoppingBag, 
  ArrowUpRight, 
  ShieldCheck,
  History,
  Clock,
  LayoutDashboard,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedValue: React.FC<{ value: number; prefix?: string }> = ({ value, prefix = '₹' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{displayValue.toLocaleString()}</span>;
};

const Dashboard: React.FC = () => {
  const { wallet, user } = useAuth();
  const navigate = useNavigate();
  const assets = db.getAssets();

  const ownedAssets = useMemo(() => {
    return assets.filter(asset => (wallet.tokensByAsset[asset.id] || 0) > 0);
  }, [wallet.tokensByAsset, assets]);

  const totalFractionsOwned = useMemo(() => {
    return (Object.values(wallet.tokensByAsset) as number[]).reduce((a, b) => a + b, 0);
  }, [wallet.tokensByAsset]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10 pb-20 px-1 md:px-4"
    >
      {/* Hero Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-neon-emerald/10 border border-emerald-100 dark:border-neon-emerald/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-700 dark:text-neon-emerald uppercase tracking-wider">Protocol Optimized</span>
          </div>
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-1">Portfolio Valuation</p>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter">
              <AnimatedValue value={wallet.totalInvested} />
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white dark:bg-obsidian-900 p-4 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm">
          <div className="text-right pr-4 border-r border-slate-100 dark:border-white/5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Available Credits</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">₹{wallet.stablecoinBalance.toLocaleString()}</p>
          </div>
          <button 
            onClick={() => navigate('/pay')}
            className="w-12 h-12 bg-fintech-purple-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 rounded-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Growth Delta', value: '+14.2%', icon: TrendingUp, color: 'text-indigo-600 dark:text-neon-indigo', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
          { label: 'Holdings', value: ownedAssets.length.toString(), icon: Building2, color: 'text-emerald-600 dark:text-neon-emerald', bg: 'bg-emerald-50 dark:bg-neon-emerald/10' },
          { label: 'Total Units', value: totalFractionsOwned.toString(), icon: Layers, color: 'text-fintech-purple-600 dark:text-indigo-400', bg: 'bg-fintech-purple-50 dark:bg-indigo-500/10' },
          { label: 'Yield Est.', value: '11.4%', icon: Sparkles, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="fintech-card p-8 flex flex-col justify-between h-40">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* Assets Section */}
        <motion.div variants={itemVariants} className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <Building2 className="w-6 h-6 text-slate-400" /> Active Registry
            </h2>
            <button onClick={() => navigate('/marketplace')} className="text-xs font-bold text-fintech-purple-600 dark:text-neon-emerald flex items-center gap-1 hover:underline">
              Browse All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {ownedAssets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ownedAssets.map((asset) => {
                const tokens = wallet.tokensByAsset[asset.id] || 0;
                return (
                  <div key={asset.id} className="fintech-card group overflow-hidden border-2 border-transparent hover:border-fintech-purple-600/20 dark:hover:border-neon-emerald/30">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={asset.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={asset.name} />
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/95 dark:bg-obsidian-900/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-neon-emerald" />
                          <span className="text-[9px] font-black text-slate-800 dark:text-white uppercase">Verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-xl text-slate-900 dark:text-white">{asset.name}</h3>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5" /> Est. {asset.yieldPercent}% Annual Yield
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</p>
                          <p className="text-lg font-black text-fintech-purple-600 dark:text-neon-emerald">{tokens} Units</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => navigate(`/property/${asset.id}`)}
                          className="flex-1 py-3 bg-slate-900 dark:bg-white dark:text-obsidian-950 text-white rounded-full font-bold text-[11px] uppercase tracking-widest transition-opacity hover:opacity-90"
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => navigate('/swap')}
                          className="flex-1 py-3 border-2 border-slate-100 dark:border-white/10 rounded-full font-bold text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                        >
                          Liquidate
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-24 text-center bg-white dark:bg-obsidian-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-white/5 shadow-inner">
               <div className="w-24 h-24 bg-slate-50 dark:bg-obsidian-800 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300 dark:text-slate-700">
                  <LayoutDashboard className="w-12 h-12" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase mb-4 leading-none">Your Vault is Empty</h3>
               <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto mb-12 text-sm">
                 Acquire institutional property units in the fractional marketplace to start earning rewards.
               </p>
               <button 
                 onClick={() => navigate('/marketplace')}
                 className="primary-gradient text-white px-12 py-5 rounded-full font-black uppercase text-xs shadow-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
               >
                 Explore Marketplace <ArrowUpRight className="w-5 h-5" />
               </button>
            </div>
          )}
        </motion.div>

        {/* Sidebar History */}
        <motion.div variants={itemVariants} className="lg:col-span-4 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
              <History className="w-6 h-6 text-slate-400" /> History
            </h2>
          </div>
          <div className="fintech-card overflow-hidden">
            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {wallet.history.length > 0 ? (
                wallet.history.slice(0, 6).map((action) => (
                  <div key={action.id} className="p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-obsidian-800 border border-slate-100 dark:border-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-slate-400 group-hover:text-fintech-purple-600 dark:group-hover:text-neon-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight mb-1">{action.description}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(action.timestamp).toLocaleDateString()}</p>
                    </div>
                    {action.amount && (
                      <p className="text-xs font-black text-slate-900 dark:text-white whitespace-nowrap">{action.amount}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Activity</p>
                </div>
              )}
            </div>
            {wallet.history.length > 6 && (
              <button 
                onClick={() => navigate('/account')}
                className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-fintech-purple-600 transition-colors border-t border-slate-50 dark:border-white/5"
              >
                View Full Ledger
              </button>
            )}
          </div>

          <div className="p-8 bg-slate-900 dark:bg-obsidian-900 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fintech-purple-600/20 dark:bg-neon-emerald/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            <Sparkles className="w-8 h-8 text-fintech-purple-400 dark:text-neon-emerald mb-6" />
            <h4 className="text-xl font-black uppercase mb-4 leading-tight">Need a portfolio <br /> assessment?</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider leading-relaxed mb-8">PropAI Institutional neural analyst is online.</p>
            <button 
              onClick={() => navigate('/ai')}
              className="w-full py-4 bg-white dark:bg-neon-emerald text-slate-900 font-black rounded-full uppercase text-[10px] tracking-widest hover:scale-105 transition-transform shadow-xl"
            >
              Analyze Strategy
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
