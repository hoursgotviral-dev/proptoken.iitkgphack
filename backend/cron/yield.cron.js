import cron from "node-cron";
import db from "./db.js";

cron.schedule("0 0 1 * *", async () => {
  const income = 100000;

  const holders = await db.query(`
    SELECT o.user_id, SUM(o.balance) AS bal
    FROM ownerships o
    GROUP BY o.user_id
  `);

  const total = holders.rows.reduce((a, b) => a + Number(b.bal), 0);

  for (const h of holders.rows) {
    const share = (income * h.bal) / total;

    await db.query(
      "INSERT INTO yield_distributions(user_id,amount) VALUES($1,$2)",
      [h.user_id, share]
    );
  }

  console.log("✅ Yield distributed");
});
