import { existsSync } from "node:fs";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { extname, join, relative, sep } from "node:path";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);
const MIME_TO_EXTENSION = new Map([
  ["image/jpeg", ".jpg"],
  ["image/jpg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
      continue;
    }
    files.push(fullPath);
  }
  return files;
}

export async function listPublicAssets(rootDir) {
  const assetsRoot = join(rootDir, "public", "assets");
  if (!existsSync(assetsRoot)) return [];

  const files = await walk(assetsRoot);
  return files
    .filter((file) => IMAGE_EXTENSIONS.has(file.slice(file.lastIndexOf(".")).toLowerCase()))
    .map((file) => {
      const rel = relative(assetsRoot, file).split(sep).join("/");
      const parts = rel.split("/");
      return {
        path: `/assets/${rel}`,
        name: parts.at(-1) ?? rel,
        directory: parts.length > 1 ? parts.slice(0, -1).join("/") : "",
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path));
}

function sanitizeBaseName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "upload";
}

function toUploadsDir(rootDir) {
  return join(rootDir, "public", "assets", "uploads");
}

function assertUploadAssetPath(assetPath) {
  if (!String(assetPath).startsWith("/assets/uploads/")) {
    throw new Error("Only uploaded assets can be deleted");
  }
}

async function nextAvailableFileName(dir, baseName, extension) {
  let index = 1;
  let candidate = `${baseName}${extension}`;
  while (existsSync(join(dir, candidate))) {
    index += 1;
    candidate = `${baseName}-${index}${extension}`;
  }
  return candidate;
}

export async function uploadPublicAsset(rootDir, { fileName, mimeType, base64Data }) {
  const extension = MIME_TO_EXTENSION.get(String(mimeType).toLowerCase());
  if (!extension) throw new Error("Unsupported image type");

  const baseName = sanitizeBaseName(String(fileName ?? "upload"));
  const uploadsDir = toUploadsDir(rootDir);
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(String(base64Data ?? ""), "base64");
  if (!buffer.length) throw new Error("Image data is required");

  const safeName = await nextAvailableFileName(uploadsDir, baseName, extension);
  const targetPath = join(uploadsDir, safeName);
  await writeFile(targetPath, buffer);

  return {
    path: `/assets/uploads/${safeName}`,
    name: safeName,
    directory: "uploads",
    extension: extname(safeName),
  };
}

export async function deletePublicAsset(rootDir, assetPath) {
  assertUploadAssetPath(assetPath);
  const relPath = assetPath.replace("/assets/uploads/", "");
  const targetPath = join(toUploadsDir(rootDir), relPath);
  if (!existsSync(targetPath)) throw new Error("Uploaded asset not found");
  await rm(targetPath);
  return { ok: true, path: assetPath };
}
