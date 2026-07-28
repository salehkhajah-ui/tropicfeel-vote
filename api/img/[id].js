import { redis } from "../_lib.js";

export default async function handler(req, res) {
  const id = String(req.query.id || "");
  if (!/^[\w-]+$/.test(id)) return res.status(400).end("bad id");
  const d = await redis.get("img:" + id);
  const m = typeof d === "string" ? /^data:(.+?);base64,(.*)$/s.exec(d) : null;
  if (!m) return res.status(404).end("not found");
  res.setHeader("content-type", m[1]);
  res.setHeader("cache-control", "public, max-age=31536000, immutable");
  res.end(Buffer.from(m[2], "base64"));
}
