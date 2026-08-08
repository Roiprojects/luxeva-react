import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contentSource = readFileSync(new URL("../src/lib/content.ts", import.meta.url), "utf8");

test("service and room imagery avoids generic mismatched stock assignments", () => {
  const forbiddenMappings = [
    'heroImage: pic("img-20.jpg"',
    'heroImage: pic("img-02.jpg"',
    'heroImage: pic("img-06.jpg"',
    'pic("img-13.jpg"',
    'pic("img-37.jpg"',
  ];

  for (const snippet of forbiddenMappings) {
    assert.equal(
      contentSource.includes(snippet),
      false,
      `Expected content catalog to stop using generic image mapping snippet: ${snippet}`,
    );
  }
});

test("known screenshot mismatches are repaired even when CMS content is loaded", () => {
  assert.match(contentSource, /const repairRoomImages =/);
  assert.match(contentSource, /slug === "kitchen-granite-quartz"/);
  assert.match(contentSource, /slug === "false-ceiling-pop"/);
  assert.match(contentSource, /slug === "smart-modern-home"/);
  assert.match(contentSource, /title: "Wardrobe"/);
});
