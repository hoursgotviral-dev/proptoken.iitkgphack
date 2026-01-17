import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import assetRoutes from "./routes/assets.js";
import walletRoutes from "./routes/wallet.js";
import dashboardRoutes from "./routes/dashboard.js";
import yieldRoutes from "./routes/yield.js";
import accountRoutes from "./routes/account.js";
import swapRoutes from "./routes/swap.js";          // ✅ ADD
import collateralRoutes from "./routes/collateral.js"; // ✅ ADD
import activityRoutes from "./routes/activity.js";     // ✅ Blockchain Activity Feed

import "./cron/yieldCron.js"; // Auto-start Cron Jobs

dotenv.config();

const app = express();

// CORS Configuration - Allow frontend
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',  // Alternative port
    'http://localhost:4173',  // Vite preview
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/assets", assetRoutes);
app.use("/wallet", walletRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/yield", yieldRoutes);
app.use("/account", accountRoutes);
app.use("/swap", swapRoutes);              // ✅ ADD
app.use("/collateral", collateralRoutes);  // ✅ ADD
app.use("/activity", activityRoutes);      // ✅ Blockchain Activity Feed

app.get("/", (req, res) => {
  res.json({ status: "PropToken backend running" });
});

import db from "./db.js";

const PORT = process.env.PORT || 4000;

// Initialize DB then start server
db.initDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
