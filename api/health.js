export default async function handler(req, res) {
  const names = Object.keys(process.env).filter((k) =>
    /REDIS|UPSTASH|^KV_/i.test(k)
  );
  let redisOk = false, err = "";
  try {
    const { redis } = await import("./_lib.js");
    await redis.set("health:ping", "1");
    redisOk = (await redis.get("health:ping")) === "1";
  } catch (e) { err = String(e && e.message || e).slice(0, 200); }
  res.json({ envNames: names, redisOk, err });
}
