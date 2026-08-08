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
