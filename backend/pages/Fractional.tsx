
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../db';
import { 
  CheckCircle2, 
  Loader2, 
  Search, 
  Filter, 
  TrendingUp,
  ChevronRight,
  X,
  CreditCard,
  Info,
  ArrowRight,
  MapPin,
  Star,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Marketplace: React.FC = () => {
  const { buyTokens, wallet } = useAuth();
  const assets = db.getAssets();
  
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter ONLY Active (Tokenized) Assets for the marketplace
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const isActive = asset.status === 'ACTIVE';
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            asset.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = riskFilter === 'All' || asset.risk === riskFilter;
      return isActive && matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter, assets]);

  const selectedAsset = assets.find(a => a.id === selectedAssetId);
  const totalPrice = selectedAsset ? selectedAsset.tokenPrice * tokenCount : 0;
  const canAfford = wallet.stablecoinBalance >= totalPrice;

  const handlePurchase = async () => {
    if (!selectedAssetId || !canAfford) return;
    setIsProcessing(true);
    setTxHash(null);
    setError(null);
    try {
      const hash = await buyTokens(selectedAssetId, tokenCount);
      setTxHash(hash);
    } catch (err: any) {
      setError(err.message || 'Transaction rejected by rail.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fintech-fade pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-warm-100 tracking-tight uppercase">Fractional Market</h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-wide">Live Institutional Property Exchange</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search active plots..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-obsidian-900 rounded-full text-sm font-semibold shadow-sm focus:outline-none border border-slate-100 dark:border-white/5 transition-all text-slate-700 dark:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-full border transition-all ${showFilters ? 'bg-fintech-purple-600 text-white border-fintech-purple-600' : 'bg-white dark:bg-obsidian-900 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {filteredAssets.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-obsidian-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-white/5">
           <Info className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching institutional listings active.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="fintech-card overflow-hidden flex flex-col group hover:shadow-2xl transition-all border border-emerald-900/10 dark:border-neon-emerald/10"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={asset.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={asset.name} />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${
                    asset.risk === 'Low' ? 'bg-emerald-500' : asset.risk === 'Medium' ? 'bg-orange-500' : 'bg-red-500'
                  }`}>
                    {asset.risk} Risk Profile
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                   <div className="bg-white/90 dark:bg-obsidian-900/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center justify-between shadow-lg border border-white/20 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                         <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-neon-emerald" />
                         <span className="text-[10px] font-black text-slate-800 dark:text-neon-emerald uppercase tracking-widest">Audited</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{asset.yieldPercent}% yield</span>
                   </div>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{asset.name}</h3>
                  <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> {asset.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 dark:bg-obsidian-800 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Per Unit</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white">₹{asset.tokenPrice.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 dark:bg-neon-emerald/10 rounded-2xl border border-emerald-100 dark:border-neon-emerald/20">
                    <p className="text-[10px] font-bold text-emerald-600 dark:text-neon-emerald uppercase tracking-widest mb-1">Active Cap</p>
                    <p className="text-lg font-black text-emerald-700 dark:text-neon-emerald">{asset.totalTokens.toLocaleString()}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    setTxHash(null);
                    setError(null);
                  }}
                  className="w-full mt-auto py-4 bg-fintech-purple-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 rounded-full font-bold text-sm hover:opacity-90 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  Acquire Units <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Modal */}
      <AnimatePresence>
        {selectedAssetId && (
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-obsidian-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-obsidian-900 w-full max-w-4xl rounded-fintech-lg overflow-hidden relative shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-slate-100 dark:border-white/5"
            >
              <button 
                onClick={() => setSelectedAssetId(null)} 
                className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 dark:hover:text-white z-20 transition-colors"
              >
                <X className="w-7 h-7" />
              </button>

              <div className="w-full md:w-2/5 bg-slate-50 dark:bg-obsidian-800 p-8 flex flex-col">
                <div className="w-14 h-14 bg-fintech-purple-600 dark:bg-neon-emerald rounded-2xl flex items-center justify-center text-white dark:text-obsidian-950 mb-8 shadow-lg">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2 uppercase">Confirm Order</h2>
                <p className="text-slate-500 dark:text-slate-400 font-semibold mb-8">{selectedAsset?.name}</p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-fintech-purple-100 dark:bg-neon-emerald/20 text-fintech-purple-600 dark:text-neon-emerald flex items-center justify-center text-xs font-bold">1</div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Enter quantity</span>
                  </div>
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-600 flex items-center justify-center text-xs font-bold">2</div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Protocol Settlement</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-slate-200 dark:border-white/10 flex items-start gap-3">
                   <Info className="w-5 h-5 text-fintech-purple-600 dark:text-neon-emerald shrink-0" />
                   <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tight">
                     On-Chain Proof: Ownership is Source-indexed from Polygon Event Logs.
                   </p>
                </div>
              </div>

              <div className="w-full md:w-3/5 p-8 md:p-12 space-y-10 overflow-y-auto dark:bg-obsidian-900">
                {txHash ? (
                   <div className="h-full flex flex-col items-center justify-center text-center animate-fintech-fade space-y-6 py-10">
                      <div className="w-20 h-20 bg-emerald-50 dark:bg-neon-emerald/10 rounded-full flex items-center justify-center border-4 border-emerald-500 dark:border-neon-emerald shadow-inner">
                         <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-neon-emerald" />
                      </div>
                      <div>
                        <p className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tight">Order Settled</p>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">Ownership index updated for {selectedAsset?.name}</p>
                      </div>
                      <div className="w-full p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 text-[10px] font-mono break-all text-slate-400">
                         TX: {txHash}
                      </div>
                      <button 
                        onClick={() => setSelectedAssetId(null)} 
                        className="w-full bg-fintech-purple-600 dark:bg-neon-emerald text-white dark:text-obsidian-950 py-4 rounded-full font-bold text-sm shadow-xl"
                      >
                        Return to Market
                      </button>
                   </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Quantity to purchase</label>
                        <div className="relative group">
                           <input 
                            type="number" 
                            min="1"
                            className="w-full pl-6 pr-20 py-8 rounded-2xl bg-slate-50 dark:bg-obsidian-800 border-2 border-slate-100 dark:border-white/5 text-5xl font-black text-slate-800 dark:text-white outline-none focus:border-fintech-purple-600/30 dark:focus:border-neon-emerald/20 transition-all shadow-inner"
                            value={tokenCount}
                            onChange={e => setTokenCount(Math.max(1, parseInt(e.target.value) || 0))}
                          />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300 dark:text-slate-600 text-xl tracking-tight uppercase">Units</span>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 dark:bg-obsidian-800 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Settlement</span>
                          <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="h-px bg-slate-200 dark:bg-white/5"></div>
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-500 dark:text-slate-400">Available Credits</span>
                          <span className={`flex items-center gap-1.5 ${canAfford ? 'text-emerald-600 dark:text-neon-emerald' : 'text-red-500'}`}>
                            ₹{wallet.stablecoinBalance.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-500/20 flex items-center gap-3 text-xs font-bold uppercase">
                          {error}
                        </div>
                      )}

                      <button 
                        disabled={isProcessing || !canAfford}
                        onClick={handlePurchase}
                        className="w-full primary-gradient text-white py-5 rounded-full font-bold text-lg shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.01] transition-transform"
                      >
                        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                          <>Settle Acquisition <ArrowRight className="w-5 h-5" /></>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Marketplace;
