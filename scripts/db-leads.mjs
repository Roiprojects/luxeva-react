// List recent enquiries from the database. Usage: npm run db:leads
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
for (const f of [".env.local", ".env"]) {
  const p = join(root, f); if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
if (!process.env.DATABASE_URL) { console.error("✖ DATABASE_URL not set (see .env.example)."); process.exit(1); }
const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const c = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl });
await c.connect();
const { rows } = await c.query(
  "select created_at, status, name, phone, coalesce(service_interest,'-') svc, coalesce(location,'-') loc from enquiries order by created_at desc limit 25",
);
const total = (await c.query("select count(*)::int n from enquiries")).rows[0].n;
console.log(`\nTotal enquiries: ${total}  (showing latest ${rows.length})\n`);
for (const r of rows) console.log(`${r.created_at.toISOString().slice(0,16).replace('T',' ')}  [${r.status}]  ${r.name} · ${r.phone} · ${r.svc} · ${r.loc}`);
console.log("");
await c.end();
