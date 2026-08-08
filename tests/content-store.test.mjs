import test from "node:test";
import assert from "node:assert/strict";

import { contentValueIncludesAssetPath, findAssetReferenceKey } from "../server/content-store.mjs";

test("contentValueIncludesAssetPath finds an asset path nested anywhere in a content document", () => {
  const value = {
    hero: {
      image: "/assets/uploads/example.png",
      images: [
        { src: "/assets/stock/living-dr-1.jpg", alt: "Living" },
        { src: "/assets/uploads/example-2.png", alt: "Uploaded" },
      ],
    },
    leadership: [
      {
        photo: { src: "/assets/uploads/leader.png", alt: "Leader" },
      },
    ],
  };

  assert.equal(contentValueIncludesAssetPath(value, "/assets/uploads/example-2.png"), true);
  assert.equal(contentValueIncludesAssetPath(value, "/assets/uploads/leader.png"), true);
  assert.equal(contentValueIncludesAssetPath(value, "/assets/uploads/missing.png"), false);
});

test("contentValueIncludesAssetPath ignores non-string and partial matches", () => {
  const value = {
    path: "/assets/uploads/example.png?cache=1",
    nested: [{ value: 10 }, { ok: true }],
  };

  assert.equal(contentValueIncludesAssetPath(value, "/assets/uploads/example.png"), false);
});

test("findAssetReferenceKey returns the first content key using an asset path", () => {
  const documents = {
    home: {
      hero: {
        image: "/assets/uploads/example.png",
      },
    },
    leadership: [
      {
        photo: { src: "/assets/uploads/leader.png", alt: "Leader" },
      },
    ],
  };

  assert.equal(findAssetReferenceKey(documents, "/assets/uploads/leader.png"), "leadership");
  assert.equal(findAssetReferenceKey(documents, "/assets/uploads/example.png"), "home");
  assert.equal(findAssetReferenceKey(documents, "/assets/uploads/missing.png"), null);
});
