import { TURNSTILE_SITE_KEY } from "./_lib.js";

export default function handler(req, res) {
  res.setHeader("cache-control", "no-store");
  res.json({ captcha: TURNSTILE_SITE_KEY || null });
}
