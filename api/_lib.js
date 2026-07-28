import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
});

export const ADMIN_KEY = process.env.ADMIN_KEY || "tropic-2026";

export function isAdmin(req) {
  return req.headers["x-admin-key"] === ADMIN_KEY;
}

// photo metadata list: [{ id, code, url }]
export async function getMeta() {
  let meta = await redis.get("photos:meta");
  if (!meta) {
    meta = [1, 2, 3].map((i) => ({
      id: "seed" + i,
      code: String(i).padStart(3, "0"),
      url: `https://picsum.photos/seed/tropicfeel${i}/600/750`,
    }));
    await redis.set("photos:meta", meta);
  }
  return meta;
}

export function nextCode(meta) {
  const max = meta.reduce((m, p) => Math.max(m, parseInt(p.code, 10) || 0), 0);
  return String(max + 1).padStart(3, "0");
}
