import { query, withClient } from "./db.mjs";
import { createSessionToken, hashPassword, verifyPassword } from "./admin-auth.mjs";

export async function getAdminCount() {
  const { rows } = await query("select count(*)::int as count from admin_users");
  return rows[0]?.count ?? 0;
}

export async function bootstrapAdmin({ email, password, fullName }) {
  return withClient(async (client) => {
    const { rows: countRows } = await client.query("select count(*)::int as count from admin_users");
    if ((countRows[0]?.count ?? 0) > 0) throw new Error("Admin user already exists");
    const passwordHash = await hashPassword(password);
    const { rows } = await client.query(
      `insert into admin_users (email, password_hash, full_name, role)
       values ($1, $2, $3, 'super_admin')
       returning id, email, full_name as "fullName", role`,
      [String(email).toLowerCase(), passwordHash, fullName],
    );
    return rows[0];
  });
}

export async function authenticateAdmin(email, password) {
  const { rows } = await query(
    `select id, email, password_hash, full_name as "fullName", role, is_active
     from admin_users
     where lower(email) = lower($1)
     limit 1`,
    [email],
  );
  const user = rows[0];
  if (!user || !user.is_active) return null;
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, email: user.email, fullName: user.fullName, role: user.role };
}

export async function createAdminSession(userId) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  await query(
    "insert into admin_sessions (user_id, session_token, expires_at) values ($1, $2, $3)",
    [userId, token, expiresAt.toISOString()],
  );
  return { token, expiresAt };
}

export async function getSessionUser(token) {
  if (!token) return null;
  const { rows } = await query(
    `select u.id, u.email, u.full_name as "fullName", u.role
     from admin_sessions s
     join admin_users u on u.id = s.user_id
     where s.session_token = $1 and s.expires_at > now() and u.is_active
     limit 1`,
    [token],
  );
  return rows[0] ?? null;
}

export async function deleteAdminSession(token) {
  if (!token) return;
  await query("delete from admin_sessions where session_token = $1", [token]);
}

export async function getDashboardMetrics() {
  const [{ rows: counts }, { rows: recent }, { rows: byService }, { rows: bySource }] = await Promise.all([
    query(
      `select
         count(*)::int as total,
         count(*) filter (where status = 'new')::int as new_count,
         count(*) filter (where status = 'contacted')::int as contacted_count,
         count(*) filter (where status = 'qualified')::int as qualified_count,
         count(*) filter (where status = 'converted')::int as converted_count
       from enquiries`,
    ),
    query(
      `select id, name, phone, email, service_interest as "serviceInterest", source_page as "sourcePage", status, created_at as "createdAt"
       from enquiries
       order by created_at desc
       limit 10`,
    ),
    query(
      `select coalesce(service_interest, 'General') as label, count(*)::int as value
       from enquiries
       group by coalesce(service_interest, 'General')
       order by value desc, label asc
       limit 10`,
    ),
    query(
      `select coalesce(source_page, 'Unknown') as label, count(*)::int as value
       from enquiries
       group by coalesce(source_page, 'Unknown')
       order by value desc, label asc
       limit 10`,
    ),
  ]);

  return {
    counts: counts[0] ?? { total: 0, new_count: 0, contacted_count: 0, qualified_count: 0, converted_count: 0 },
    recent,
    byService,
    bySource,
  };
}

export async function listAdminUsers() {
  const { rows } = await query(
    `select id, email, full_name as "fullName", role, is_active as "isActive", created_at as "createdAt"
     from admin_users
     order by created_at asc`,
  );
  return rows;
}

export async function createAdminUser({ email, password, fullName, role }) {
  const passwordHash = await hashPassword(password);
  const { rows } = await query(
    `insert into admin_users (email, password_hash, full_name, role)
     values ($1, $2, $3, $4)
     returning id, email, full_name as "fullName", role, is_active as "isActive", created_at as "createdAt"`,
    [String(email).toLowerCase(), passwordHash, fullName, role],
  );
  return rows[0];
}

export async function updateAdminUser(id, { fullName, role, isActive }) {
  const { rows } = await query(
    `update admin_users
     set full_name = coalesce($2, full_name),
         role = coalesce($3, role),
         is_active = coalesce($4, is_active)
     where id = $1
     returning id, email, full_name as "fullName", role, is_active as "isActive", created_at as "createdAt"`,
    [id, fullName ?? null, role ?? null, typeof isActive === "boolean" ? isActive : null],
  );
  return rows[0] ?? null;
}

export async function changeAdminPassword(userId, currentPassword, nextPassword) {
  const { rows } = await query(
    `select password_hash
     from admin_users
     where id = $1 and is_active`,
    [userId],
  );
  const row = rows[0];
  if (!row) throw new Error("Admin user not found");
  const ok = await verifyPassword(currentPassword, row.password_hash);
  if (!ok) throw new Error("Current password is incorrect");
  const passwordHash = await hashPassword(nextPassword);
  await query("update admin_users set password_hash = $2 where id = $1", [userId, passwordHash]);
}
