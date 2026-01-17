
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../db.ts';
import { ShieldCheck, MapPin, TrendingUp, Info, ChevronLeft, CreditCard, Star, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PropertyDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const asset = db.getAssets().find(a => a.id === id);

  if (!asset) return <div className="p-20 text-center font-black">404: ASSET_NOT_FOUND</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-fintech-fade">
      <button 
        onClick={() => navigate('/marketplace')}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-black uppercase text-[10px] tracking-widest"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Marketplace
      </button>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-video rounded-[2.5rem] overflow-hidden border-2 border-slate-100 shadow-2xl relative">
            <img src={asset.image} className="w-full h-full object-cover" alt="" />
            <div className="absolute top-8 left-8">
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3 shadow-xl border border-white/50">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Legally Verified Asset</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 px-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">{asset.name}</h1>
                <p className="flex items-center gap-2 text-slate-400 font-bold uppercase text-xs tracking-widest">
                  <MapPin className="w-4 h-4" /> {asset.location}
                </p>
              </div>
              <div className="text-right">
                 <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Rating: AAA</p>
              </div>
            </div>

            <div className="p-10 bg-white border border-slate-100 rounded-[2rem] shadow-xl grid md:grid-cols-3 gap-8">
               <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Annual Yield</p>
                 <p className="text-3xl font-black text-indigo-600">{asset.yieldPercent}%</p>
               </div>
               <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Price</p>
                 <p className="text-3xl font-black text-slate-900">₹{asset.tokenPrice.toLocaleString()}</p>
               </div>
               <div className="space-y-2">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</p>
                 <p className={`text-3xl font-black ${asset.risk === 'Low' ? 'text-emerald-600' : 'text-amber-500'}`}>{asset.risk}</p>
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pb-3 border-b">Audit & Verification Intelligence</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                   <div className="flex items-center gap-3 text-slate-900">
                      <FileText className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-tight">Title Deed Clearance</span>
                   </div>
                   <p className="text-[10px] font-medium text-slate-500 uppercase leading-relaxed tracking-tight">
                     Institutional legal audit confirmed on {asset.verificationDate ? new Date(asset.verificationDate).toLocaleDateString() : 'N/A'}. All encumbrances cleared.
                   </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                   <div className="flex items-center gap-3 text-slate-900">
                      <Clock className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-tight">Appreciation Trend</span>
                   </div>
                   <p className="text-[10px] font-medium text-slate-500 uppercase leading-relaxed tracking-tight">
                     Local region growth tracking at +12.4% annually. High demand institutional zone.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="fintech-card p-10 shadow-2xl border-indigo-600/10 bg-white">
               <h3 className="text-xl font-bold text-slate-800 mb-8 uppercase tracking-tight flex items-center justify-between">
                 Acquire Units
                 <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[9px] font-black">Trade Live</div>
               </h3>
               
               <div className="space-y-8">
                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Market Price</span>
                      <span className="text-2xl font-black text-indigo-950 tracking-tight">₹{asset.tokenPrice.toLocaleString()} / unit</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                      <span>Available Supply</span>
                      <span>{asset.totalTokens.toLocaleString()} Units</span>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed uppercase tracking-tight">
                      Institutional Guard: Units are fully backed by audited real estate assets.
                    </p>
                  </div>

                  <button 
                    onClick={() => navigate('/marketplace')}
                    className="w-full primary-gradient text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-[0.98]"
                  >
                    Start Acquisition <CreditCard className="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
               <div className="flex items-center gap-4 mb-4">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Yield Forecaster</span>
               </div>
               <p className="text-2xl font-black tracking-tight mb-2">₹{(asset.tokenPrice * 10 * (asset.yieldPercent/100)).toLocaleString()} / year</p>
               <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">
                 Estimated passive reward for acquiring 10 fractional units.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
