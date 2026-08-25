import { store, ADMIN_KEY } from "./_lib.js";

// Admin-only control of the fake-vote deduction (displayed = raw − fake).
//   GET                      -> current raw/fake/shown per photo
//   POST {action:"set", byCode:{ "008": 4181, ... }}  -> set deductions
//   POST {action:"clear"}    -> remove all deductions (revert to raw = dirty + interim votes)
// The raw counter is never modified, so switching either way is lossless.
export default async function handler(req, res) {
  const key = (req.query && req.query.key) || req.headers["x-admin-key"] ||
    ((req.body || {}).key);
  if (key !== ADMIN_KEY) return res.status(401).json({ error: "unauthorized" });
  try {
    const s = store();
    if (req.method === "GET") return res.json({ ok: true, photos: await s.adjustGet() });
    if (req.method === "POST") {
      const body = req.body || {};
      if (body.action === "clear") return res.json({ ok: true, cleared: true, photos: await s.adjustClear() });
      if (body.action === "set" && body.byCode && typeof body.byCode === "object") {
        return res.json({ ok: true, photos: await s.adjustSet(body.byCode) });
      }
      return res.status(400).json({ error: "bad request" });
    }
    res.status(405).json({ error: "method" });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
