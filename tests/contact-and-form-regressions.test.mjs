import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contentSource = readFileSync(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const validationSource = readFileSync(new URL("../src/lib/validation.ts", import.meta.url), "utf8");
const enquirySource = readFileSync(new URL("../src/components/forms/EnquiryForm.tsx", import.meta.url), "utf8");

test("public contact actions use the supplied verified details", () => {
  assert.match(contentSource, /phone: "\+91 9900026502"/);
  assert.match(contentSource, /whatsapp: "\+91 9900026502"/);
  assert.match(contentSource, /email: "atul\.kumar@luxevacare\.com"/);
});

test("enquiry form exposes a real service dropdown and dismisses success feedback", () => {
  assert.match(enquirySource, /<select id="serviceInterest"/);
  assert.match(enquirySource, /setTimeout\(\(\) => setSuccess\(false\)/);
});

test("phone validation limits input to a realistic number of digits", () => {
  assert.match(validationSource, /max\(15/);
});
