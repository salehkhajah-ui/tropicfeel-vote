import { redis, getMeta } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  const id = String((req.body || {}).id || "");
  const meta = await getMeta();
  if (!meta.some((p) => p.id === id)) return res.status(404).json({ error: "not found" });
  const votes = await redis.incr("votes:" + id);
  res.json({ id, votes });
}
