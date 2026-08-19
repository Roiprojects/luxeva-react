// One-time script: creates the first admin user if none exists.
// Usage:  node scripts/seed-admin.mjs
//         npm run db:seed-admin

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import crypto from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

for (const file of [".env.local", ".env"]) {
  const p = join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const EMAIL     = "admin@luxeva.com";
const PASSWORD  = "Admin@123";
const FULL_NAME = "Luxeva Admin";
const ROLE      = "super_admin";

const url = process.env.DATABASE_URL;
if (!url) { console.error("✖ DATABASE_URL not set"); process.exit(1); }

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) =>
    crypto.scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 }, (err, key) =>
      err ? reject(err) : resolve(key)));
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key  = await scryptAsync(password, salt);
  return `${salt}:${Buffer.from(key).toString("hex")}`;
}

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

try {
  await client.connect();

  const { rows: existing } = await client.query(
    "select count(*)::int as count from admin_users where lower(email) = lower($1)",
    [EMAIL],
  );
  if (existing[0].count > 0) {
    console.log(`ℹ  Admin user ${EMAIL} already exists — skipping.`);
    process.exit(0);
  }

  const passwordHash = await hashPassword(PASSWORD);
  const { rows } = await client.query(
    `insert into admin_users (email, password_hash, full_name, role)
     values ($1, $2, $3, $4)
     returning id, email, full_name as "fullName", role`,
    [EMAIL.toLowerCase(), passwordHash, FULL_NAME, ROLE],
  );

  console.log("✔ Admin user created:");
  console.log(`   Email   : ${rows[0].email}`);
  console.log(`   Name    : ${rows[0].fullName}`);
  console.log(`   Role    : ${rows[0].role}`);
  console.log(`   Password: ${PASSWORD}`);
} catch (err) {
  console.error("✖ Failed:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
