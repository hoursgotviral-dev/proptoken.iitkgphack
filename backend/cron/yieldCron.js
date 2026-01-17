import cron from "node-cron";
import db from "../db.js";

// Monthly Yield Distribution Cron Job
// Schedule: Run at midnight on the 1st of every month
cron.schedule("0 0 1 * *", async () => {
    console.log("Processing Monthly Yield Distribution...");

    try {
        // 1. Get all pending rental income
        const incomeRes = await db.query("SELECT * FROM rental_income WHERE status = 'PENDING'");
        const incomes = incomeRes.rows;

        if (incomes.length === 0) {
            console.log("No pending rental income to distribute.");
            return;
        }

        for (const income of incomes) {
            // 2. Get asset details to know total fractions
            const assetRes = await db.query("SELECT * FROM asset_fractions WHERE asset_id = $1", [income.asset_id]);
            if (assetRes.rows.length === 0) continue;

            const assetStats = assetRes.rows[0];
            const totalFractions = assetStats.total_fractions;

            // 3. Get all owners of this asset
            const ownersRes = await db.query("SELECT * FROM ownerships WHERE asset_id = $1 AND balance > 0", [income.asset_id]);
            const owners = ownersRes.rows;

            // 4. Distribute proportionally
            await db.query("BEGIN");

            for (const owner of owners) {
                const share = owner.balance / totalFractions;
                const payout = (income.amount * share).toFixed(2); // Simple precision

                // Credit Wallet
                await db.query("UPDATE wallets SET stablecoin_balance = stablecoin_balance + $1 WHERE user_id = $2", [payout, owner.user_id]);

                // Record Distribution
                await db.query(
                    "INSERT INTO yield_distributions (rental_income_id, user_id, amount) VALUES ($1, $2, $3)",
                    [income.id, owner.user_id, payout]
                );
            }

            // 5. Mark income as distributed
            await db.query("UPDATE rental_income SET status = 'DISTRIBUTED' WHERE id = $1", [income.id]);

            await db.query("COMMIT");
            console.log(`Distributed $${income.amount} for Asset ID ${income.asset_id}`);
        }

    } catch (err) {
        console.error("Error in Yield Cron:", err);
        // In production, rolling back properly if inside a big transaction, 
        // but here we did per-asset transactions.
    }
});

console.log("📅 Yield Cron Job Scheduled: 0 0 1 * *");
