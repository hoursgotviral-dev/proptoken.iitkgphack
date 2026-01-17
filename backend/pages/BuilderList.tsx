
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, DollarSign, FileText, Upload, CheckCircle2, ChevronRight, Loader2, Info } from 'lucide-react';

const BuilderList: React.FC = () => {
  const { listAsset } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    valuation: 0,
    yieldPercent: 8.5,
    risk: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  const [docs, setDocs] = useState({
    titleDeed: false,
    registryExtract: false,
    taxReceipt: false
  });

  const handleList = async () => {
    setIsSubmitting(true);
    try {
      await listAsset({
        ...formData,
        totalTokens: 10000,
        tokenPrice: formData.valuation / 10000,
      });
      navigate('/verify');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.name && formData.location && formData.valuation > 0;
  const isStep2Valid = docs.titleDeed && docs.registryExtract;

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fintech-fade pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">List New Asset</h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em]">Institutional Registry Submission</p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`flex items-center gap-2 ${step >= i ? 'text-indigo-600' : 'text-slate-300'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-xs ${step === i ? 'border-indigo-600 bg-indigo-50' : step > i ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200'}`}>
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
            {i < 3 && <div className={`w-12 h-0.5 ${step > i ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>

      <div className="fintech-card p-10 shadow-2xl bg-white border border-slate-100">
        {step === 1 && (
          <div className="space-y-8 animate-fintech-fade">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Property Fundamentals</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registry Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Skyline Residency"
                  className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="City, State"
                    className="w-full pl-14 pr-6 py-4 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Total Valuation (INR)</label>
                <div className="relative">
                  <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full pl-14 pr-6 py-4 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all"
                    value={formData.valuation || ''}
                    onChange={e => setFormData({...formData, valuation: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Risk Profile</label>
                <select 
                  className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 font-bold outline-none focus:ring-4 focus:ring-indigo-600/5 transition-all appearance-none"
                  value={formData.risk}
                  onChange={e => setFormData({...formData, risk: e.target.value as any})}
                >
                  <option value="Low">Low Risk (Prime)</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                </select>
              </div>
            </div>
            <button 
              disabled={!isStep1Valid}
              onClick={() => setStep(2)}
              className="w-full bg-slate-900 text-white py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              Continue to Documents <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fintech-fade">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Registry Documentation</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'titleDeed', name: 'Primary Title Deed', desc: 'Proof of absolute ownership' },
                { id: 'registryExtract', name: 'Registry Extract (7/12)', desc: 'Official land record snapshot' },
                { id: 'taxReceipt', name: 'Recent Tax Receipt', desc: 'Proof of no pending dues' }
              ].map(doc => (
                <div key={doc.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-indigo-600/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:text-indigo-600 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{doc.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{doc.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDocs({...docs, [doc.id]: !docs[doc.id as keyof typeof docs]})}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${docs[doc.id as keyof typeof docs] ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-600'}`}
                  >
                    {docs[doc.id as keyof typeof docs] ? 'Uploaded' : 'Upload'}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-full border-2 border-slate-100 font-black uppercase tracking-widest text-[11px] text-slate-500">Back</button>
              <button 
                disabled={!isStep2Valid}
                onClick={() => setStep(3)}
                className="flex-[2] bg-slate-900 text-white py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-xl disabled:opacity-50"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-fintech-fade py-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase">Ready for Audit</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">
                By submitting, you authorize PropToken's institutional verifiers to audit these records against the local land registry.
              </p>
            </div>

            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-4">
               <div className="flex items-center gap-3 text-indigo-700">
                  <Info className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">Digital Declaration</span>
               </div>
               <p className="text-[11px] font-medium text-indigo-600/80 leading-relaxed italic">
                 "I hereby declare that the property {formData.name} is free of all encumbrances and I am the lawful owner with the right to fractionalize these assets."
               </p>
            </div>

            <button 
              disabled={isSubmitting}
              onClick={handleList}
              className="w-full primary-gradient text-white py-6 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-2xl flex items-center justify-center gap-4 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit for Verification"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderList;
