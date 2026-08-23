import { Redis } from "@upstash/redis";
import pg from "pg";

export const ADMIN_KEY = process.env.ADMIN_KEY || "tropic-2026";
export function isAdmin(req) {
  return req.headers["x-admin-key"] === ADMIN_KEY;
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
};

export function store() {
  if (redisUrl()) return redisStore;
  if (pgUrl()) return pgStore;
  throw new Error(
    "No database configured. Connect Upstash Redis (Vercel Storage tab) OR add POSTGRES_URL env var (Supabase connection string), then redeploy.",
  );
}
