import crypto from "node:crypto";

const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 };

function scryptAsync(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, SCRYPT_PARAMS, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scryptAsync(password, salt);
  return `${salt}:${Buffer.from(key).toString("hex")}`;
}

export async function verifyPassword(password, passwordHash) {
  const [salt, expectedHex] = String(passwordHash).split(":");
  if (!salt || !expectedHex) return false;
  const actual = await scryptAsync(password, salt);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
