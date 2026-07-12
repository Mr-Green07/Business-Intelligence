/**
 * seed.js — Creates the `users` table and inserts test users.
 *
 * Run once before starting the server:
 *   npm run seed
 *
 * Safe to re-run: ON CONFLICT DO NOTHING skips existing emails.
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const { query, pool } = require("./config/db");

const TEST_USERS = [
  {
    name:     "Yuvraj Singh",
    email:    "yuvraj@businessiq.in",
    password: "Yuvraj@123",
    role:     "admin",
  },
  {
    name:     "Simran Yadav",
    email:    "simran@businessiq.in",
    password: "Simran@123",
    role:     "analyst",
  },
];

async function seed() {
  console.log("🌱  Starting seed...\n");

  // ── 1. Create table ────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(100)  NOT NULL,
      email         VARCHAR(255)  UNIQUE NOT NULL,
      password_hash VARCHAR(255)  NOT NULL,
      role          VARCHAR(50)   NOT NULL DEFAULT 'analyst',
      created_at    TIMESTAMP     DEFAULT NOW()
    )
  `);
  console.log("✓  users table ready");

  // ── 2. Insert test users ───────────────────────────────────────────────────
  for (const u of TEST_USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [u.name, u.email, hash, u.role]
    );
    console.log(`✓  ${u.name}  (${u.email})  role: ${u.role}`);
  }

  console.log("\n✅  Seed complete!\n");
  console.log("Test credentials");
  console.log("─────────────────────────────────────");
  console.log("  Email   : yuvraj@businessiq.in");
  console.log("  Password: Yuvraj@123");
  console.log("  Role    : admin\n");
  console.log("  Email   : simran@businessiq.in");
  console.log("  Password: Simran@123");
  console.log("  Role    : analyst");
  console.log("─────────────────────────────────────\n");

  await pool.end();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
