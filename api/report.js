import { store, ADMIN_KEY } from "./_lib.js";

// Read-only forensic report. Admin only — pass the admin key as
// ?key=... or the x-admin-key header. Does not modify any data.
export default async function handler(req, res) {
  const key = req.query.key || req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    res.setHeader("cache-control", "no-store");
    res.json(await store().report());
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
