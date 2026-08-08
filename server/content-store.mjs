import { query } from "./db.mjs";

const KEYS = new Set(["home", "about", "roomCategories", "services", "projects", "faqs", "testimonials", "leadership", "contactDetails"]);

export function contentValueIncludesAssetPath(value, assetPath) {
  if (typeof value === "string") return value === assetPath;
  if (Array.isArray(value)) return value.some((item) => contentValueIncludesAssetPath(item, assetPath));
  if (value && typeof value === "object") return Object.values(value).some((item) => contentValueIncludesAssetPath(item, assetPath));
  return false;
}

export function findAssetReferenceKey(documentsByKey, assetPath) {
  for (const [key, value] of Object.entries(documentsByKey ?? {})) {
    if (contentValueIncludesAssetPath(value, assetPath)) return key;
  }
  return null;
}

export async function getContentDocuments() {
  const { rows } = await query("select key, data, updated_at from content_documents where key = any($1::text[])", [[...KEYS]]);
  return Object.fromEntries(rows.map((row) => [row.key, row.data]));
}

export async function getContentDocument(key) {
  if (!KEYS.has(key)) throw new Error(`Unsupported content key: ${key}`);
  const { rows } = await query("select data from content_documents where key = $1", [key]);
  return rows[0]?.data ?? null;
}

export async function saveContentDocument(key, data, updatedBy = null) {
  if (!KEYS.has(key)) throw new Error(`Unsupported content key: ${key}`);
  const { rows } = await query(
    `insert into content_documents (key, data, updated_by)
     values ($1, $2::jsonb, $3)
     on conflict (key) do update set data = excluded.data, updated_by = excluded.updated_by, updated_at = now()
     returning key, data, updated_at`,
    [key, JSON.stringify(data), updatedBy],
  );
  return rows[0];
}

export async function isAssetReferenced(assetPath) {
  const { rows } = await query("select key, data from content_documents where key = any($1::text[])", [[...KEYS]]);
  const referenceKey = findAssetReferenceKey(Object.fromEntries(rows.map((row) => [row.key, row.data])), assetPath);
  return { referenced: Boolean(referenceKey), key: referenceKey };
}
