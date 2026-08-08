import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const contentSource = readFileSync(new URL("../src/lib/content.ts", import.meta.url), "utf8");
const validationSource = readFileSync(new URL("../src/lib/validation.ts", import.meta.url), "utf8");
const enquirySource = readFileSync(new URL("../src/components/forms/EnquiryForm.tsx", import.meta.url), "utf8");
const quickEnquirySource = readFileSync(new URL("../src/components/forms/QuickEnquiry.tsx", import.meta.url), "utf8");
const enquirySubmitSource = readFileSync(new URL("../src/lib/enquiry.ts", import.meta.url), "utf8");
const apiEnquirySource = readFileSync(new URL("../api/enquiry.mjs", import.meta.url), "utf8");
const headerSource = readFileSync(new URL("../src/components/layout/Header.tsx", import.meta.url), "utf8");

test("public contact actions use the supplied verified details", () => {
  assert.match(contentSource, /phone: "\+91 9900026502"/);
  assert.match(contentSource, /whatsapp: "\+91 9900026502"/);
  assert.match(contentSource, /email: "atul\.kumar@luxevacare\.com"/);
});

test("enquiry form exposes a real service dropdown and dismisses success feedback", () => {
  assert.match(enquirySource, /<select id="serviceInterest"/);
  assert.match(enquirySource, /setTimeout\(\(\) => setSuccess\(false\)/);
});

test("phone fields use an India prefix and exactly ten local digits", () => {
  assert.match(enquirySource, /\+91/);
  assert.match(enquirySource, /maxLength=\{10\}/);
  assert.match(quickEnquirySource, /\+91/);
  assert.match(quickEnquirySource, /maxLength=\{10\}/);
  assert.match(validationSource, /\\d\{10\}/);
  assert.match(enquirySubmitSource, /phone: `\+91 \$\{phoneDigits\}`/);
});

test("deployment API exposes the enquiry endpoint", () => {
  assert.match(apiEnquirySource, /insert into enquiries/);
  assert.match(apiEnquirySource, /statusCode = 200/);
});

test("mobile header exposes an accessible hamburger menu and navigation drawer", () => {
  assert.match(headerSource, /aria-label="Open navigation menu"/);
  assert.match(headerSource, /aria-expanded=\{mobileOpen\}/);
  assert.match(headerSource, /mobileOpen &&/);
  assert.match(headerSource, /nav\.map/);
});
