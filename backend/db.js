import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    // Determine URI: Use Env var or default local
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/proptoken';

    await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    // Don't exit process, just log error, so server can stay alive for retries if needed
  }
};

export default { initDB: connectDB };
