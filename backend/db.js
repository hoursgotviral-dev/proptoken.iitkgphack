import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "proptoken",
    password: process.env.DB_PASSWORD || "password",
    port: process.env.DB_PORT || 5432,
  };

const pool = new Pool(poolConfig);

// Helper for absolute path in modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const query = (text, params) => pool.query(text, params);

export const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schemaSql);
    console.log("✅ Database schema initialized");
  } catch (err) {
    console.error("❌ Database initialization failed:", err);
  }
};

export default {
  query,
  initDB
};
