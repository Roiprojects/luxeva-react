import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";

const privacySource = readFileSync(new URL("../src/pages/Privacy.tsx", import.meta.url), "utf8");
const termsSource = readFileSync(new URL("../src/pages/Terms.tsx", import.meta.url), "utf8");
const aboutSource = readFileSync(new URL("../src/pages/About.tsx", import.meta.url), "utf8");
const contentSource = readFileSync(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const coFounderAsset = statSync(new URL("../public/assets/stock/founder-coo.jpeg", import.meta.url));

test("privacy page uses the supplied Luxeva privacy policy instead of the draft template", () => {
  assert.equal(privacySource.includes("Draft template."), false);
  assert.match(privacySource, /Effective 21 August 2026/);
  assert.match(privacySource, /Purpose and Scope/);
  assert.match(privacySource, /Grievance Mechanism/);
  assert.match(privacySource, /Atul Kumar, CEO/);
});

test("terms page uses the supplied Luxeva website terms instead of the draft template", () => {
  assert.equal(termsSource.includes("Draft template."), false);
  assert.match(termsSource, /Website Terms & Conditions/);
  assert.match(termsSource, /Website Information Is Not an Automatic Contract/);
  assert.match(termsSource, /Governing Law and Jurisdiction/);
  assert.match(termsSource, /Jigani, Bengaluru, Karnataka, India/);
});

test("about page features the provided co-founder and COO portrait", () => {
  assert.match(contentSource, /founder-coo\.jpeg/);
  assert.match(contentSource, /Co founder & COO/);
  assert.ok(coFounderAsset.size > 50000);
  assert.equal(aboutSource.includes("Leadership spotlight"), false);
  assert.match(aboutSource, /leaders\.map/);
  assert.match(aboutSource, /lg:grid-cols-4/);
  assert.match(aboutSource, /portraitPositions/);
});
