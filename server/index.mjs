// Luxeva Care — API + static server for the React SPA.
// - POST /api/enquiry  → validates + persists leads to PostgreSQL (DATABASE_URL)
// - serves the built dist/ (SPA) with history fallback
import express from "express";
import cors from "cors";
import pg from "pg";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Load .env.local / .env (no dependency).
for (const f of [".env.local", ".env"]) {
  const p = join(root, f);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };
const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl, max: 5 })
  : null;

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const recent = new Map();

app.get("/api/health", (_req, res) => res.json({ ok: true, db: Boolean(pool) }));

app.post("/api/enquiry", async (req, res) => {
  const d = req.body || {};
  if (!d.name || String(d.name).trim().length < 2 || !d.phone || String(d.phone).trim().length < 7) {
    return res.status(400).json({ ok: false, error: "Please check the highlighted fields and try again." });
  }
  if (d.company) return res.json({ ok: true }); // honeypot
  if (d.renderedAt && Date.now() - Number(d.renderedAt) < 2500) {
    return res.status(400).json({ ok: false, error: "Submission looked automated. Please try again." });
  }
  const key = `${d.phone}|${d.serviceInterest ?? ""}`;
  const now = Date.now();
  if (recent.get(key) && now - recent.get(key) < 60_000) return res.json({ ok: true });
  recent.set(key, now);

  if (pool) {
    try {
      await pool.query(
        `insert into enquiries
           (name, phone, email, service_interest, property_type, location,
            budget_range, timeline, message, consent, source_page, utm)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          d.name, d.phone, d.email || null, d.serviceInterest || null,
          d.propertyType || null, d.location || null, d.budgetRange || null,
          d.timeline || null, d.message || null, Boolean(d.consent),
          d.sourcePage || null, JSON.stringify(d.utm ?? {}),
        ],
      );
    } catch (err) {
      console.error("[enquiry] DB insert failed:", err.message);
    }
  } else {
    console.info("[enquiry] received (no DATABASE_URL):", d.name, d.phone);
  }
  res.json({ ok: true });
});

// Serve the built SPA (production) with history fallback.
const dist = join(root, "dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  // SPA history fallback (Express 5: named splat).
  app.get("/*splat", (_req, res) => res.sendFile(join(dist, "index.html")));
}

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Luxeva API on :${port}  (db: ${pool ? "on" : "off"})`));
