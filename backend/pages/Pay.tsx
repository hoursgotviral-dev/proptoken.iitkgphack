import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DUMMY_ASSETS } from '../constants.tsx';
import { CreditCard, Lock, Info, AlertCircle, Loader2, CheckCircle2, Wallet, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Pay: React.FC = () => {
  const { wallet, makePayment, lockAsCollateral } = useAuth();
  const [activeTab, setActiveTab] = useState<'pay' | 'collateral'>('pay');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [lockAssetId, setLockAssetId] = useState(DUMMY_ASSETS[0].id);
  const [lockAmount, setLockAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (payAmount <= 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const success = await makePayment(payAmount);
      if (success) {
        setSuccessMsg(`₹${payAmount.toLocaleString()} Sent Successfully`);
        setShowSuccess(true);
        setPayAmount(0);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setError("Your wallet balance is low. Please top-up.");
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLock = async () => {
    if (lockAmount <= 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const owned = Number(wallet.tokensByAsset[lockAssetId]) || 0;
      if (lockAmount > owned) throw new Error("You don't have enough units.");
      await lockAsCollateral(lockAssetId, lockAmount);
      setSuccessMsg(`Secure Vault Lock Active`);
      setShowSuccess(true);
      setLockAmount(0);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Vault lock failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedLockAsset = DUMMY_ASSETS.find(a => a.id === lockAssetId)!;
  const ownedTokens = Number(wallet.tokensByAsset[lockAssetId]) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fintech-fade">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-800 dark:text-warm-100 tracking-tight uppercase">Wallet & Payments</h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">Transfer money or secure your assets in the vault</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-white dark:bg-obsidian-900 p-1.5 rounded-full w-full max-w-sm mx-auto shadow-sm border border-slate-100 dark:border-white/5">
        <button 
          onClick={() => { setActiveTab('pay'); setError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs transition-all ${activeTab === 'pay' ? 'bg-fintech-purple-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Transfer
        </button>
        <button 
          onClick={() => { setActiveTab('collateral'); setError(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-xs transition-all ${activeTab === 'collateral' ? 'bg-fintech-purple-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
        >
          <Lock className="w-4 h-4" /> Secure Vault
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col">
          <div className="fintech-card p-6 md:p-10 space-y-8 shadow-lg flex-1 flex flex-col">
            {activeTab === 'pay' ? (
              <div className="space-y-8 animate-fintech-fade flex-1 flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-fintech-purple-50 dark:bg-neon-emerald/10 rounded-2xl flex items-center justify-center text-fintech-purple-600 dark:text-neon-emerald shadow-inner">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Send Money</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Withdrawal to Bank Account</p>
                  </div>
                </div>
                
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Amount to Transfer</label>
                    <div className="relative group">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300 dark:text-slate-600">₹</span>
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full pl-14 pr-6 py-8 rounded-2xl bg-slate-50 dark:bg-obsidian-800 border-2 border-slate-100 dark:border-white/5 text-5xl font-black text-slate-800 dark:text-white outline-none focus:border-fintech-purple-600/30 dark:focus:border-neon-emerald/20 transition-all shadow-inner"
                        value={payAmount || ''}
                        onChange={e => { setPayAmount(parseFloat(e.target.value) || 0); setError(null); }}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-obsidian-800 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Available Credits</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">₹{wallet.stablecoinBalance.toLocaleString()}</span>
                  </div>

                  {(payAmount > wallet.stablecoinBalance || error) && (
                    <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-xs font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" /> {error || "Insufficient Credits"}
                    </div>
                  )}

                  <button 
                    onClick={handlePay}
                    disabled={isProcessing || payAmount <= 0 || payAmount > wallet.stablecoinBalance}
                    className="w-full primary-gradient text-white py-5 rounded-full font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-fintech-purple-700 transition-all active:scale-[0.98] mt-auto"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Bank Transfer"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-fintech-fade flex-1 flex flex-col">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 dark:bg-neon-indigo/10 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-neon-indigo shadow-inner">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Secure Assets</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Collateral Security Vault</p>
                  </div>
                </div>

                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Select Asset</label>
                      <select 
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-obsidian-800 border border-slate-100 dark:border-white/5 font-bold text-slate-800 dark:text-white outline-none appearance-none cursor-pointer focus:ring-4 focus:ring-fintech-purple-600/5 dark:focus:ring-neon-emerald/5 transition-all shadow-sm"
                        value={lockAssetId}
                        onChange={e => { setLockAssetId(e.target.value); setError(null); }}
                      >
                        {DUMMY_ASSETS.map(asset => (
                          <option key={asset.id} value={asset.id}>{asset.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2">Units to Lock</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          placeholder="0"
                          className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-obsidian-800 border border-slate-100 dark:border-white/5 text-xl font-bold text-slate-800 dark:text-white outline-none transition-all shadow-inner"
                          value={lockAmount || ''}
                          onChange={e => { setLockAmount(Math.min(ownedTokens, Math.max(0, parseInt(e.target.value) || 0))); setError(null); }}
                        />
                        <button onClick={() => setLockAmount(ownedTokens)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-fintech-purple-600 dark:text-neon-emerald uppercase hover:underline">ALL</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-50 dark:bg-neon-indigo/10 rounded-2xl border border-indigo-100 dark:border-neon-indigo/20 space-y-5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Vaulted Value</span>
                      <span className="text-2xl font-black text-indigo-700 dark:text-neon-indigo tracking-tight">₹{(lockAmount * selectedLockAsset.tokenPrice).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-indigo-100/50 dark:bg-white/5 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div className="bg-indigo-600 dark:bg-neon-indigo h-full w-[60%] rounded-full"></div>
                    </div>
                    <p className="text-[10px] font-bold text-indigo-500 dark:text-neon-indigo uppercase text-center tracking-[0.2em]">60% LTV Loan Capability Unlocked</p>
                  </div>

                  <button 
                    onClick={handleLock}
                    disabled={isProcessing || lockAmount <= 0}
                    className="w-full bg-indigo-600 dark:bg-neon-indigo text-white dark:text-obsidian-950 py-5 rounded-full font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-indigo-700 dark:hover:bg-neon-indigo/80 transition-all active:scale-[0.98] mt-auto"
                  >
                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Move Units to Vault"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col">
          {/* Reassuring Balance Card */}
          <div className="bg-slate-900 dark:bg-obsidian-900 text-white p-8 rounded-fintech-lg shadow-2xl relative overflow-hidden border flex-1 flex flex-col">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white dark:bg-neon-emerald opacity-5 rounded-full -mr-20 -mt-20"></div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-8 text-white/40">Real-time Balances</h3>
            <div className="space-y-8 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Available Credits</p>
                  <p className="text-4xl font-black tracking-tight">₹{wallet.stablecoinBalance.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/5">
                   <Wallet className="w-7 h-7 text-white/60" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Total Vaulted</p>
                  <p className="text-4xl font-black tracking-tight">₹{wallet.lockedCollateral.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center border border-white/5">
                   <Lock className="w-7 h-7 text-white/60" />
                </div>
              </div>
              <div className="h-px bg-white/10 my-4"></div>
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Info className="w-6 h-6 text-emerald-400 dark:text-neon-emerald shrink-0" />
                <p className="text-[10px] font-semibold text-white/40 leading-relaxed uppercase tracking-wide">Secure Link: All transactions are processed via bank-grade settlement rails on the Polygon Network.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 px-10 py-4 rounded-full shadow-2xl flex items-center gap-3 z-50 font-bold"
        >
          <CheckCircle2 className="w-6 h-6" />
          <span className="text-sm tracking-tight">{successMsg}</span>
        </motion.div>
      )}
    </div>
  );
};

export default Pay;