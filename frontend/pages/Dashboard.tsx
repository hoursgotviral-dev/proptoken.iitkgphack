
import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import StatCard from '../components/StatCard.tsx';
import { Wallet, Layers, TrendingUp, Search, ExternalLink, Zap, Info, X } from 'lucide-react';
import { DUMMY_ASSETS } from '../constants.tsx';

const Dashboard: React.FC = () => {
  const { wallet, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);

  const estYield = DUMMY_ASSETS.reduce((acc, asset) => {
    const tokens = wallet.tokensByAsset[asset.id] || 0;
    const value = tokens * asset.tokenPrice;
    return acc + (value * (asset.yieldPercent / 100)) / 12;
  }, 0);

  const filteredHoldings = useMemo(() => {
    return DUMMY_ASSETS.filter(asset => {
      const tokensOwned = wallet.tokensByAsset[asset.id] || 0;
      return tokensOwned > 0 && asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [wallet.tokensByAsset, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Portfolio Overview</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 font-medium">Monitoring your fractional real estate positions.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            Export History
          </button>
          <button 
            onClick={() => setShowAddFunds(true)}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            Deposit Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Net Equity" 
          value={`₹${wallet.totalInvested.toLocaleString()}`} 
          change="+12.5%" 
          positive={true}
          icon={Wallet}
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20"
        />
        <StatCard 
          title="INR Balance" 
          value={`₹${wallet.stablecoinBalance.toLocaleString()}`} 
          icon={Layers}
          colorClass="bg-slate-100 text-slate-600 dark:bg-slate-800"
        />
        <StatCard 
          title="Est. Monthly Yield" 
          value={`₹${estYield.toFixed(0)}`} 
          change="+2.4%" 
          positive={true}
          icon={TrendingUp}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-900 dark:text-white">Active Positions</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter holdings..."
              className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-semibold outline-none focus:ring-1 focus:ring-indigo-600 transition-all dark:text-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Units</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Value</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredHoldings.length > 0 ? (
                filteredHoldings.map(asset => {
                  const tokens = wallet.tokensByAsset[asset.id] || 0;
                  return (
                    <tr key={asset.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <img src={asset.image} className="w-full h-full object-cover" alt="" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{asset.name}</p>
                            <p className="text-[10px] font-medium text-slate-400">{asset.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <Zap className="w-3 h-3 fill-emerald-600" /> Active
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-900 dark:text-white text-right">{tokens.toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm font-bold text-indigo-600 dark:text-indigo-400 text-right">₹{(tokens * asset.tokenPrice).toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium text-sm">
                    No active positions found matching your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddFunds && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 relative">
            <button onClick={() => setShowAddFunds(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-5 h-5" /></button>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 mb-6"><Info className="w-6 h-6" /></div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Banking Settlement</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">Direct bank transfers are currently being enabled for your region. Please contact support to initiate a priority settlement.</p>
            <button onClick={() => setShowAddFunds(false)} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all">Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
