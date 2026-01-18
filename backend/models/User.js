import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Common
    walletAddress: { type: String, required: true, unique: true, lowercase: true },
    walletType: { type: String, enum: ['embedded', 'external'], required: true },

    // Non-crypto users (Embedded)
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String },
    encryptedPrivateKey: { type: String }, // Simulation of custodial key

    // Crypto users (External)
    nonce: { type: String, default: () => Math.floor(Math.random() * 1000000).toString() },

    createdAt: { type: Date, default: Date.now },
    role: { type: String, enum: ['CLIENT', 'BUILDER', 'ADMIN'], default: 'CLIENT' },
});

export default mongoose.model('User', userSchema);
