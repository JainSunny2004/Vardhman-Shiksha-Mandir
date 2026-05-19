import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ ok: false, error: "Supabase env vars missing" });
  }

  const supabase = createClient(url, key);

  // Lightest possible query — just fetch 1 row from a small table to wake the DB
  const { error } = await supabase
    .from("announcements")
    .select("id")
    .limit(1);

  if (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({
    ok: true,
    ts: new Date().toISOString(),
    message: "Supabase is awake",
  });
}
