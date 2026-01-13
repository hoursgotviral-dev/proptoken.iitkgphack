import React, { useState } from 'react';
import { 
  FileText, MapPin, Building2, DollarSign, Users, Upload, 
  ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, Loader2,
  Briefcase, FileCheck, Target
} from 'lucide-react';
import { SubmissionFormData, AssetCategory } from '../abmTypes';
import { createSubmission, runVerification } from '../abmApi';

interface Props {
  onSubmissionComplete: (submissionId: string) => void;
}

const STEPS = [
  { id: 1, title: 'Identity', icon: Users },
  { id: 2, title: 'Asset Info', icon: Building2 },
  { id: 3, title: 'SPV Details', icon: Briefcase },
  { id: 4, title: 'Documents', icon: FileText },
  { id: 5, title: 'Financials', icon: DollarSign },
  { id: 6, title: 'Review', icon: FileCheck },
];

const initialFormData: SubmissionFormData = {
  submitterId: '',
  walletAddress: '',
  did: '',
  signature: '',
  category: 'real-estate',
  assetName: '',
  location: {
    address: '',
    coordinates: { lat: 0, lng: 0 },
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
  },
  specifications: {
    size: 0,
    type: 'residential',
    age: 0,
    condition: 'good',
  },
  spv: {
    spvName: '',
    spvRegistrationNumber: '',
    jurisdiction: '',
    incorporationDate: '',
    registeredAddress: '',
    directors: [''],
    shareholderStructure: [{ holder: '', percentage: 100 }],
  },
  registryIds: [''],
  documentUrls: [''],
  imageUrls: [''],
  videoUrls: [],
  financials: {
    currentRent: 0,
    expectedYield: 0,
    annualExpenses: 0,
    occupancyRate: 100,
    tenantCount: 1,
    leaseTermsMonths: 12,
    historicalCashFlow: [],
  },
  claimedValue: 0,
  tokenizationIntent: '',
  targetRaise: 0,
};

