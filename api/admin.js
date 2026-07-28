import { redis, getMeta, nextCode, isAdmin } from "./_lib.js";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

export default async function handler(req, res) {
  if (req.method === "GET") return res.json({ ok: isAdmin(req) });
  if (!isAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  if (req.method === "POST") {
    const body = req.body || {};
    const meta = await getMeta();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    let url = "";
    if (typeof body.image === "string" && body.image.startsWith("data:image/")) {
      await redis.set("img:" + id, body.image);
      url = "/img/" + id;
    } else if (typeof body.url === "string" && /^https?:\/\//.test(body.url)) {
      url = body.url;
    } else {
      return res.status(400).json({ error: "bad input" });
    }
    const code = nextCode(meta);
    meta.push({ id, code, url });
    await redis.set("photos:meta", meta);
    return res.json({ ok: true, code });
  }

  if (req.method === "DELETE") {
    const id = String(req.query.id || "");
    const meta = await getMeta();
    const p = meta.find((x) => x.id === id);
    if (!p) return res.status(404).json({ error: "not found" });
    await redis.set("photos:meta", meta.filter((x) => x.id !== id));
    await redis.del("votes:" + id, "img:" + id);
    return res.json({ ok: true });
  }

  res.status(405).json({ error: "method" });
}
