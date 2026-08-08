export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.json({ ok: false, error: "Method not allowed" });
  }
  res.statusCode = 200;
  return res.json({ ok: true, db: Boolean(process.env.DATABASE_URL) });
}
