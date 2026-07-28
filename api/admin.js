import { store, nextCode, isAdmin } from "./_lib.js";

export const config = { api: { bodyParser: { sizeLimit: "4mb" } } };

export default async function handler(req, res) {
  if (req.method === "GET") return res.json({ ok: isAdmin(req) });
  if (!isAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  try {
    const s = store();

    if (req.method === "POST") {
      const body = req.body || {};
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      let url = "", image = null;
      if (typeof body.image === "string" && body.image.startsWith("data:image/")) {
        image = body.image;
        url = "/img/" + id;
      } else if (typeof body.url === "string" && /^https?:\/\//.test(body.url)) {
        url = body.url;
      } else {
        return res.status(400).json({ error: "bad input" });
      }
      const code = nextCode(await s.list());
      await s.add({ id, code, url }, image);
      return res.json({ ok: true, code });
    }

    if (req.method === "DELETE") {
      const ok = await s.del(String(req.query.id || ""));
      if (!ok) return res.status(404).json({ error: "not found" });
      return res.json({ ok: true });
    }

    res.status(405).json({ error: "method" });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
