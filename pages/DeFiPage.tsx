import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LendingPool {
    tokenAddress: string;
    tokenName: string;
    tokenSymbol: string;
    apy: number;
    tvl: number;
    available: number;
}

interface CollateralPosition {
    tokenAddress: string;
    tokenName: string;
    collateralAmount: number;
    borrowedAmount: number;
    ltv: number;
    liquidationPrice: number;
}

const DeFiPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<'lend' | 'borrow' | 'collateral'>('lend');
    const [selectedPool, setSelectedPool] = useState('');
    const [amount, setAmount] = useState('');

    // Mock lending pools
    const lendingPools: LendingPool[] = [
        {
            tokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            tokenName: 'DLF Cyber Hub Token',
            tokenSymbol: 'DLFCH',
            apy: 8.5,
            tvl: 5000000,
            available: 1200000,
        },
        {
            tokenAddress: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
            tokenName: 'One Horizon Token',
            tokenSymbol: 'OHC',
            apy: 9.2,
            tvl: 3500000,
            available: 850000,
        },
    ];

    // Mock collateral positions
    const collateralPositions: CollateralPosition[] = [
        {
            tokenAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
            tokenName: 'DLF Cyber Hub Token',
            collateralAmount: 100,
            borrowedAmount: 500000,
            ltv: 50,
            liquidationPrice: 8000,
        },
    ];

    const handleLend = () => {
        if (!selectedPool || !amount) {
            alert('Please select a pool and enter amount');
            return;
        }
        alert(`Lending ${amount} tokens! (Mock - in production this would interact with lending protocol)`);
        setAmount('');
    };

    const handleBorrow = () => {
        if (!selectedPool || !amount) {
            alert('Please select collateral and enter amount');
            return;
        }
        alert(`Borrowing $${amount}! (Mock - in production this would create a collateralized loan)`);
        setAmount('');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Please sign in to access DeFi features</h2>
                    <button
                        onClick={() => navigate('/signin')}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">DeFi Hub</h1>
                    <p className="text-gray-300">Lend, borrow, and use your RWA tokens as collateral</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('lend')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'lend'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        Lend & Earn
                    </button>
                    <button
                        onClick={() => setActiveTab('borrow')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'borrow'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        Borrow
                    </button>
                    <button
                        onClick={() => setActiveTab('collateral')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'collateral'
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                                : 'bg-white/10 hover:bg-white/20'
                            }`}
                    >
                        My Positions
                    </button>
                </div>

                {/* Lend Tab */}
                {activeTab === 'lend' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-6">Lending Pools</h2>

                                <div className="space-y-4">
                                    {lendingPools.map((pool) => (
                                        <div
                                            key={pool.tokenAddress}
                                            className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                                            onClick={() => setSelectedPool(pool.tokenAddress)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold">{pool.tokenName}</h3>
                                                    <p className="text-gray-400">{pool.tokenSymbol}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-green-400">{pool.apy}% APY</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="text-sm text-gray-400">Total Value Locked</div>
                                                    <div className="font-semibold">{formatCurrency(pool.tvl)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-400">Available to Lend</div>
                                                    <div className="font-semibold">{formatCurrency(pool.available)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-4">Lend Tokens</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Select Pool</label>
                                        <select
                                            value={selectedPool}
                                            onChange={(e) => setSelectedPool(e.target.value)}
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="">Choose a pool...</option>
                                            {lendingPools.map((pool) => (
                                                <option key={pool.tokenAddress} value={pool.tokenAddress}>
                                                    {pool.tokenName} - {pool.apy}% APY
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Amount (tokens)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <button
                                        onClick={handleLend}
                                        disabled={!selectedPool || !amount}
                                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Lend & Earn
                                    </button>

                                    <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30">
                                        <p className="text-sm text-blue-200">
                                            💡 Earn passive yield by lending your RWA tokens. Interest is paid in the same token.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Borrow Tab */}
                {activeTab === 'borrow' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold mb-6">Collateral Calculator</h2>

                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 rounded-xl">
                                        <h3 className="text-lg font-semibold mb-4">How it works</h3>
                                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                                            <li>Deposit your RWA tokens as collateral</li>
                                            <li>Borrow up to 50% of your collateral value (LTV)</li>
                                            <li>Pay interest on borrowed amount</li>
                                            <li>Repay loan to unlock collateral</li>
                                        </ol>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="text-sm text-gray-400 mb-1">Max LTV</div>
                                            <div className="text-2xl font-bold">50%</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="text-sm text-gray-400 mb-1">Liquidation LTV</div>
                                            <div className="text-2xl font-bold text-red-400">75%</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="text-sm text-gray-400 mb-1">Borrow APR</div>
                                            <div className="text-2xl font-bold">6.5%</div>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-lg">
                                            <div className="text-sm text-gray-400 mb-1">Liquidation Fee</div>
                                            <div className="text-2xl font-bold">10%</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-xl font-bold mb-4">Borrow Against Collateral</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Collateral Token</label>
                                        <select
                                            value={selectedPool}
                                            onChange={(e) => setSelectedPool(e.target.value)}
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        >
                                            <option value="">Choose collateral...</option>
                                            {lendingPools.map((pool) => (
                                                <option key={pool.tokenAddress} value={pool.tokenAddress}>
                                                    {pool.tokenName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">Borrow Amount (USD)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>

                                    <button
                                        onClick={handleBorrow}
                                        disabled={!selectedPool || !amount}
                                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Borrow
                                    </button>

                                    <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/30">
                                        <p className="text-sm text-yellow-200">
                                            ⚠️ Monitor your LTV ratio to avoid liquidation. Maintain healthy collateral levels.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collateral Positions Tab */}
                {activeTab === 'collateral' && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                        <h2 className="text-2xl font-bold mb-6">Your Collateral Positions</h2>

                        {collateralPositions.length > 0 ? (
                            <div className="space-y-4">
                                {collateralPositions.map((position, index) => (
                                    <div key={index} className="bg-white/5 p-6 rounded-xl border border-white/10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{position.tokenName}</h3>
                                                <p className="text-gray-400">Collateral Position</p>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg ${position.ltv < 60 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                LTV: {position.ltv}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-400">Collateral</div>
                                                <div className="font-semibold">{position.collateralAmount} tokens</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-400">Borrowed</div>
                                                <div className="font-semibold">{formatCurrency(position.borrowedAmount)}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-400">Liquidation Price</div>
                                                <div className="font-semibold text-red-400">{formatCurrency(position.liquidationPrice)}</div>
                                            </div>
                                            <div>
                                                <button className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg hover:opacity-80 transition-opacity text-sm font-semibold">
                                                    Manage
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p>No active collateral positions</p>
                                <button
                                    onClick={() => setActiveTab('borrow')}
                                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-80"
                                >
                                    Start Borrowing
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeFiPage;
