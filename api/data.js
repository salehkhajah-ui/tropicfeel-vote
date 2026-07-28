import { redis, getMeta } from "./_lib.js";

export default async function handler(req, res) {
  const meta = await getMeta();
  const votes = meta.length ? await redis.mget(...meta.map((p) => "votes:" + p.id)) : [];
  res.setHeader("cache-control", "no-store");
  res.json(meta.map((p, i) => ({ ...p, votes: Number(votes[i] || 0) })));
}
