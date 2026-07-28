import { store } from "./_lib.js";

export default async function handler(req, res) {
  const envNames = Object.keys(process.env).filter((k) =>
    /REDIS|UPSTASH|^KV_|POSTGRES|SUPABASE|DATABASE_URL/i.test(k),
  );
  let ok = false, backend = null, err = "";
  try {
    const s = store();
    backend = s.name;
    await s.list();
    ok = true;
  } catch (e) {
    err = String((e && e.message) || e).slice(0, 300);
  }
  res.json({ ok, backend, envNames, err });
}
