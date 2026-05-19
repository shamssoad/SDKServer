import { createClient } from "@supabase/supabase-js";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ success: false });
  }

  const apiKey = auth.replace("Bearer ", "");

  try {
    const { data, error } = await supabase
      .from("sdk_keys")
      .select("id")        // only fetch what you need
      .eq("api_key", apiKey)
      .eq("active", true)
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
}