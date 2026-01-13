
import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Layers, RefreshCcw, ArrowRight, CheckCircle2, XCircle, Zap, TrendingUp, Sparkles, Globe } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative overflow-hidden flex flex-col">
      {/* Visual Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-emerald-50/30 dark:bg-emerald-900/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <nav className="max-w-7xl mx-auto px-8 w-full h-24 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 text-indigo-600 font-black text-3xl tracking-tighter">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-b-4 border-slate-900">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="dark:text-white">PropToken</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/signin" className="text-slate-900 dark:text-slate-400 font-black hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px]">Sign in</Link>
          <Link to="/signup" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-600 transition-all transform active:scale-95 border-b-4 border-indigo-500">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-8 pt-20 pb-32 lg:pt-32 lg:pb-48 grid lg:grid-cols-2 items-center gap-20 relative z-10">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] mb-8">
            <Zap className="w-3.5 h-3.5 fill-white" /> Live on Polygon Mainnet
          </div>
          <h1 className="text-6xl lg:text-[110px] font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter mb-10">
            Real Estate. <br />
            <span className="text-indigo-600">On Rails.</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-lg leading-relaxed mb-12">
            The world’s first end-to-end "Value Rail" for institutional land assets. Verify holdings, mint tokens, and settle instantly.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link to="/signup" className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-900 transition-all flex items-center justify-center gap-3 border-b-4 border-slate-900 shadow-xl">
              Start Investing <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-slate-900 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3].map(i => (
                  <img key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                ))}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Join 2,400+ Investors</p>
            </div>
          </div>
        </div>
        
        <div className="relative animate-in fade-in zoom-in duration-1000 delay-200">
          <div className="w-full aspect-square bg-indigo-50 dark:bg-slate-900 rounded-[3rem] relative overflow-hidden border-4 border-slate-900 group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
            
            {/* Asset Demo Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-white dark:bg-slate-900 rounded-3xl transform rotate-3 flex flex-col p-8 text-slate-900 dark:text-white border-4 border-slate-900 shadow-[20px_20px_0px_rgba(15,23,42,1)] hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white border-b-4 border-slate-900">
                  <Building2 className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Status: Active</span>
                  <div className="bg-emerald-500 h-2 w-2 rounded-full animate-ping"></div>
                </div>
              </div>
              
              <h3 className="font-black text-4xl tracking-tight mb-2">Heritage Acres</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" /> Sarjapur, BLR • PL-5600
              </p>

              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-2 border-slate-900">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual Yield</p>
                  <p className="text-2xl font-black text-indigo-600">12.5%</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border-2 border-slate-900">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Price</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">₹8,500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Section / Table */}
      <section className="max-w-7xl mx-auto px-8 py-32 w-full">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 uppercase">The New Asset Class</h2>
          <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.4em] text-xs leading-none">PropToken Value Rail vs Legacy Systems</p>
        </div>

        <div className="overflow-hidden border-4 border-slate-900 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[20px_20px_0px_rgba(79,70,229,1)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 dark:bg-black text-white">
                <th className="px-12 py-10 font-black uppercase tracking-[0.2em] text-[11px] border-r border-white/10">Feature Set</th>
                <th className="px-12 py-10 font-black uppercase tracking-[0.2em] text-[11px] text-center bg-slate-800 border-r border-white/10">Legacy Real Estate</th>
                <th className="px-12 py-10 font-black uppercase tracking-[0.2em] text-[11px] text-center bg-indigo-600">PropToken Rail</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100 dark:divide-slate-800">
              {[
                { cap: 'Instant Liquidity', legacy: false, rail: true, desc: 'Exit positions in seconds via Swap' },
                { cap: 'Real-Time Verification', legacy: false, rail: true, desc: 'On-chain land record synchronization' },
                { cap: 'Payment Utility', legacy: false, rail: true, desc: 'Direct merchant settlement from yield' },
                { cap: 'Fractional Entry', legacy: 'Limited', rail: true, desc: 'Invest with as little as ₹5,000' },
                { cap: 'Transparent Audit', legacy: true, rail: true, desc: 'Full public traceability' },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all">
                  <td className="px-12 py-8 border-r-2 border-slate-50 dark:border-slate-800">
                    <p className="font-black text-slate-900 dark:text-white text-2xl leading-none">{row.cap}</p>
                    <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{row.desc}</p>
                  </td>
                  <td className="px-12 py-8 bg-slate-50/30 dark:bg-slate-800/20 border-r-2 border-slate-50 dark:border-slate-800 text-center">
                    <div className="flex justify-center">
                      {row.legacy === true ? <CheckCircle2 className="w-6 h-6 text-slate-300" /> : 
                       row.legacy === false ? <XCircle className="w-6 h-6 text-red-400 opacity-20" /> :
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.legacy}</span>}
                    </div>
                  </td>
                  <td className="px-12 py-8 bg-indigo-50/30 dark:bg-indigo-900/10 text-center">
                    <div className="flex justify-center">
                      <CheckCircle2 className="w-8 h-8 text-indigo-600 fill-indigo-100 dark:fill-indigo-900/40" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-32 px-8 text-white w-full mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white border-b-4 border-slate-900">
              <Building2 className="w-7 h-7" />
            </div>
            <span>PropToken</span>
          </div>
          <div className="flex gap-12 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
            <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Compliance</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">INSTITUTIONAL ACCESS • POWERED BY POLYGON • 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
