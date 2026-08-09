// Luxeva Care — API + static server for the React SPA.
import express from "express";
import cors from "cors";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { loadEnv, getRoot } from "./env.mjs";
import { pool, query } from "./db.mjs";
import {
  getAdminCount,
  bootstrapAdmin,
  authenticateAdmin,
  createAdminSession,
  deleteAdminSession,
  getDashboardMetrics,
  getSessionUser,
  listAdminUsers,
  createAdminUser,
  updateAdminUser,
  changeAdminPassword,
} from "./admin-store.mjs";
import { getContentDocument, getContentDocuments, isAssetReferenced, saveContentDocument } from "./content-store.mjs";
import { deletePublicAsset, listPublicAssets, uploadPublicAsset } from "./assets-store.mjs";

loadEnv();

const root = getRoot();
const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

const recent = new Map();
const ADMIN_COOKIE = "luxeva_admin_session";
const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;

function parseCookies(req) {
  const raw = req.headers.cookie ?? "";
  return Object.fromEntries(
    raw.split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
      const idx = part.indexOf("=");
      return [part.slice(0, idx), decodeURIComponent(part.slice(idx + 1))];
    }),
  );
}

function setAdminCookie(res, token, expiresAt) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${secure}`);
}

function clearAdminCookie(res) {
  res.setHeader("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
}

async function requireAdmin(req, res, next) {
  try {
    const token = parseCookies(req)[ADMIN_COOKIE];
    const user = await getSessionUser(token);
    if (!user) return res.status(401).json({ ok: false, error: "Unauthorised" });
    req.adminUser = user;
    next();
  } catch (err) {
    console.error("[admin] auth failed:", err.message);
    res.status(500).json({ ok: false, error: "Authentication check failed" });
  }
}

function requireSuperAdmin(req, res, next) {
  if (req.adminUser?.role !== "super_admin") {
    return res.status(403).json({ ok: false, error: "Super admin access required" });
  }
  next();
}

app.get("/api/health", (_req, res) => res.json({ ok: true, db: Boolean(pool) }));

app.get("/api/public/content", async (_req, res) => {
  try {
    const documents = pool ? await getContentDocuments() : {};
    res.json({ ok: true, documents });
  } catch (err) {
    console.error("[content] public read failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to load public content" });
  }
});

app.get("/api/admin/bootstrap", async (_req, res) => {
  try {
    const count = pool ? await getAdminCount() : 0;
    res.json({ ok: true, requiresSetup: count === 0 });
  } catch (err) {
    console.error("[admin] bootstrap read failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to check admin bootstrap state" });
  }
});

app.post("/api/admin/setup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body ?? {};
    if (!email || !password || String(password).length < 8 || !fullName) {
      return res.status(400).json({ ok: false, error: "Email, full name, and an 8+ character password are required." });
    }
    const admin = await bootstrapAdmin({ email, password, fullName });
    const session = await createAdminSession(admin.id);
    setAdminCookie(res, session.token, session.expiresAt);
    res.json({ ok: true, user: admin });
  } catch (err) {
    const code = String(err.message).includes("already exists") ? 409 : 500;
    res.status(code).json({ ok: false, error: err.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    const user = await authenticateAdmin(email, password);
    if (!user) return res.status(401).json({ ok: false, error: "Invalid email or password" });
    const session = await createAdminSession(user.id);
    setAdminCookie(res, session.token, session.expiresAt);
    res.json({ ok: true, user });
  } catch (err) {
    console.error("[admin] login failed:", err.message);
    res.status(500).json({ ok: false, error: "Login failed" });
  }
});

app.post("/api/admin/logout", async (req, res) => {
  try {
    await deleteAdminSession(parseCookies(req)[ADMIN_COOKIE]);
    clearAdminCookie(res);
    res.json({ ok: true });
  } catch (err) {
    console.error("[admin] logout failed:", err.message);
    res.status(500).json({ ok: false, error: "Logout failed" });
  }
});

app.get("/api/admin/session", requireAdmin, async (req, res) => {
  res.json({ ok: true, user: req.adminUser });
});

app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword ?? "");
    const nextPassword = String(req.body?.nextPassword ?? "");
    if (nextPassword.length < 8) {
      return res.status(400).json({ ok: false, error: "New password must be at least 8 characters." });
    }
    await changeAdminPassword(req.adminUser.id, currentPassword, nextPassword);
    res.json({ ok: true });
  } catch (err) {
    const code = String(err.message).includes("incorrect") ? 400 : 500;
    res.status(code).json({ ok: false, error: err.message });
  }
});

app.get("/api/admin/dashboard", requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, metrics: await getDashboardMetrics() });
  } catch (err) {
    console.error("[admin] dashboard failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to load dashboard" });
  }
});

app.get("/api/admin/assets", requireAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, assets: await listPublicAssets(root) });
  } catch (err) {
    console.error("[admin] assets failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to load asset library" });
  }
});

app.post("/api/admin/assets/upload", requireAdmin, async (req, res) => {
  try {
    const fileName = String(req.body?.fileName ?? "");
    const mimeType = String(req.body?.mimeType ?? "");
    const base64Data = String(req.body?.base64Data ?? "");
    if (!fileName || !mimeType || !base64Data) {
      return res.status(400).json({ ok: false, error: "File name, image type, and image data are required." });
    }
    const asset = await uploadPublicAsset(root, { fileName, mimeType, base64Data });
    res.json({ ok: true, asset });
  } catch (err) {
    const code = String(err.message).includes("Unsupported image type") || String(err.message).includes("required") ? 400 : 500;
    console.error("[admin] asset upload failed:", err.message);
    res.status(code).json({ ok: false, error: err.message || "Failed to upload asset" });
  }
});

app.delete("/api/admin/assets", requireAdmin, async (req, res) => {
  try {
    const path = String(req.body?.path ?? "");
    if (!path) {
      return res.status(400).json({ ok: false, error: "Asset path is required." });
    }
    const reference = await isAssetReferenced(path);
    if (reference.referenced) {
      return res.status(409).json({ ok: false, error: `Asset is in use by ${reference.key}. Remove that reference before deleting the file.` });
    }
    await deletePublicAsset(root, path);
    res.json({ ok: true, path });
  } catch (err) {
    const message = err.message || "Failed to delete asset";
    const code =
      message.includes("Only uploaded assets can be deleted") ||
      message.includes("Asset path is required") ||
      message.includes("Uploaded asset not found")
        ? 400
        : 500;
    console.error("[admin] asset delete failed:", message);
    res.status(code).json({ ok: false, error: message });
  }
});

app.get("/api/admin/users", requireAdmin, requireSuperAdmin, async (_req, res) => {
  try {
    res.json({ ok: true, users: await listAdminUsers() });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to load admin users" });
  }
});

app.post("/api/admin/users", requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const email = String(req.body?.email ?? "");
    const password = String(req.body?.password ?? "");
    const fullName = String(req.body?.fullName ?? "");
    const role = String(req.body?.role ?? "content_manager");
    if (!email || !fullName || password.length < 8) {
      return res.status(400).json({ ok: false, error: "Email, full name, and an 8+ character password are required." });
    }
    const user = await createAdminUser({ email, password, fullName, role });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message || "Failed to create admin user" });
  }
});

app.patch("/api/admin/users/:id", requireAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const user = await updateAdminUser(req.params.id, {
      fullName: req.body?.fullName,
      role: req.body?.role,
      isActive: req.body?.isActive,
    });
    if (!user) return res.status(404).json({ ok: false, error: "Admin user not found" });
    res.json({ ok: true, user });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Failed to update admin user" });
  }
});

for (const key of ["home", "about", "roomCategories", "services", "projects", "faqs", "testimonials", "leadership", "contactDetails"]) {
  app.get(`/api/admin/content/${key}`, requireAdmin, async (_req, res) => {
    try {
      res.json({ ok: true, key, data: await getContentDocument(key) });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  app.put(`/api/admin/content/${key}`, requireAdmin, async (req, res) => {
    try {
      const saved = await saveContentDocument(key, req.body?.data ?? {}, req.adminUser.id);
      res.json({ ok: true, key, document: saved });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
}

app.get("/api/admin/enquiries", requireAdmin, async (req, res) => {
  try {
    const status = req.query.status ? String(req.query.status) : null;
    const params = [];
    const where = status ? `where status = $1` : "";
    if (status) params.push(status);
    const { rows } = await query(
      `select id, name, phone, email, service_interest as "serviceInterest", property_type as "propertyType",
              location, budget_range as "budgetRange", timeline, message, consent, source_page as "sourcePage",
              status, follow_up_date as "followUpDate", created_at as "createdAt"
       from enquiries
       ${where}
       order by created_at desc`,
      params,
    );
    res.json({ ok: true, enquiries: rows });
  } catch (err) {
    console.error("[admin] enquiries failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to load enquiries" });
  }
});

app.patch("/api/admin/enquiries/:id", requireAdmin, async (req, res) => {
  try {
    const { status, followUpDate } = req.body ?? {};
    const { rows } = await query(
      `update enquiries
       set status = coalesce($2, status),
           follow_up_date = $3
       where id = $1
       returning id, status, follow_up_date as "followUpDate"`,
      [req.params.id, status ?? null, followUpDate ?? null],
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: "Enquiry not found" });
    res.json({ ok: true, enquiry: rows[0] });
  } catch (err) {
    console.error("[admin] enquiry update failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to update enquiry" });
  }
});

app.get("/api/admin/enquiries/:id/notes", requireAdmin, async (req, res) => {
  try {
    const { rows } = await query(
      `select id, enquiry_id as "enquiryId", author, note, created_at as "createdAt"
       from enquiry_notes
       where enquiry_id = $1
       order by created_at desc`,
      [req.params.id],
    );
    res.json({ ok: true, notes: rows });
  } catch (err) {
    console.error("[admin] enquiry notes failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to load enquiry notes" });
  }
});

app.post("/api/admin/enquiries/:id/notes", requireAdmin, async (req, res) => {
  try {
    const note = String(req.body?.note ?? "").trim();
    if (!note) return res.status(400).json({ ok: false, error: "Note is required" });
    const { rows } = await query(
      `insert into enquiry_notes (enquiry_id, author, author_id, note)
       values ($1, $2, $3, $4)
       returning id, enquiry_id as "enquiryId", author, note, created_at as "createdAt"`,
      [req.params.id, req.adminUser.fullName, req.adminUser.id, note],
    );
    res.json({ ok: true, note: rows[0] });
  } catch (err) {
    console.error("[admin] note create failed:", err.message);
    res.status(500).json({ ok: false, error: "Failed to save note" });
  }
});

app.post("/api/enquiry", async (req, res) => {
  const d = req.body || {};
  if (!d.name || String(d.name).trim().length < 2 || !d.phone || String(d.phone).trim().length < 7) {
    return res.status(400).json({ ok: false, error: "Please check the highlighted fields and try again." });
  }
  if (d.company) return res.json({ ok: true });
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

const dist = join(root, "dist");
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get("/*splat", (_req, res) => res.sendFile(join(dist, "index.html")));
}

export { app };

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Luxeva API on :${port}  (db: ${pool ? "on" : "off"})`));
}
