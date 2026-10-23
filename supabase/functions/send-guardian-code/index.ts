import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://firestartermethod.com",
  "https://www.firestartermethod.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

// Reflect the caller's origin when it is one we trust (production + local dev),
// so the function also works from `npm run dev`.
function corsHeaders(req: Request) {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://firestartermethod.com",
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
    const guardian_name = (body?.guardian_name ?? "").trim();
    const guardian_email = (body?.guardian_email ?? "").trim().toLowerCase();

    if (!guardian_name) return json({ error: "Guardian name is required" }, 400);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardian_email)) {
      return json({ error: "Enter a valid guardian email address" }, 400);
    }

    // Participant Commitment & Parental Consent Form
    const child_commitment = body?.child_commitment === true;
    const policy_accepted = body?.policy_accepted === true;
    const supervision_confirmed = body?.supervision_confirmed === true;
    const publication_consent = body?.publication_consent === true;
    const media_consent = body?.media_consent === true;
    const media_opt_out = body?.media_opt_out === true;

    if (!child_commitment || !policy_accepted || !supervision_confirmed) {
      return json({ error: "Please complete the participant commitment and required guardian consents" }, 400);
    }
    if (media_consent === media_opt_out) {
      return json({ error: "Please choose whether you consent to photography or opt out" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Cooldown: 1 send per 60s per entrant
    const { data: existing } = await admin
      .from("guardian_consents")
      .select("created_at, verified_at")
      .eq("entrant_id", user.id)
      .maybeSingle();

    if (existing?.created_at) {
      const secs = (Date.now() - new Date(existing.created_at).getTime()) / 1000;
      if (secs < 60) {
        return json({ error: `Please wait ${Math.ceil(60 - secs)}s before resending`, retry_after: Math.ceil(60 - secs) }, 429);
      }
    }

    // Hourly cap: max 5 sends/hour
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("email_logs")
      .select("id", { count: "exact", head: true })
      .eq("recipient", guardian_email)
      .eq("email_type", "guardian_consent_code")
      .gte("sent_at", hourAgo);
    if ((count ?? 0) >= 5) {
      return json({ error: "Too many codes sent. Please try again in an hour." }, 429);
    }

    // Generate 6-digit code, 30-min expiry
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const code_hash = await sha256Hex(code);
    const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: upsertErr } = await admin.from("guardian_consents").upsert({
      entrant_id: user.id,
      guardian_name,
      guardian_email,
      code_hash,
      expires_at,
      attempts: 0,
      verified_at: null,
      child_commitment,
      policy_accepted,
      supervision_confirmed,
      publication_consent,
      media_consent,
      media_opt_out,
      consented_at: null,
      consent_version: "2026-10",
      created_at: new Date().toISOString(),
    }, { onConflict: "entrant_id" });
    if (upsertErr) return json({ error: "Could not save verification code" }, 500);

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) return json({ error: "Email service not configured" }, 500);
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@firestartermethod.com";

    const { data: profile } = await admin.from("profiles").select("full_name").eq("id", user.id).single();
    const childName = escapeHtml(profile?.full_name || "your child");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
<div style="background:#1a1a1a;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0"><h1 style="margin:0;font-size:20px">Firestarter Young Poets Prize 2026</h1></div>
<div style="padding:24px;background:#fafafa;border:1px solid #e0e0e0;border-radius:0 0 8px 8px">
<p>Dear ${escapeHtml(guardian_name)},</p>
<p>${childName} has entered the <strong>Firestarter Young Poets Prize 2026</strong> and named you as their parent/guardian.</p>
<div style="background:white;border:1px solid #e0e0e0;border-radius:8px;padding:12px 16px;margin:16px 0">
<p style="margin:4px 0"><strong>Choices recorded on the consent form:</strong></p>
<p style="margin:4px 0">Participant commitment (kind words, respect, safety rules): agreed</p>
<p style="margin:4px 0">Safeguarding Policy &amp; Incident Escalation Framework: agreed</p>
<p style="margin:4px 0">Event supervision by parent/guardian: confirmed</p>
<p style="margin:4px 0">Poem publication (first name and age only): ${publication_consent ? "authorised" : "not authorised"}</p>
<p style="margin:4px 0">Photography and video at the event: <strong>${media_opt_out ? "OPTED OUT — do not photograph or record" : "consented"}</strong></p>
</div>
<p style="font-size:13px;color:#555">By sharing the code below you confirm these choices. If anything is wrong, ask your child to update the consent form and send a new code. The full form is at <a href="https://firestartermethod.com/prize/consent-form">firestartermethod.com/prize/consent-form</a>.</p>
<p>To give your consent, please share this verification code with them so they can enter it in their dashboard:</p>
<div style="text-align:center;margin:20px 0"><span style="font-size:32px;font-weight:700;letter-spacing:8px;background:white;border:1px dashed #999;padding:12px 24px;border-radius:8px">${code}</span></div>
<p>This code expires in <strong>30 minutes</strong>. If you did not expect this, you can ignore this email — no entry will be submitted without this code.</p>
<p>Questions? Contact us at <a href="mailto:contactfirestartermethod@gmail.com">contactfirestartermethod@gmail.com</a>.</p>
<p>Thank you for supporting young poets!</p>
</div></body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Firestarter Prize <" + FROM_EMAIL + ">",
        to: [guardian_email],
        subject: "Consent code — Firestarter Young Poets Prize 2026",
        html,
      }),
    });

    const ok = res.ok;
    await admin.from("email_logs").insert({
      recipient: guardian_email,
      email_type: "guardian_consent_code",
      status: ok ? "sent" : "failed",
    });

    if (!ok) {
      const t = await res.text();
      return json({ error: "Could not send email. Check the address and try again.", detail: t }, 500);
    }

    return json({ success: true, expires_in_minutes: 30 });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
