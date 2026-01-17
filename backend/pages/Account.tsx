import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { User, Mail, ShieldCheck, CreditCard, RefreshCcw, ShoppingCart, ExternalLink, X, Info, Landmark, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Account: React.FC = () => {
  const { user, wallet } = useAuth();
  const [showUpdateNotice, setShowUpdateNotice] = useState(false);

  const totalTokens = (Object.values(wallet.tokensByAsset) as number[]).reduce((a: number, b: number) => a + (b as number), 0);
  const totalAssets = (Object.values(wallet.tokensByAsset) as number[]).filter((count: number) => (count as number) > 0).length;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'BUY_TOKENS': return <ShoppingCart className="w-5 h-5 text-emerald-900 dark:text-neon-emerald" />;
      case 'SWAP': return <RefreshCcw className="w-5 h-5 text-slate-600 dark:text-slate-400" />;
      case 'VERIFY': return <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case 'PAYMENT': return <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-500" />;
      case 'COLLATERAL_LOCK': return <Landmark className="w-5 h-5 text-emerald-900 dark:text-neon-emerald" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const cardVariants = {
    hover: {
      y: -8,
      scale: 1.01,
      borderColor: 'rgba(0, 245, 160, 0.6)',
      boxShadow: '0 0 25px rgba(0, 245, 160, 0.15)',
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-12 animate-fintech-fade pb-20">
      <div className="space-y-3">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Private Identity</h1>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em]">Vault Security • Registry Management</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Profile Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="fintech-card p-10 flex flex-col items-center text-center transition-all border-emerald-900/10 dark:border-neon-emerald/30 bg-white dark:bg-obsidian-900"
          >
            <div className="w-32 h-32 rounded-3xl bg-slate-900 dark:bg-emerald-900 flex items-center justify-center text-white text-5xl font-black mb-8 border-4 border-slate-100 dark:border-neon-emerald shadow-xl">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{user?.name}</h2>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2 justify-center">
              <Mail className="w-3 h-3" /> {user?.email}
            </p>
            
            {user?.walletAddress && (
              <div className="mt-8 bg-slate-50 dark:bg-obsidian-800 p-4 rounded-xl border border-slate-100 dark:border-neon-emerald/20 w-full">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Institutional Address</p>
                <p className="text-[10px] font-mono text-slate-600 dark:text-neon-emerald break-all select-all">{user.walletAddress}</p>
              </div>
            )}

            <div className="w-full h-px bg-slate-100 dark:bg-white/5 my-10"></div>
            
            <button 
              onClick={() => setShowUpdateNotice(true)}
              className="w-full py-4 bg-slate-900 dark:bg-emerald-800 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg active:scale-95"
            >
              Amend Identity Docs
            </button>
          </motion.div>

          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="fintech-card p-8 space-y-6 transition-all bg-slate-50 dark:bg-obsidian-900/50 border-emerald-900/10 dark:border-neon-emerald/30"
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-slate-400">Registry Network</span>
              <span className="text-slate-800 dark:text-neon-emerald">Polygon Mainnet</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-slate-400">Clearance Status</span>
              <span className="text-slate-800 dark:text-neon-emerald">Synchronized</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="text-slate-400">KYC/AML Audit</span>
              <span className="text-slate-800 dark:text-neon-emerald">Verified</span>
            </div>
          </motion.div>
        </div>

        {/* Account Details & Activity */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { label: 'Total Units Held', value: totalTokens.toLocaleString(), accent: 'text-slate-900' },
              { label: 'Unique Registry Positions', value: totalAssets, accent: 'text-slate-900' },
              { label: 'Stablecoin Credits', value: `₹${wallet.stablecoinBalance.toLocaleString()}`, accent: 'text-emerald-700 dark:text-neon-emerald' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={cardVariants}
                whileHover="hover"
                className="fintech-card p-8 border-2 border-emerald-900/20 dark:border-neon-emerald/30 bg-white dark:bg-obsidian-900 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 dark:bg-neon-emerald/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 group-hover:text-emerald-600 dark:group-hover:text-neon-emerald transition-colors">{stat.label}</p>
                <p className={`text-4xl font-black tracking-tighter dark:text-white ${stat.accent}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={cardVariants}
            whileHover="hover"
            className="fintech-card overflow-hidden transition-all bg-white dark:bg-obsidian-900 border-emerald-900/10 dark:border-neon-emerald/30 shadow-lg"
          >
            <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
              <h3 className="text-[11px] font-black text-slate-900 dark:text-neon-emerald uppercase tracking-[0.4em]">Vault Activity Ledger</h3>
              <button className="text-[10px] font-black text-slate-600 dark:text-neon-emerald uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all">
                Registry Explorer <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {wallet.history.length > 0 ? wallet.history.map((action) => (
                <div key={action.id} className="px-10 py-8 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-obsidian-800 flex items-center justify-center border border-slate-100 dark:border-neon-emerald/20 shadow-sm transition-all group-hover:scale-105">
                        {getActionIcon(action.type)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-tight">{action.description}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {format(new Date(action.timestamp), 'MMM dd, yyyy • hh:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {action.amount && (
                        <p className={`font-black text-sm uppercase tracking-tight ${action.type === 'BUY_TOKENS' || action.type === 'PAYMENT' ? 'text-red-500' : 'text-emerald-600 dark:text-neon-emerald'}`}>
                          {action.type === 'BUY_TOKENS' || action.type === 'PAYMENT' ? '-' : '+'}{action.amount}
                        </p>
                      )}
                    </div>
                  </div>
                  {action.txHash && (
                    <div className="ml-20 bg-slate-50 dark:bg-obsidian-950/50 p-4 rounded-xl border border-slate-100 dark:border-neon-emerald/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Hash</span>
                        <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-[400px] select-all">{action.txHash}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-neon-emerald/30" />
                    </div>
                  )}
                </div>
              )) : (
                <div className="py-20 text-center">
                  <Clock className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Recent Activity Established</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Update Identity Modal */}
      {showUpdateNotice && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-obsidian-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fintech-fade">
          <div className="bg-white dark:bg-obsidian-900 w-full max-w-md rounded-fintech-lg border border-slate-200 dark:border-neon-emerald/20 p-10 relative shadow-2xl overflow-hidden">
            <button 
              onClick={() => setShowUpdateNotice(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="w-16 h-16 bg-slate-900 dark:bg-neon-emerald/10 rounded-2xl flex items-center justify-center text-white dark:text-neon-emerald mb-8 border border-slate-800 dark:border-neon-emerald/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-6 leading-none">Identity Documentation Locked</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-10 uppercase tracking-tight">
              Registry modifications are temporarily suspended during the initial validation period. 
              This protocol ensures compliance with institutional digital asset guidelines.
            </p>
            <button 
              onClick={() => setShowUpdateNotice(false)}
              className="w-full bg-slate-900 dark:bg-emerald-800 text-white py-5 rounded-full font-black uppercase tracking-[0.2em] text-[11px] shadow-lg active:scale-95"
            >
              Return to Vault
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;