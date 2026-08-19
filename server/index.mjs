// Luxeva Care — API + static server for the React SPA.
import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

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

import { pool, query } from "./db.mjs";
import {
  getAdminCount, bootstrapAdmin, authenticateAdmin,
  createAdminSession, getSessionUser, deleteAdminSession,
  getDashboardMetrics, listAdminUsers, createAdminUser, updateAdminUser, changeAdminPassword,
} from "./admin-store.mjs";
import { getContentDocument, saveContentDocument, listPublicAssets as _listPublicAssets, isAssetReferenced } from "./content-store.mjs";
import { listPublicAssets, uploadPublicAsset, deletePublicAsset } from "./assets-store.mjs";

const app = express();
const isProd = process.env.NODE_ENV === "production";

app.use(cors({ credentials: true }));
app.use(express.json({ limit: "20mb" }));

// ── Session cookie helpers ─────────────────────────────────────────────────
const COOKIE_NAME = "lx_admin_token";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "strict",
  secure: isProd,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, COOKIE_OPTS);
}
function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

// Parse cookies manually (no dep).
function parseCookies(req) {
  const cookies = {};
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k) cookies[k.trim()] = decodeURIComponent(v.join("=").trim());
  }
  return cookies;
}

async function requireAdmin(req, res, next) {
  if (!pool) return res.status(503).json({ ok: false, error: "Database not configured" });
  const token = parseCookies(req)[COOKIE_NAME];
  const user = await getSessionUser(token).catch(() => null);
  if (!user) return res.status(401).json({ ok: false, error: "Unauthorised" });
  req.adminUser = user;
  next();
}

// ── Health ─────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true, db: Boolean(pool) }));

// ── Public enquiry ─────────────────────────────────────────────────────────
const recent = new Map();

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
      await query(
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

// ── Admin: bootstrap / auth ────────────────────────────────────────────────
app.get("/api/admin/bootstrap", async (_req, res) => {
  if (!pool) return res.json({ requiresSetup: false, dbMissing: true });
  try {
    const count = await getAdminCount();
    res.json({ requiresSetup: count === 0 });
  } catch (err) {
    console.error("[bootstrap]", err.message);
    res.status(500).json({ ok: false, error: "Database error" });
  }
});

app.post("/api/admin/setup", async (req, res) => {
  if (!pool) return res.status(503).json({ ok: false, error: "Database not configured" });
  const { email, password, fullName } = req.body ?? {};
  if (!email || !password || !fullName || String(password).length < 8) {
    return res.status(400).json({ ok: false, error: "Name, email and password (min 8 chars) are required" });
  }
  try {
    const user = await bootstrapAdmin({ email: String(email).toLowerCase(), password, fullName });
    const { token } = await createAdminSession(user.id);
    setSessionCookie(res, token);
    res.json({ ok: true, user });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  if (!pool) return res.status(503).json({ ok: false, error: "Database not configured" });
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ ok: false, error: "Email and password required" });
  try {
    const user = await authenticateAdmin(email, password);
    if (!user) return res.status(401).json({ ok: false, error: "Invalid email or password" });
    const { token } = await createAdminSession(user.id);
    setSessionCookie(res, token);
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get("/api/admin/session", requireAdmin, (req, res) => {
  res.json({ ok: true, user: req.adminUser });
});

app.post("/api/admin/logout", requireAdmin, async (req, res) => {
  const token = parseCookies(req)[COOKIE_NAME];
  await deleteAdminSession(token).catch(() => {});
  clearSessionCookie(res);
  res.json({ ok: true });
});

// ── Admin: dashboard ───────────────────────────────────────────────────────
app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json({ ok: true, ...metrics });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Admin: content ─────────────────────────────────────────────────────────
app.get("/api/admin/content/:key", requireAdmin, async (req, res) => {
  try {
    const data = await getContentDocument(req.params.key);
    res.json({ ok: true, data });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.put("/api/admin/content/:key", requireAdmin, async (req, res) => {
  try {
    const saved = await saveContentDocument(req.params.key, req.body.data, req.adminUser.id);
    res.json({ ok: true, saved });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// ── Admin: enquiries ───────────────────────────────────────────────────────
app.get("/api/admin/enquiries", requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 25, status } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const where = status ? "where status = $3" : "";
    const params = status ? [Number(limit), offset, status] : [Number(limit), offset];
    const { rows } = await query(
      `select id, name, phone, email, service_interest as "serviceInterest", property_type as "propertyType",
              location, budget_range as "budgetRange", timeline, message, consent, status,
              source_page as "sourcePage", utm, created_at as "createdAt"
       from enquiries ${where}
       order by created_at desc
       limit $1 offset $2`,
      params,
    );
    const { rows: countRows } = await query(
      `select count(*)::int as total from enquiries ${status ? "where status = $1" : ""}`,
      status ? [status] : [],
    );
    res.json({ ok: true, enquiries: rows, total: countRows[0]?.total ?? 0 });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.patch("/api/admin/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body ?? {};
    const { rows } = await query(
      "update enquiries set status = $2 where id = $1 returning id, status",
      [req.params.id, status],
    );
    res.json({ ok: true, enquiry: rows[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── Admin: media / assets ──────────────────────────────────────────────────
app.get("/api/admin/assets", requireAdmin, async (_req, res) => {
  try {
    const assets = await listPublicAssets(root);
    res.json({ ok: true, assets });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/admin/assets", requireAdmin, async (req, res) => {
  try {
    const { fileName, mimeType, base64Data } = req.body ?? {};
    const asset = await uploadPublicAsset(root, { fileName, mimeType, base64Data });
    res.json({ ok: true, asset });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.delete("/api/admin/assets", requireAdmin, async (req, res) => {
  try {
    const { path: assetPath } = req.body ?? {};
    const { referenced } = await isAssetReferenced(assetPath);
    if (referenced) return res.status(409).json({ ok: false, error: "Asset is referenced by content and cannot be deleted." });
    await deletePublicAsset(root, assetPath);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// ── Admin: users ───────────────────────────────────────────────────────────
app.get("/api/admin/users", requireAdmin, async (_req, res) => {
  try {
    const users = await listAdminUsers();
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/admin/users", requireAdmin, async (req, res) => {
  try {
    const { email, password, fullName, role = "editor" } = req.body ?? {};
    if (!email || !password || !fullName) return res.status(400).json({ ok: false, error: "Email, password and name required" });
    const user = await createAdminUser({ email, password, fullName, role });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
  try {
    const { fullName, role, isActive } = req.body ?? {};
    const user = await updateAdminUser(req.params.id, { fullName, role, isActive });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post("/api/admin/users/change-password", requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body ?? {};
    await changeAdminPassword(req.adminUser.id, currentPassword, newPassword);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// ── SPA static + history fallback ─────────────────────────────────────────
const dist = join(root, "dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("/*splat", (_req, res) => res.sendFile(join(dist, "index.html")));
}

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Luxeva API on :${port}  (db: ${pool ? "on" : "off"})`));
