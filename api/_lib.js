import crypto from "crypto";
import { Redis } from "@upstash/redis";
import pg from "pg";

export const ADMIN_KEY = process.env.ADMIN_KEY || "tropic-2026";
export function isAdmin(req) {
  return req.headers["x-admin-key"] === ADMIN_KEY;
}

// ---------- signed device identity ----------
// value: v1.<uuid>.<issued-ms>.<hmac>  — only the server can mint one,
// and it is only minted on page load (api/data), never on the vote call.
const hmac = (s) => crypto.createHmac("sha256", ADMIN_KEY).update(s).digest("hex").slice(0, 32);
export function mintDevice() {
  const id = crypto.randomUUID();
  const ts = Date.now();
  return `v1.${id}.${ts}.${hmac(id + "." + ts)}`;
}
export function verifyDevice(cookieHeader) {
  const m = /(?:^|;\s*)tf_device=v1\.([\w-]{8,64})\.(\d{10,16})\.([a-f0-9]{32})(?:;|$)/.exec(cookieHeader || "");
  if (!m) return null;
  const [, id, ts, sig] = m;
  const expect = hmac(id + "." + ts);
  if (sig.length !== expect.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
  return id;
}
export const deviceCookie = (v) =>
  `tf_device=${v}; Max-Age=31536000; Path=/; SameSite=Lax; Secure; HttpOnly`;

// ---------- human verification (Cloudflare Turnstile, optional) ----------
export const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY || "";
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || "";
export const captchaEnabled = () => !!(TURNSTILE_SITE_KEY && TURNSTILE_SECRET);
export async function verifyCaptcha(token, ip) {
  if (!captchaEnabled()) return true; // inert until keys are configured
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: TURNSTILE_SECRET, response: token });
    if (ip) body.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const d = await r.json();
    return !!d.success;
  } catch {
    return false; // fail closed when verification can't complete
  }
}

const SEED = [1, 2, 3].map((i) => ({
  id: "seed" + i,
  code: String(i).padStart(3, "0"),
  url: `https://picsum.photos/seed/tropicfeel${i}/600/750`,
}));

export function nextCode(list) {
  const max = list.reduce((m, p) => Math.max(m, parseInt(p.code, 10) || 0), 0);
  return String(max + 1).padStart(3, "0");
}

