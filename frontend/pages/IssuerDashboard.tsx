import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface IssuedToken {
    address: string;
    name: string;
    symbol: string;
    totalSupply: string;
    currentNAV: string;
    navPerToken: string;
    holders: number;
    totalValue: number;
}

const IssuerDashboard: React.FC = () => {
    const { user, wallet } = useAuth();
    const navigate = useNavigate();
    const [tokens, setTokens] = useState<IssuedToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedToken, setSelectedToken] = useState<string>('');
    const [newNAV, setNewNAV] = useState('');

    useEffect(() => {
        if (!user || !wallet) {
            navigate('/signin');
            return;
        }
        loadIssuedTokens();
    }, [user, wallet]);

    const loadIssuedTokens = async () => {
        try {
            setLoading(true);

            // Mock data - in production, fetch from backend/subgraph
            const mockTokens: IssuedToken[] = [
                {
                    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
                    name: 'DLF Cyber Hub Token',
                    symbol: 'DLFCH',
                    totalSupply: '10000',
                    currentNAV: '100000000',
                    navPerToken: '10000',
                    holders: 45,
                    totalValue: 100000000,
                },
                {
                    address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
                    name: 'One Horizon Token',
                    symbol: 'OHC',
                    totalSupply: '5000',
                    currentNAV: '75000000',
                    navPerToken: '15000',
                    holders: 32,
                    totalValue: 75000000,
                },
            ];

            setTokens(mockTokens);
            setLoading(false);
        } catch (error) {
            console.error('Error loading tokens:', error);
            setLoading(false);
        }
    };

    const handleUpdateNAV = async () => {
        if (!selectedToken || !newNAV) {
            alert('Please select a token and enter new NAV');
            return;
        }

        try {
            // In production: call smart contract updateNAV function
            console.log(`Updating NAV for ${selectedToken} to ${newNAV}`);
            alert(`NAV update submitted! (Mock - in production this would call the smart contract)`);
            setNewNAV('');
            setSelectedToken('');
        } catch (error) {
            console.error('Error updating NAV:', error);
            alert('Failed to update NAV');
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const totalAUM = tokens.reduce((sum, t) => sum + t.totalValue, 0);
    const totalHolders = tokens.reduce((sum, t) => sum + t.holders, 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Issuer Dashboard</h1>
                    <p className="text-gray-300">Manage your tokenized assets</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-300 text-sm mb-2">Active Tokens</div>
                        <div className="text-3xl font-bold">{tokens.length}</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-300 text-sm mb-2">Total AUM</div>
                        <div className="text-3xl font-bold">{formatCurrency(totalAUM)}</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-300 text-sm mb-2">Total Investors</div>
                        <div className="text-3xl font-bold">{totalHolders}</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <div className="text-gray-300 text-sm mb-2">Avg Yield</div>
                        <div className="text-3xl font-bold">8.2%</div>
                    </div>
                </div>

                {/* NAV Management */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Update NAV</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Token</label>
                            <select
                                value={selectedToken}
                                onChange={(e) => setSelectedToken(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="">Choose a token...</option>
                                {tokens.map((token) => (
                                    <option key={token.address} value={token.address}>
                                        {token.name} ({token.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">New NAV (USD)</label>
                            <input
                                type="number"
                                value={newNAV}
                                onChange={(e) => setNewNAV(e.target.value)}
                                placeholder="Enter new NAV..."
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleUpdateNAV}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity"
                            >
                                Update NAV
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-200">
                            ⚠️ NAV updates are permanent and will affect all token holders. Ensure accuracy before submitting.
                        </p>
                    </div>
                </div>

                {/* Tokens Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-bold mb-6">Your Tokens</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4">Token</th>
                                    <th className="text-right py-3 px-4">Total Supply</th>
                                    <th className="text-right py-3 px-4">Current NAV</th>
                                    <th className="text-right py-3 px-4">NAV/Token</th>
                                    <th className="text-right py-3 px-4">Holders</th>
                                    <th className="text-right py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tokens.map((token, index) => (
                                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-semibold">{token.name}</div>
                                                <div className="text-sm text-gray-400">{token.symbol}</div>
                                            </div>
                                        </td>
                                        <td className="text-right py-4 px-4">{token.totalSupply}</td>
                                        <td className="text-right py-4 px-4">
                                            {formatCurrency(token.totalValue)}
                                        </td>
                                        <td className="text-right py-4 px-4">
                                            {formatCurrency(parseFloat(token.navPerToken))}
                                        </td>
                                        <td className="text-right py-4 px-4">{token.holders}</td>
                                        <td className="text-right py-4 px-4">
                                            <button
                                                onClick={() => navigate(`/tokens/${token.address}`)}
                                                className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity text-sm"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IssuerDashboard;
