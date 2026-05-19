"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
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
    }
    catch {
        return res.status(500).json({ success: false });
    }
});
exports.default = app;
//# sourceMappingURL=app.js.map