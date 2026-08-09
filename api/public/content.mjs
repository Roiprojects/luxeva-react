import pg from "pg";

const { Pool } = pg;
const KEYS = ["home", "about", "roomCategories", "services", "projects", "faqs", "testimonials", "leadership", "contactDetails"];
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
      max: 5,
    })
  : null;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.json({ ok: false, error: "Method not allowed" });
  }
  if (!pool) {
    res.statusCode = 200;
    return res.json({ ok: true, documents: {} });
  }

  try {
    const { rows } = await pool.query(
      "select key, data from content_documents where key = any($1::text[])",
      [KEYS],
    );
    res.statusCode = 200;
    return res.json({ ok: true, documents: Object.fromEntries(rows.map((row) => [row.key, row.data])) });
  } catch (error) {
    console.error("[api/public/content] read failed:", error);
    res.statusCode = 500;
    return res.json({ ok: false, error: "Failed to load public content" });
  }
}
