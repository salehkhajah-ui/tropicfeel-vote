import { store, nextCode, ADMIN_KEY } from "./_lib.js";

export default async function handler(req, res) {
  if (String(req.query.key || "") !== ADMIN_KEY) return res.status(401).json({ error: "unauthorized" });
  const out = {};
  try {
    const s = store();
    out.backend = s.name;
    out.list_before = (await s.list()).length;
    out.vote_seed1 = await s.vote("seed1");
    const id = "selftest" + Date.now().toString(36);
    const img = "data:image/jpeg;base64," + Buffer.from("selftest-bytes").toString("base64");
    await s.add({ id, code: nextCode(await s.list()), url: "/img/" + id }, img);
    out.added = true;
    out.img_roundtrip = (await s.img(id)) === img;
    out.vote_new = await s.vote(id);
    out.deleted = await s.del(id);
    out.img_gone = (await s.img(id)) === null;
    out.list_after = (await s.list()).length;
    out.ok = out.img_roundtrip && out.vote_new === 1 && out.deleted && out.img_gone && out.list_after === out.list_before;
  } catch (e) {
    out.ok = false;
    out.err = String((e && e.message) || e).slice(0, 300);
  }
  res.json(out);
}
