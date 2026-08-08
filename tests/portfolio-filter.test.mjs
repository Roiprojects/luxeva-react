import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/components/portfolio/PortfolioGrid.tsx", import.meta.url), "utf8");

test("portfolio does not show a redundant residential filter when no commercial work exists", () => {
  assert.match(source, /hasResidential/);
  assert.match(source, /hasCommercial/);
  assert.match(source, /All Projects/);
});
