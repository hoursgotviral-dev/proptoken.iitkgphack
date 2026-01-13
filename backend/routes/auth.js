import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await db.query(
    "INSERT INTO users(email, password_hash) VALUES($1,$2) RETURNING id,email",
    [email, hash]
  );

  res.json(user.rows[0]);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length) return res.status(401).json({ error: "User not found" });

  const valid = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!valid) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    { userId: user.rows[0].id },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

export default router;
