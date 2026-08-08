import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword, createSessionToken } from "../server/admin-auth.mjs";

test("hashPassword creates a verifiable password hash", async () => {
  const hash = await hashPassword("S3curePass!");
  assert.ok(hash.includes(":"));
  assert.equal(await verifyPassword("S3curePass!", hash), true);
  assert.equal(await verifyPassword("wrong-pass", hash), false);
});

test("createSessionToken returns unique opaque tokens", () => {
  const a = createSessionToken();
  const b = createSessionToken();
  assert.notEqual(a, b);
  assert.equal(typeof a, "string");
  assert.equal(a.length, 64);
});
