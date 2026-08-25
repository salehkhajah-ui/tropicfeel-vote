import { store, verifyDevice, verifyCaptcha } from "./_lib.js";

const PHOTO_CAP = 10;        // max votes any single photo may gain per hour (anti-stuffing; organic is 1-3/h)
const PHOTO_WINDOW = 3600;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const body = req.body || {};
    const id = String(body.id || "");
    const s = store();
    const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
    if (!(await s.rateCheck("vote:" + ip, 12, 600))) return res.status(429).json({ error: "rate_limited" });
    // only a server-signed identity (issued on page load) may vote
    const device = verifyDevice(req.headers.cookie);
    if (!device) return res.status(403).json({ error: "no_token" });
    // human verification (active only when Turnstile keys are configured)
    if (!(await verifyCaptcha(body.token, ip))) return res.status(403).json({ error: "captcha" });
    const fresh = await s.deviceVote(device, id);
    if (!fresh) return res.status(409).json({ error: "already_voted" });
    // global per-photo velocity cap — blunt safety net against mass stuffing
    if (!(await s.photoRateOk(id, PHOTO_CAP, PHOTO_WINDOW))) {
      await s.deviceUnvote(device, id);
      return res.status(429).json({ error: "photo_busy" });
    }
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
