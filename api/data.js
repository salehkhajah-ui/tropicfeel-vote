import { store, mintDevice, verifyDevice, deviceCookie } from "./_lib.js";

export default async function handler(req, res) {
  try {
    res.setHeader("cache-control", "no-store");
    // issue a signed device identity on page load — rate-limited per IP so
    // scripts cannot mint identities in bulk
    if (!verifyDevice(req.headers.cookie)) {
      const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "?").split(",")[0].trim();
      if (await store().rateCheck("mint:" + ip, 20, 3600)) {
        res.setHeader("set-cookie", deviceCookie(mintDevice()));
      }
    }
    res.json(await store().list());
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
