import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Order {
    id: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    maker: string;
    timestamp: number;
}

interface OrderBook {
    bids: Order[];
    asks: Order[];
}

const TradingPage: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const navigate = useNavigate();

    const [orderBook, setOrderBook] = useState<OrderBook>({ bids: [], asks: [] });
    const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [recentTrades, setRecentTrades] = useState<any[]>([]);

    useEffect(() => {
        loadOrderBook();
        loadRecentTrades();
    }, [address]);

    const loadOrderBook = () => {
        // Mock order book data
        const mockBids: Order[] = [
            { id: '1', type: 'buy', price: 9950, amount: 10, total: 99500, maker: '0x123...', timestamp: Date.now() },
            { id: '2', type: 'buy', price: 9900, amount: 25, total: 247500, maker: '0x456...', timestamp: Date.now() },
            { id: '3', type: 'buy', price: 9850, amount: 15, total: 147750, maker: '0x789...', timestamp: Date.now() },
        ];

        const mockAsks: Order[] = [
            { id: '4', type: 'sell', price: 10050, amount: 8, total: 80400, maker: '0xabc...', timestamp: Date.now() },
            { id: '5', type: 'sell', price: 10100, amount: 20, total: 202000, maker: '0xdef...', timestamp: Date.now() },
            { id: '6', type: 'sell', price: 10150, amount: 12, total: 121800, maker: '0xghi...', timestamp: Date.now() },
        ];

        setOrderBook({ bids: mockBids, asks: mockAsks });
    };

    const loadRecentTrades = () => {
        const mockTrades = [
            { price: 10000, amount: 5, time: new Date(Date.now() - 60000).toLocaleTimeString(), type: 'buy' },
            { price: 9980, amount: 12, time: new Date(Date.now() - 120000).toLocaleTimeString(), type: 'sell' },
            { price: 10020, amount: 8, time: new Date(Date.now() - 180000).toLocaleTimeString(), type: 'buy' },
        ];
        setRecentTrades(mockTrades);
    };

    const handlePlaceOrder = () => {
        if (!price || !amount) {
            alert('Please enter price and amount');
            return;
        }

        // In production: call backend API to place order
        console.log(`Placing ${orderType} order: ${amount} tokens @ $${price}`);
        alert(`Order placed! (Mock - in production this would submit to order book)`);

        setPrice('');
        setAmount('');
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    const totalCost = parseFloat(price || '0') * parseFloat(amount || '0');
    const spread = orderBook.asks[0] && orderBook.bids[0]
        ? orderBook.asks[0].price - orderBook.bids[0].price
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-300 hover:text-white mb-2 flex items-center gap-2"
                        >
                            ← Back
                        </button>
                        <h1 className="text-4xl font-bold">Secondary Market Trading</h1>
                        <p className="text-gray-300">Token: {address?.substring(0, 10)}...</p>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-gray-400">Current Spread</div>
                        <div className="text-2xl font-bold">{formatCurrency(spread)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Book */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Book Display */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold mb-6">Order Book</h2>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Bids (Buy Orders) */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-green-400">Bids (Buy)</h3>
                                    <div className="space-y-2">
                                        {orderBook.bids.map((order) => (
                                            <div key={order.id} className="bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-semibold text-green-400">{formatCurrency(order.price)}</span>
                                                    <span className="text-sm text-gray-400">{order.amount} tokens</span>
                                                </div>
                                                <div className="text-xs text-gray-500">Total: {formatCurrency(order.total)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Asks (Sell Orders) */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 text-red-400">Asks (Sell)</h3>
                                    <div className="space-y-2">
                                        {orderBook.asks.map((order) => (
                                            <div key={order.id} className="bg-red-500/10 p-3 rounded-lg border border-red-500/30">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-semibold text-red-400">{formatCurrency(order.price)}</span>
                                                    <span className="text-sm text-gray-400">{order.amount} tokens</span>
                                                </div>
                                                <div className="text-xs text-gray-500">Total: {formatCurrency(order.total)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Trades */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h2 className="text-2xl font-bold mb-6">Recent Trades</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/20">
                                            <th className="text-left py-2">Price</th>
                                            <th className="text-right py-2">Amount</th>
                                            <th className="text-right py-2">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentTrades.map((trade, index) => (
                                            <tr key={index} className="border-b border-white/10">
                                                <td className={`py-2 font-semibold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {formatCurrency(trade.price)}
                                                </td>
                                                <td className="text-right py-2">{trade.amount}</td>
                                                <td className="text-right py-2 text-gray-400 text-sm">{trade.time}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Order Placement Form */}
                    <div className="space-y-6">
                        {/* Order Type Selector */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setOrderType('buy')}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${orderType === 'buy'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => setOrderType('sell')}
                                    className={`flex-1 py-3 rounded-lg font-semibold transition-all ${orderType === 'sell'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Sell
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price (USD)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                    />
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

                                <div className="bg-white/5 p-4 rounded-lg">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">Total Cost</span>
                                        <span className="font-bold text-lg">{formatCurrency(totalCost)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={!price || !amount}
                                    className={`w-full py-3 rounded-lg font-semibold transition-all ${orderType === 'buy'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            : 'bg-gradient-to-r from-red-500 to-rose-500'
                                        } hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Place {orderType === 'buy' ? 'Buy' : 'Sell'} Order
                                </button>

                                <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
                                    <p className="text-xs text-yellow-200">
                                        ⚠️ Orders are subject to compliance checks. Only verified investors can trade.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Market Info */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-lg font-bold mb-4">Market Info</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Best Bid</span>
                                    <span className="font-semibold text-green-400">
                                        {orderBook.bids[0] ? formatCurrency(orderBook.bids[0].price) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Best Ask</span>
                                    <span className="font-semibold text-red-400">
                                        {orderBook.asks[0] ? formatCurrency(orderBook.asks[0].price) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">24h Volume</span>
                                    <span className="font-semibold">$245,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">24h Change</span>
                                    <span className="font-semibold text-green-400">+2.4%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradingPage;
