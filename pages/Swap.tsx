
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { RefreshCcw, ArrowDown, Wallet, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Swap: React.FC = () => {
  const { wallet, swapToStablecoin } = useAuth();
  const [assetId, setAssetId] = useState(DUMMY_ASSETS[0].id);
  const [tokenAmount, setTokenAmount] = useState<number>(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedAsset = DUMMY_ASSETS.find(a => a.id === assetId)!;
  const ownedTokens = Number(wallet.tokensByAsset[assetId]) || 0;
  const outputINR = tokenAmount * selectedAsset.tokenPrice;

  const handleSwap = async () => {
    if (tokenAmount <= 0) return;
    if (tokenAmount > ownedTokens) {
      setError("Insufficient units owned for this asset.");
      return;
    }
    setIsSwapping(true);
    setError(null);
    try {
      await swapToStablecoin(assetId, tokenAmount);
      setShowSuccess(true);
      setTokenAmount(0);
    } catch (err: any) {
      setError(err.message || 'Liquidation protocol failure. Please retry.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center">
        <h1 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase">Liquid Swap</h1>
        <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em] mt-2">Instant Unit Conversion Protocol</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-2xl border-4 border-slate-900 dark:border-slate-800 relative transition-colors shadow-2xl">
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">From: Asset Units</label>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border-2 border-slate-900 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <select 
                className="bg-white dark:bg-slate-900 border-2 border-slate-900 rounded-lg px-4 py-3 font-black text-slate-900 dark:text-slate-100 focus:border-indigo-600 outline-none uppercase text-[10px] tracking-widest"
                value={assetId}
                onChange={e => { setAssetId(e.target.value); setError(null); }}
              >
                {DUMMY_ASSETS.map(asset => (
                  <option key={asset.id} value={asset.id}>{asset.name}</option>
                ))}
              </select>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ownership</p>
                <button 
                  onClick={() => { setTokenAmount(ownedTokens); setError(null); }}
                  className="text-sm font-black text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {ownedTokens.toLocaleString()} Units
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <input 
                type="number" 
                placeholder="0"
                className="w-full bg-transparent text-5xl font-black outline-none tracking-tighter text-slate-900 dark:text-slate-100"
                value={tokenAmount || ''}
                onChange={e => { 
                  const val = parseFloat(e.target.value) || 0;
                  setTokenAmount(Math.min(ownedTokens, Math.max(0, val))); 
                  setError(null); 
                }}
              />
              <span className="text-slate-300 dark:text-slate-600 font-black text-2xl uppercase tracking-tighter">UNITS</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center -my-6 relative z-10">
          <div className="bg-indigo-600 p-4 rounded-xl text-white border-4 border-slate-900 dark:border-slate-900 shadow-lg">
            <ArrowDown className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">To: INR Stablecoin</label>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border-2 border-slate-900 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 bg-slate-900 dark:bg-black px-4 py-2 rounded-lg text-white">
                <span className="font-black text-[10px] uppercase tracking-widest">INR</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Wallet</p>
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">₹{wallet.stablecoinBalance.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">₹{outputINR.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div className="px-6 py-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex justify-between items-center border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <RefreshCcw className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Exchange Rate</span>
            </div>
            <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-widest">1 Unit = ₹{selectedAsset.tokenPrice.toLocaleString()}</span>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border-2 border-red-900/20 flex items-center gap-3 text-xs font-black uppercase tracking-widest">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <button 
            onClick={handleSwap}
            disabled={isSwapping || tokenAmount <= 0}
            className="w-full bg-slate-900 dark:bg-slate-800 text-white py-6 rounded-xl font-black uppercase tracking-[0.2em] text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 border-b-4 border-black"
          >
            {isSwapping ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authorize Liquidation"}
          </button>
        </div>

        {showSuccess && (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center z-20 p-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-8 border-4 border-slate-900">
               <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase">Settled</h2>
            <p className="text-slate-500 dark:text-slate-400 font-bold mt-4 leading-relaxed uppercase text-xs tracking-widest">Units successfully converted to INR.</p>
            <button 
              onClick={() => setShowSuccess(false)}
              className="mt-10 bg-indigo-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest text-xs border-b-4 border-slate-900 active:transform active:scale-95"
            >
              Continue Audit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swap;
