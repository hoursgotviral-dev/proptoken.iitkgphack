import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    address: { type: String, required: true, lowercase: true },
    stablecoinBalance: { type: Number, default: 0 },
    txHistory: [{ type: Object }], // Store simplified history
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Wallet', walletSchema);
