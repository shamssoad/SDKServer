import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

app.post("/validate", async (req, res) => {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ success: false });
    }

    const apiKey = auth.replace("Bearer ", "");

    const { data, error } = await supabase
      .from("sdk_keys")
      .select("*")
      .eq("api_key", apiKey)
      .eq("active", true)
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false });
    }

    return res.json({ success: true });
  } catch {
    return res.status(500).json({ success: false });
  }
});

export default app;
