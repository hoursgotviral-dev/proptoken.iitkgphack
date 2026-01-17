import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Register
router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (!['CLIENT', 'BUILDER'].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Use CLIENT or BUILDER" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Transaction: Create user -> Create wallet
    const userRes = await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role]
    );
    const user = userRes.rows[0];

    // Initialize wallet
    await db.query("INSERT INTO wallets (user_id) VALUES ($1)", [user.id]);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Registration Error Details:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
    });
    if (err.code === '23505') { // Unique violation
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
