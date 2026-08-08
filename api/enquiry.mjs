import pg from "pg";

const { Pool } = pg;
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
      max: 5,
    })
  : null;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.json({ ok: false, error: "Method not allowed" });
  }

  const d = req.body ?? {};
  const name = String(d.name ?? "").trim();
  const phone = String(d.phone ?? "").trim();
  if (name.length < 2 || !/^(?:\+91[\s-]?)?\d{10}$/.test(phone)) {
    res.statusCode = 400;
    return res.json({ ok: false, error: "Please enter your name and exactly 10 phone digits." });
  }
  if (!pool) {
    res.statusCode = 503;
    return res.json({ ok: false, error: "Enquiry service is temporarily unavailable. Please WhatsApp us instead." });
  }

  try {
    await pool.query(
      `insert into enquiries
         (name, phone, email, service_interest, property_type, location,
          budget_range, timeline, message, consent, source_page, utm)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        name,
        phone,
        d.email || null,
        d.serviceInterest || null,
        d.propertyType || null,
        d.location || null,
        d.budgetRange || null,
        d.timeline || null,
        d.message || null,
        Boolean(d.consent),
        d.sourcePage || null,
        JSON.stringify(d.utm ?? {}),
      ],
    );
    res.statusCode = 200;
    return res.json({ ok: true });
  } catch (error) {
    console.error("[api/enquiry] insert failed:", error);
    res.statusCode = 500;
    return res.json({ ok: false, error: "We could not save your enquiry. Please try again or WhatsApp us." });
  }
}
