import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { existsSync, readFileSync } from "node:fs";

import { deletePublicAsset, listPublicAssets, uploadPublicAsset } from "../server/assets-store.mjs";

test("listPublicAssets returns sorted public image paths from the assets directory", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-"));
  try {
    mkdirSync(join(root, "public", "assets", "stock"), { recursive: true });
    mkdirSync(join(root, "public", "assets", "brand"), { recursive: true });
    writeFileSync(join(root, "public", "assets", "stock", "living-room.jpg"), "x");
    writeFileSync(join(root, "public", "assets", "stock", "kitchen.png"), "x");
    writeFileSync(join(root, "public", "assets", "brand", "logo.webp"), "x");
    writeFileSync(join(root, "public", "assets", "stock", "notes.txt"), "x");

    const assets = await listPublicAssets(root);

    assert.deepEqual(
      assets.map((asset) => asset.path),
      [
        "/assets/brand/logo.webp",
        "/assets/stock/kitchen.png",
        "/assets/stock/living-room.jpg",
      ],
    );
    assert.equal(assets[0].name, "logo.webp");
    assert.equal(assets[0].directory, "brand");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("listPublicAssets returns an empty list when no assets directory exists", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-empty-"));
  try {
    assert.deepEqual(await listPublicAssets(root), []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("uploadPublicAsset writes a sanitized image file into public/assets/uploads", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-upload-"));
  try {
    const payload = Buffer.from("fake-image-binary");
    const uploaded = await uploadPublicAsset(root, {
      fileName: "Hero Banner.PNG",
      mimeType: "image/png",
      base64Data: payload.toString("base64"),
    });

    assert.equal(uploaded.path, "/assets/uploads/hero-banner.png");
    assert.equal(uploaded.name, "hero-banner.png");
    assert.equal(uploaded.directory, "uploads");
    assert.equal(
      readFileSync(join(root, "public", "assets", "uploads", "hero-banner.png")).toString("utf8"),
      payload.toString("utf8"),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("uploadPublicAsset rejects unsupported mime types", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-invalid-"));
  try {
    await assert.rejects(
      () => uploadPublicAsset(root, {
        fileName: "notes.txt",
        mimeType: "text/plain",
        base64Data: Buffer.from("hello").toString("base64"),
      }),
      /Unsupported image type/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("uploadPublicAsset generates a unique file name when the sanitized name already exists", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-duplicate-"));
  try {
    await uploadPublicAsset(root, {
      fileName: "Hero Banner.PNG",
      mimeType: "image/png",
      base64Data: Buffer.from("first").toString("base64"),
    });

    const uploaded = await uploadPublicAsset(root, {
      fileName: "Hero Banner.PNG",
      mimeType: "image/png",
      base64Data: Buffer.from("second").toString("base64"),
    });

    assert.equal(uploaded.path, "/assets/uploads/hero-banner-2.png");
    assert.equal(
      readFileSync(join(root, "public", "assets", "uploads", "hero-banner.png")).toString("utf8"),
      "first",
    );
    assert.equal(
      readFileSync(join(root, "public", "assets", "uploads", "hero-banner-2.png")).toString("utf8"),
      "second",
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("deletePublicAsset removes uploaded assets", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-delete-"));
  try {
    await uploadPublicAsset(root, {
      fileName: "Delete Me.PNG",
      mimeType: "image/png",
      base64Data: Buffer.from("remove-me").toString("base64"),
    });

    await deletePublicAsset(root, "/assets/uploads/delete-me.png");

    assert.equal(existsSync(join(root, "public", "assets", "uploads", "delete-me.png")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("deletePublicAsset rejects non-upload asset paths", async () => {
  const root = mkdtempSync(join(tmpdir(), "luxeva-assets-delete-invalid-"));
  try {
    await assert.rejects(
      () => deletePublicAsset(root, "/assets/stock/living-dr-1.jpg"),
      /Only uploaded assets can be deleted/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