const AssetSubmissionForm: React.FC<Props> = ({ onSubmissionComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SubmissionFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newData;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      // Generate signature (in production, this would be from wallet)
      const dataToSign = { ...formData, signature: '' };
      dataToSign.signature = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      dataToSign.submitterId = dataToSign.walletAddress;
      
      const result = await createSubmission(dataToSign);
      
      // Automatically run verification
      await runVerification(result.submissionId);
      
      onSubmissionComplete(result.submissionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Identity & Wallet</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Connect your identity for ownership verification</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Wallet Address *</label>
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                  value={formData.walletAddress}
                  onChange={e => updateFormData('walletAddress', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Decentralized ID (DID)</label>
                <input
                  type="text"
                  placeholder="did:polygon:..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                  value={formData.did}
                  onChange={e => updateFormData('did', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Asset Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Asset Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Sunrise Commercial Complex"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.assetName}
                  onChange={e => updateFormData('assetName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category *</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.category}
                  onChange={e => updateFormData('category', e.target.value)}
                >
                  <option value="real-estate">Real Estate</option>
                  <option value="private-credit">Private Credit</option>
                  <option value="commodity">Commodity</option>
                  <option value="ip-rights">IP Rights</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Property Type *</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.specifications.type}
                  onChange={e => updateFormData('specifications.type', e.target.value)}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agricultural">Agricultural</option>
                </select>
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Address *</label>
                <input
                  type="text"
                  placeholder="Full property address"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.location.address}
                  onChange={e => updateFormData('location.address', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">City *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.location.city}
                  onChange={e => updateFormData('location.city', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">State *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.location.state}
                  onChange={e => updateFormData('location.state', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Postal Code *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.location.postalCode}
                  onChange={e => updateFormData('location.postalCode', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.location.coordinates.lat || ''}
                  onChange={e => updateFormData('location.coordinates.lat', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.location.coordinates.lng || ''}
                  onChange={e => updateFormData('location.coordinates.lng', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Size (sq ft) *</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.specifications.size || ''}
                  onChange={e => updateFormData('specifications.size', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Age (years)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.specifications.age || ''}
                  onChange={e => updateFormData('specifications.age', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Condition *</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.specifications.condition}
                  onChange={e => updateFormData('specifications.condition', e.target.value)}
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">SPV Details</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Special Purpose Vehicle holding the asset</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">SPV Name *</label>
                <input
                  type="text"
                  placeholder="ABC Holdings Pvt Ltd"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.spv.spvName}
                  onChange={e => updateFormData('spv.spvName', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Registration Number *</label>
                <input
                  type="text"
                  placeholder="CIN/LLPIN"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.spv.spvRegistrationNumber}
                  onChange={e => updateFormData('spv.spvRegistrationNumber', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Jurisdiction *</label>
                <input
                  type="text"
                  placeholder="India - Karnataka"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.spv.jurisdiction}
                  onChange={e => updateFormData('spv.jurisdiction', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Incorporation Date *</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.spv.incorporationDate}
                  onChange={e => updateFormData('spv.incorporationDate', e.target.value)}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Registered Address *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.spv.registeredAddress}
                  onChange={e => updateFormData('spv.registeredAddress', e.target.value)}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Directors (comma-separated) *</label>
                <input
                  type="text"
                  placeholder="John Doe, Jane Smith"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.spv.directors.join(', ')}
                  onChange={e => updateFormData('spv.directors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Documents & Proofs</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Provide registry IDs and document URLs</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Property Registry IDs *</label>
                <input
                  type="text"
                  placeholder="Survey No., Khata No., etc. (comma-separated)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.registryIds.join(', ')}
                  onChange={e => updateFormData('registryIds', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Document URLs</label>
                <input
                  type="text"
                  placeholder="URLs to title deeds, encumbrance cert (comma-separated)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.documentUrls.join(', ')}
                  onChange={e => updateFormData('documentUrls', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Image URLs *</label>
                <input
                  type="text"
                  placeholder="URLs to property images (comma-separated)"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.imageUrls.join(', ')}
                  onChange={e => updateFormData('imageUrls', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                />
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Financial Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.financials.currentRent || ''}
                  onChange={e => updateFormData('financials.currentRent', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Expected Yield (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.financials.expectedYield || ''}
                  onChange={e => updateFormData('financials.expectedYield', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Annual Expenses (₹) *</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.financials.annualExpenses || ''}
                  onChange={e => updateFormData('financials.annualExpenses', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Occupancy Rate (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.financials.occupancyRate || ''}
                  onChange={e => updateFormData('financials.occupancyRate', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tenant Count</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.financials.tenantCount || ''}
                  onChange={e => updateFormData('financials.tenantCount', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lease Terms (months)</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.financials.leaseTermsMonths || ''}
                  onChange={e => updateFormData('financials.leaseTermsMonths', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Claimed Value (₹) *</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.claimedValue || ''}
                  onChange={e => updateFormData('claimedValue', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Raise (₹) *</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                  value={formData.targetRaise || ''}
                  onChange={e => updateFormData('targetRaise', parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tokenization Intent *</label>
                <textarea
                  rows={3}
                  placeholder="Why do you want to tokenize this asset? What are your goals?"
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 outline-none resize-none"
                  value={formData.tokenizationIntent}
                  onChange={e => updateFormData('tokenizationIntent', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Review Submission</h3>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Asset: {formData.assetName || 'Not specified'}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formData.location.address}, {formData.location.city}</p>
                <div className="mt-2 flex gap-2">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded">{formData.category}</span>
                  <span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">{formData.specifications.size} sq ft</span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">SPV: {formData.spv.spvName || 'Not specified'}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Reg: {formData.spv.spvRegistrationNumber}</p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Financials</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-slate-500 dark:text-slate-400">Claimed Value:</span> <span className="font-bold text-slate-900 dark:text-white">₹{formData.claimedValue.toLocaleString()}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400">Expected Yield:</span> <span className="font-bold text-slate-900 dark:text-white">{formData.financials.expectedYield}%</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400">Monthly Rent:</span> <span className="font-bold text-slate-900 dark:text-white">₹{formData.financials.currentRent.toLocaleString()}</span></div>
                  <div><span className="text-slate-500 dark:text-slate-400">Target Raise:</span> <span className="font-bold text-slate-900 dark:text-white">₹{formData.targetRaise.toLocaleString()}</span></div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-amber-800 dark:text-amber-200">Verification Process</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Upon submission, your asset will go through Oracle verification, ABM analysis, fraud detection, and consensus scoring. This process is fully autonomous with no human intervention.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex flex-col items-center cursor-pointer ${currentStep >= step.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  currentStep === step.id 
                    ? 'bg-indigo-600 text-white' 
                    : currentStep > step.id 
                      ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                      : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className="text-xs font-bold hidden sm:block">{step.title}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-slate-200 dark:border-slate-800 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-700 dark:text-red-300 font-medium">{error}</span>
          </div>
        )}
        
        {renderStep()}
        
        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
            >
              Next <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
              ) : (
                <><Target className="w-5 h-5" /> Submit for Verification</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetSubmissionForm;
