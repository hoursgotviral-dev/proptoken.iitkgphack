import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { RefreshCcw, ArrowDown, Loader2, CheckCircle2, AlertCircle, Info, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Swap: React.FC = () => {
  const { wallet, swapToStablecoin } = useAuth();
  const [assetId, setAssetId] = useState(DUMMY_ASSETS[0].id);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedAsset = DUMMY_ASSETS.find(a => a.id === assetId)!;
  const ownedTokens = Number(wallet.tokensByAsset[assetId]) || 0;
  const outputINR = tokenAmount * selectedAsset.tokenPrice;

  const handleSwap = async () => {
    if (tokenAmount <= 0) return;
    if (tokenAmount > ownedTokens) {
      setError("You don't have enough units of this property.");
      return;
    }
    setIsSwapping(true);
    setError(null);
    try {
      await swapToStablecoin(assetId, tokenAmount);
      setShowSuccess(true);
      setTokenAmount(0);
    } catch (err: any) {
      setError(err.message || 'Withdrawal could not be processed at this time.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 animate-fintech-fade">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-800 dark:text-warm-100 tracking-tight uppercase">Withdraw Money</h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Sell units back to the platform for instant wallet credit</p>
      </div>

      <div className="fintech-card p-6 md:p-10 space-y-8 relative overflow-hidden shadow-xl border border-slate-100 dark:border-white/5">
        <div className="space-y-6">
          {/* Asset Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Select property to sell</label>
              <span className="text-[10px] font-bold text-fintech-purple-600 dark:text-neon-emerald uppercase tracking-widest">Balance: {ownedTokens} Units</span>
            </div>
            <div className="relative">
              <select 
                className="w-full bg-slate-50 dark:bg-obsidian-800 border border-slate-100 dark:border-white/5 rounded-2xl px-6 py-4 font-bold text-slate-800 dark:text-white outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-fintech-purple-600/5 dark:focus:ring-neon-emerald/5 transition-all"
                value={assetId}
                onChange={e => { setAssetId(e.target.value); setError(null); }}
              >
                {DUMMY_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Quantity to sell</label>
              <button 
                onClick={() => { setTokenAmount(ownedTokens); setError(null); }}
                className="text-[10px] font-bold text-fintech-purple-600 dark:text-neon-emerald uppercase hover:underline"
              >
                Sell Maximum
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-obsidian-800 p-8 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-inner">
               <input 
                type="number" 
                placeholder="0"
                className="w-full bg-transparent text-5xl font-black outline-none tracking-tighter text-slate-800 dark:text-white"
                value={tokenAmount || ''}
                onChange={e => { 
                  const val = parseFloat(e.target.value) || 0;
                  setTokenAmount(Math.min(ownedTokens, Math.max(0, val))); 
                  setError(null); 
                }}
              />
              <span className="text-slate-400 dark:text-slate-500 font-bold text-xl tracking-tight uppercase">Units</span>
            </div>
          </div>

          <div className="flex justify-center relative -my-4 z-10">
            <div className="bg-fintech-purple-600 dark:bg-neon-emerald p-3 rounded-full text-white dark:text-obsidian-950 shadow-lg border-4 border-white dark:border-obsidian-900">
              <ArrowDown className="w-6 h-6" />
            </div>
          </div>

          {/* Credit Amount */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Total Credit to Wallet</label>
            <div className="bg-emerald-50 dark:bg-neon-emerald/10 p-8 rounded-2xl border border-emerald-100 dark:border-neon-emerald/20 flex items-center justify-between shadow-inner">
              <p className="text-5xl font-black text-emerald-700 dark:text-neon-emerald tracking-tighter">
                ₹{outputINR.toLocaleString()}
              </p>
              <span className="text-emerald-600 dark:text-neon-emerald font-bold text-xl tracking-tight uppercase">Credit</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="p-4 bg-slate-50 dark:bg-obsidian-800 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <RefreshCcw className="w-4 h-4" />
              <span className="text-xs font-bold">Buy-back Rate Basis</span>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">₹{selectedAsset.tokenPrice.toLocaleString()} / unit</span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-xs font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          <button 
            onClick={handleSwap}
            disabled={isSwapping || tokenAmount <= 0}
            className="w-full primary-gradient text-white py-5 rounded-full font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.01]"
          >
            {isSwapping ? <Loader2 className="w-6 h-6 animate-spin" /> : "Confirm & Sell Units"}
          </button>
        </div>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-obsidian-900 rounded-fintech-lg flex flex-col items-center justify-center z-20 p-12 text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-emerald-50 dark:bg-neon-emerald/10 rounded-full flex items-center justify-center text-emerald-600 dark:text-neon-emerald mb-8 border border-emerald-100 dark:border-neon-emerald/20 shadow-inner">
                 <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Success!</h2>
              <p className="text-slate-500 dark:text-slate-400 font-semibold mt-4 text-sm max-w-xs mx-auto leading-relaxed">
                ₹{outputINR.toLocaleString()} has been credited to your PropToken wallet balance.
              </p>
              <div className="mt-10 flex flex-col gap-3 w-full">
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 px-10 py-4 rounded-full font-bold text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                >
                  Done
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-fintech-purple-600 dark:text-neon-emerald font-bold text-sm hover:underline"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-blue-50 dark:bg-blue-500/10 rounded-fintech border border-blue-100 dark:border-blue-500/20 flex items-start gap-4">
        <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 leading-relaxed uppercase tracking-wide">
          Safe Exit: PropToken provides a 100% buy-back guarantee for all fractional units. Funds are typically available for withdrawal to your bank account within 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default Swap;