import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import assetRoutes from "./routes/assets.js";
import walletRoutes from "./routes/wallet.js";
import dashboardRoutes from "./routes/dashboard.js";
import yieldRoutes from "./routes/yield.js";
import accountRoutes from "./routes/account.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/assets", assetRoutes);
app.use("/wallet", walletRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/yield", yieldRoutes);
app.use("/account", accountRoutes);

app.get("/", (req, res) => {
  res.json({ status: "PropToken backend running" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
