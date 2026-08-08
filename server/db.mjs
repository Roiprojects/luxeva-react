import pg from "pg";
import { loadEnv } from "./env.mjs";

loadEnv();

const ssl = process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false };

export const pool = process.env.DATABASE_URL
  ? new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl, max: 5 })
  : null;

export async function query(text, params = []) {
  if (!pool) throw new Error("DATABASE_URL is not configured");
  return pool.query(text, params);
}

export async function withClient(fn) {
  if (!pool) throw new Error("DATABASE_URL is not configured");
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
