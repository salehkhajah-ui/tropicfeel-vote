import { store } from "./_lib.js";

export default async function handler(req, res) {
  try {
    res.setHeader("cache-control", "no-store");
    res.json(await store().list());
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