function pgUrl() {
  return (
    process.env.POSTGRES_URL ||
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}
function redisUrl() {
  return process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
}

// ---------- Upstash Redis backend ----------
let _redis;
function R() {
  _redis ||= new Redis({
    url: redisUrl(),
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  });
  return _redis;
}
async function rMeta() {
  let m = await R().get("photos:meta");
  if (!m) {
    m = SEED;
    await R().set("photos:meta", m);
  }
  return m;
}
const redisStore = {
  name: "upstash-redis",
  async list() {
    const m = await rMeta();
    const v = m.length ? await R().mget(...m.map((p) => "votes:" + p.id)) : [];
    return m.map((p, i) => ({ ...p, votes: Number(v[i] || 0) }));
  },
  async vote(id) {
    const m = await rMeta();
    if (!m.some((p) => p.id === id)) return null;
    return await R().incr("votes:" + id);
  },
  async add(p, image) {
    const m = await rMeta();
    if (image) await R().set("img:" + p.id, image);
    m.push({ id: p.id, code: p.code, url: p.url });
    await R().set("photos:meta", m);
  },
  async del(id) {
    const m = await rMeta();
    if (!m.some((p) => p.id === id)) return false;
    await R().set("photos:meta", m.filter((p) => p.id !== id));
    await R().del("votes:" + id, "img:" + id);
    return true;
  },
  async img(id) {
    return await R().get("img:" + id);
  },
  // one vote per photo per device: returns false if this device already voted for this photo
  async deviceVote(deviceId, photoId) {
    const ok = await R().set("device:" + deviceId + ":" + photoId, 1, { nx: true });
    return ok === "OK" || ok === true;
  },
  async deviceUnvote(deviceId, photoId) {
    await R().del("device:" + deviceId + ":" + photoId);
  },
  // sliding IP throttle: true = allowed
  async rateCheck(ip, limit, windowSec) {
    const key = "rl:" + ip + ":" + Math.floor(Date.now() / (windowSec * 1000));
    const n = await R().incr(key);
    if (n === 1) await R().expire(key, windowSec);
    return n <= limit;
  },
  async report() {
    // Redis backend keeps no per-vote history; report is Postgres-only.
    return { generated_at: new Date().toISOString(), note: "detailed report available on the Postgres backend only", photos: await this.list() };
  },
  // global velocity cap per photo: true = allowed
  async photoRateOk(photoId, limit, windowSec) {
    const key = "prate:" + photoId + ":" + Math.floor(Date.now() / (windowSec * 1000));
    const n = await R().incr(key);
    if (n === 1) await R().expire(key, windowSec);
    return n <= limit;
  },
};

// ---------- Supabase / Postgres backend ----------
let _pool, _init;
function P() {
  _pool ||= new pg.Pool({
    connectionString: pgUrl(),
    ssl: { rejectUnauthorized: false },
    max: 1,
  });
  return _pool;
}
function pgInit() {
  _init ||= (async () => {
    await P().query(`CREATE TABLE IF NOT EXISTS photos (
      id text PRIMARY KEY, code text NOT NULL, url text NOT NULL DEFAULT '',
      votes int NOT NULL DEFAULT 0, created_at timestamptz DEFAULT now())`);
    await P().query(`CREATE TABLE IF NOT EXISTS images (id text PRIMARY KEY, data text NOT NULL)`);
    await P().query(`CREATE TABLE IF NOT EXISTS device_votes (
      device_id text NOT NULL, photo_id text NOT NULL, created_at timestamptz DEFAULT now(),
      PRIMARY KEY (device_id, photo_id))`);
    await P().query(`CREATE TABLE IF NOT EXISTS vote_ips (
      ip text NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`);
    await P().query(`CREATE INDEX IF NOT EXISTS vote_ips_ip_ts ON vote_ips (ip, created_at)`);
    await P().query(`CREATE INDEX IF NOT EXISTS device_votes_photo_ts ON device_votes (photo_id, created_at)`);
    const c = await P().query("SELECT count(*)::int AS n FROM photos");
    if (!c.rows[0].n) {
      for (const s of SEED) {
        await P().query(
          "INSERT INTO photos (id, code, url) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
          [s.id, s.code, s.url],
        );
      }
    }
  })();
  return _init;
}
const pgStore = {
  name: "supabase-postgres",
  async list() {
    await pgInit();
    const r = await P().query("SELECT id, code, url, votes FROM photos ORDER BY code");
    return r.rows;
  },
  async vote(id) {
    await pgInit();
    const r = await P().query("UPDATE photos SET votes = votes + 1 WHERE id = $1 RETURNING votes", [id]);
    return r.rows[0] ? r.rows[0].votes : null;
  },
  async add(p, image) {
    await pgInit();
    if (image) await P().query("INSERT INTO images (id, data) VALUES ($1, $2)", [p.id, image]);
    await P().query("INSERT INTO photos (id, code, url) VALUES ($1, $2, $3)", [p.id, p.code, p.url]);
  },
  async del(id) {
    await pgInit();
    const r = await P().query("DELETE FROM photos WHERE id = $1", [id]);
    await P().query("DELETE FROM images WHERE id = $1", [id]);
    return r.rowCount > 0;
  },
  async img(id) {
    await pgInit();
    const r = await P().query("SELECT data FROM images WHERE id = $1", [id]);
    return r.rows[0] ? r.rows[0].data : null;
  },
  // one vote per photo per device: returns false if this device already voted for this photo
  async deviceVote(deviceId, photoId) {
    await pgInit();
    const r = await P().query(
      "INSERT INTO device_votes (device_id, photo_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [deviceId, photoId],
    );
    return r.rowCount > 0;
  },
  async deviceUnvote(deviceId, photoId) {
    await pgInit();
    await P().query("DELETE FROM device_votes WHERE device_id = $1 AND photo_id = $2", [deviceId, photoId]);
  },
  // sliding IP throttle: true = allowed
  async rateCheck(ip, limit, windowSec) {
    await pgInit();
    const r = await P().query(
      "SELECT count(*)::int AS n FROM vote_ips WHERE ip = $1 AND created_at > now() - ($2 || ' seconds')::interval",
      [ip, String(windowSec)],
    );
    if (r.rows[0].n >= limit) return false;
    await P().query("INSERT INTO vote_ips (ip) VALUES ($1)", [ip]);
    if (Math.random() < 0.02) {
      await P().query("DELETE FROM vote_ips WHERE created_at < now() - interval '1 hour'");
    }
    return true;
  },
  // global velocity cap per photo, counted from the device_votes just recorded
  async photoRateOk(photoId, limit, windowSec) {
    await pgInit();
    const r = await P().query(
      "SELECT count(*)::int AS n FROM device_votes WHERE photo_id = $1 AND created_at > now() - ($2 || ' seconds')::interval",
      [photoId, String(windowSec)],
    );
    return r.rows[0].n <= limit;
  },
  // read-only forensic report (admin only). device_votes/vote_ips exist only
  // since the anti-fraud tables were added, so this covers votes from then on.
  async report() {
    await pgInit();
    const photos = (await P().query("SELECT code, votes FROM photos ORDER BY code")).rows;
    // tracked votes + distinct devices per photo (since tracking began)
    const perPhoto = (await P().query(
      `SELECT p.code,
              count(d.*)::int AS tracked_votes,
              count(DISTINCT d.device_id)::int AS devices,
              min(d.created_at) AS first_tracked,
              max(d.created_at) AS last_tracked
       FROM photos p LEFT JOIN device_votes d ON d.photo_id = p.id
       GROUP BY p.code ORDER BY p.code`,
    )).rows;
    // hourly tracked-vote volume across all photos (last 48h)
    const hourly = (await P().query(
      `SELECT to_char(date_trunc('hour', created_at), 'MM-DD HH24:00') AS hour, count(*)::int AS votes
       FROM device_votes WHERE created_at > now() - interval '48 hours'
       GROUP BY 1 ORDER BY 1`,
    )).rows;
    // IP concentration (last 48h): how many vote attempts each IP made
    const ips = (await P().query(
      `SELECT ip, count(*)::int AS attempts, min(created_at) AS first, max(created_at) AS last
       FROM vote_ips WHERE created_at > now() - interval '48 hours'
       GROUP BY ip HAVING count(*) > 5 ORDER BY count(*) DESC LIMIT 25`,
    )).rows;
    return { generated_at: new Date().toISOString(), photos, perPhoto, hourly, ips };
  },
};

export function store() {
  if (redisUrl()) return redisStore;
  if (pgUrl()) return pgStore;
  throw new Error(
    "No database configured. Connect Upstash Redis (Vercel Storage tab) OR add POSTGRES_URL env var (Supabase connection string), then redeploy.",
  );
}
