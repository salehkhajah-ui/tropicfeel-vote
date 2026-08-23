import { store, verifyDevice } from "./_lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const id = String((req.body || {}).id || "");
    const s = store();
    const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
    if (!(await s.rateCheck("vote:" + ip, 12, 600))) return res.status(429).json({ error: "rate_limited" });
    // only a server-signed identity (issued on page load) may vote
    const device = verifyDevice(req.headers.cookie);
    if (!device) return res.status(403).json({ error: "no_token" });
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
