'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSubmission } from '@/lib/api';

export default function AssetSubmissionForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        did: 'did:polygon:123456789', // Mock
        walletSignature: '0xmocksignature', // Mock
        category: 'real-estate',
        tokenizationIntent: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            coordinates: { lat: 0, lng: 0 }
        },
        financials: {
            expectedYield: 0,
            expenses: 0,
            cashFlow: 0
        },
        registryIds: [],
        imageUrls: []
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Basic transformation to match DTO structure if needed
            const submission = await createSubmission(formData);
            router.push(`/verification/${submission.submissionId}`);
        } catch (error) {
            console.error(error);
            alert('Failed to submit asset');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (section: string, field: string, value: any) => {
        if (section === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            // @ts-ignore
            setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6">Submit Asset for ABM Verification</h2>

            {/* Asset Data */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Asset Details</h3>
                <div>
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        value={formData.category}
                        onChange={(e) => handleChange('root', 'category', e.target.value)}
                    >
                        <option value="real-estate">Real Estate</option>
                        <option value="commercial">Commercial</option>
                        <option value="commodity">Commodity</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Intent</label>
                    <textarea
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        rows={3}
                        value={formData.tokenizationIntent}
                        onChange={(e) => handleChange('root', 'tokenizationIntent', e.target.value)}
                        placeholder="Why do you want to tokenize this asset?"
                    />
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Address"
                        className="col-span-2 rounded border p-2"
                        value={formData.location.address}
                        onChange={(e) => handleChange('location', 'address', e.target.value)}
                    />
                    <input
                        type="text" placeholder="City" className="rounded border p-2"
                        value={formData.location.city}
                        onChange={(e) => handleChange('location', 'city', e.target.value)}
                    />
                    <input
                        type="text" placeholder="Country" className="rounded border p-2"
                        value={formData.location.country}
                        onChange={(e) => handleChange('location', 'country', e.target.value)}
                    />
                </div>
            </div>

            {/* Financials */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Financials</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs">Expected Yield (%)</label>
                        <input
                            type="number" step="0.1" className="w-full rounded border p-2"
                            value={formData.financials.expectedYield}
                            onChange={(e) => handleChange('financials', 'expectedYield', parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs">Annual Expenses</label>
                        <input
                            type="number" className="w-full rounded border p-2"
                            value={formData.financials.expenses}
                            onChange={(e) => handleChange('financials', 'expenses', parseFloat(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                {loading ? 'Submitting...' : 'Submit for Autonomous Verification'}
            </button>
        </form>
    );
}
