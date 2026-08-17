// Apply db/schema.sql to the database in DATABASE_URL.
// Usage:  node scripts/db-init.mjs   (or: npm run db:init)
// Loads .env.local automatically if present.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Minimal .env.local loader (no dependency).
for (const file of [".env.local", ".env"]) {
  const p = join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✖ DATABASE_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}

const sql = readFileSync(join(root, "db", "schema.sql"), "utf8");
const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const client = new pg.Client({ connectionString: url, ssl });

try {
  await client.connect();
  await client.query(sql);
  const { rows } = await client.query(
    "select table_name from information_schema.tables where table_schema='public' and table_name in ('enquiries','enquiry_notes') order by table_name",
  );
  console.log("✔ Schema applied. Tables present:", rows.map((r) => r.table_name).join(", "));
} catch (err) {
  console.error("✖ Failed to apply schema:", err.message);
  process.exit(1);
} finally {
  await client.end();
}
