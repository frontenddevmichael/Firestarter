import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://firestartermethod.com",
  "https://www.firestartermethod.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://firestartermethod.com",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

function jsonFor(req: Request) {
  return (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json", ...corsHeaders(req) },
    });
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const json = jsonFor(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !anonKey || !serviceKey) {
      return json({ error: "Server not configured" }, 500);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) return json({ error: "Unauthorized" }, 401);

    const body = await req.json();
    const code = String(body?.code ?? "").trim();
    if (!/^\d{6}$/.test(code)) return json({ error: "Enter the 6-digit code" }, 400);

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: consent, error: fetchErr } = await admin
      .from("guardian_consents")
      .select("*")
      .eq("entrant_id", user.id)
      .maybeSingle();

    if (fetchErr || !consent) return json({ error: "No code found. Ask for a new code first." }, 404);
    if (consent.verified_at) return json({ success: true, already_verified: true });
    if ((consent.attempts ?? 0) >= 5) {
      return json({ error: "Too many wrong attempts. Request a new code." }, 403);
    }
    if (consent.expires_at && new Date(consent.expires_at).getTime() < Date.now()) {
      return json({ error: "Code expired. Request a new code." }, 410);
    }

    const consentsComplete =
      consent.child_commitment === true &&
      consent.policy_accepted === true &&
      consent.supervision_confirmed === true &&
      consent.media_consent !== consent.media_opt_out;

    if (!consentsComplete) {
      return json({ error: "The consent form is incomplete. Ask for a new code." }, 409);
    }

    const hash = await sha256Hex(code);
    if (hash !== consent.code_hash) {
      await admin.from("guardian_consents").update({
        attempts: (consent.attempts ?? 0) + 1,
      }).eq("entrant_id", user.id);
      const left = 5 - ((consent.attempts ?? 0) + 1);
      return json({ error: `Wrong code. ${left} attempt${left === 1 ? "" : "s"} left.` }, 400);
    }

    const now = new Date().toISOString();
    await admin.from("guardian_consents").update({
      verified_at: now,
      consented_at: now,
      attempts: (consent.attempts ?? 0) + 1,
    }).eq("entrant_id", user.id);

    // Mirror verified consent into guardians table (used by judges/admins today)
    await admin.from("guardians").upsert({
      entrant_id: user.id,
      guardian_name: consent.guardian_name,
      guardian_email: consent.guardian_email,
      consent_given: true,
    }, { onConflict: "entrant_id" });

    return json({ success: true, guardian_email: consent.guardian_email });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
