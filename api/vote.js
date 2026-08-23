import crypto from "crypto";
import { store } from "./_lib.js";

function deviceId(req, res) {
  const raw = req.headers.cookie || "";
  const m = /(?:^|;\s*)tf_device=([\w-]{8,64})(?:;|$)/.exec(raw);
  if (m) return m[1];
  const id = crypto.randomUUID();
  res.setHeader("set-cookie", `tf_device=${id}; Max-Age=31536000; Path=/; SameSite=Lax; Secure; HttpOnly`);
  return id;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const id = String((req.body || {}).id || "");
    const s = store();
    const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
    if (!(await s.rateCheck(ip, 15, 600))) return res.status(429).json({ error: "rate_limited" });
    const device = deviceId(req, res);
    const fresh = await s.deviceVote(device, id);
    if (!fresh) return res.status(409).json({ error: "already_voted" });
    const votes = await s.vote(id);
    if (votes === null) {
      await s.deviceUnvote(device, id); // don't burn the vote on a bad id
      return res.status(404).json({ error: "not found" });
    }
    res.json({ id, votes });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
