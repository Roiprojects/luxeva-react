import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const headerSource = readFileSync(new URL("../src/components/layout/Header.tsx", import.meta.url), "utf8");
const actionBarSource = readFileSync(new URL("../src/components/layout/MobileActionBar.tsx", import.meta.url), "utf8");
const carouselSource = readFileSync(new URL("../src/components/ui/Carousel.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../src/pages/Home.tsx", import.meta.url), "utf8");

test("mobile navigation is presented as a modal app drawer", () => {
  assert.match(headerSource, /aria-modal="true"/);
  assert.match(headerSource, /aria-label="Close navigation menu"/);
  assert.match(headerSource, /fixed inset-0/);
  assert.match(headerSource, /role="dialog"/);
});

test("mobile actions account for safe-area insets and retain large tap targets", () => {
  assert.match(actionBarSource, /safe-area-inset-bottom/);
  assert.match(actionBarSource, /min-h-\[3\.5rem\]/);
  assert.match(actionBarSource, /z-50/);
});

test("the home carousel explains that it can be swiped on touch devices", () => {
  assert.match(carouselSource, /Swipe to explore/);
  assert.match(carouselSource, /aria-live="polite"/);
});

test("featured services become a touch-first rail on small screens", () => {
  assert.match(homeSource, /snap-x snap-mandatory/);
  assert.match(homeSource, /min-w-\[82vw\] snap-start/);
  assert.match(homeSource, /sm:grid-cols-2/);
});
