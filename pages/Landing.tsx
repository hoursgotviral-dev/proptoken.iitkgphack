
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Layers, RefreshCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-3 text-indigo-600 font-black text-3xl tracking-tighter">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Building2 className="w-7 h-7" />
          </div>
          <span>PropToken</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/signin" className="text-slate-900 font-extrabold hover:text-indigo-600 transition-colors uppercase tracking-widest text-sm">Sign in</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-colors btn-flat">
            Join Platform
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid lg:grid-cols-2 items-center gap-16">
        <div>
          <div className="inline-block bg-emerald-500 text-white px-4 py-1 rounded-lg font-black uppercase tracking-widest text-xs mb-8">
            Live in India
          </div>
          <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-10">
            Plot ownership <br />
            for the <span className="text-indigo-600">modern era.</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-lg leading-relaxed mb-12">
            Buy, sell, and earn from prime Indian land plots. All via secure on-chain fractional tokens. Zero middle-men.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-3 btn-flat">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/signin" className="w-full sm:w-auto border-2 border-slate-900 text-slate-900 px-12 py-5 rounded-lg font-black uppercase tracking-widest text-sm hover:bg-slate-50 transition-colors btn-flat">
              View Market
            </Link>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full aspect-square bg-indigo-50 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-600 rounded-3xl transform rotate-12 flex items-center justify-center">
               <div className="w-4/5 h-4/5 bg-white rounded-2xl flex flex-col p-6 text-indigo-600 border-2 border-slate-100">
                  <div className="w-12 h-12 bg-indigo-50 rounded-lg mb-4 flex items-center justify-center">
                    <Building2 />
                  </div>
                  <p className="font-black text-2xl tracking-tight">Heritage Acres</p>
                  <p className="text-sm font-bold opacity-60 uppercase mb-auto">ID: PL-5600</p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs uppercase font-black opacity-40">Yearly Yield</p>
                      <p className="text-xl font-black">12.5%</p>
                    </div>
                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-black">₹ ACTIVE</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="max-w-7xl mx-auto px-8 py-32 border-t-2 border-slate-100 bg-slate-50/50">
        <div className="mb-20">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 uppercase">What we build that others don't</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Our Solution vs Existing Platforms</p>
        </div>

        <div className="overflow-hidden border-2 border-slate-200 rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="px-10 py-6 font-black uppercase tracking-widest text-xs">Capability</th>
                <th className="px-10 py-6 font-black uppercase tracking-widest text-xs text-center border-l border-white/10">Existing Platforms</th>
                <th className="px-10 py-6 font-black uppercase tracking-widest text-xs text-center border-l border-white/10 bg-indigo-600">Our Solution</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {[
                { cap: 'Asset verification', existing: true, solution: true },
                { cap: 'Fractional ownership', existing: true, solution: true },
                { cap: 'Rental yield', existing: 'some', solution: 'Optional' },
                { cap: 'Instant swap to stablecoin', existing: false, solution: true },
                { cap: 'Use as payment collateral', existing: false, solution: true },
                { cap: 'End-to-end value rail', existing: false, solution: true, description: '(verify → tokenize → swap → pay)' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-10 py-6">
                    <p className="font-black text-slate-900 text-lg">{row.cap}</p>
                    {row.description && <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{row.description}</p>}
                  </td>
                  <td className="px-10 py-6 border-l border-slate-100">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.existing === true ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : 
                       row.existing === false ? <XCircle className="w-6 h-6 text-red-400 opacity-30" /> :
                       <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{row.existing}</span></div>}
                    </div>
                  </td>
                  <td className="px-10 py-6 border-l border-slate-100 bg-indigo-50/30">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.solution === true ? <CheckCircle2 className="w-8 h-8 text-indigo-600" /> :
                       <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">{row.solution}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-slate-900 py-20 px-8 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <Building2 className="text-indigo-500" />
            <span>PropToken</span>
          </div>
          <div className="flex gap-12 text-sm font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
