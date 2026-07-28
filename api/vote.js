import { store } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const id = String((req.body || {}).id || "");
    const votes = await store().vote(id);
    if (votes === null) return res.status(404).json({ error: "not found" });
    res.json({ id, votes });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
