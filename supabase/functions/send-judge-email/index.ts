import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "https://firestartermethod.com",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden — admin only" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { judge_email, judge_name, judge_password } = body;

    if (!judge_email || !judge_name || !judge_password) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "noreply@firestartermethod.com";
    const safeName = escapeHtml(judge_name);
    const safeEmail = escapeHtml(judge_email);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;max-width:600px;margin:0 auto;padding:20px">
<div style="background:#1a1a1a;color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0"><h1 style="margin:0;font-size:20px">Firestarter Young Poets Prize 2026</h1></div>
<div style="padding:24px;background:#fafafa;border:1px solid #e0e0e0;border-radius:0 0 8px 8px">
<p>Dear ${safeName},</p>
<p>You have been invited to be a judge for the <strong>Firestarter Young Poets Prize 2026</strong>.</p>
<div style="background:white;border:1px solid #e0e0e0;border-radius:8px;padding:20px;margin:16px 0">
<p style="margin:8px 0"><strong style="color:#555">Email:</strong> <span style="font-family:monospace;background:#f5f5f5;padding:2px 8px;border-radius:4px">${safeEmail}</span></p>
<p style="margin:8px 0"><strong style="color:#555">Password:</strong> <span style="font-family:monospace;background:#f5f5f5;padding:2px 8px;border-radius:4px">${escapeHtml(judge_password)}</span></p>
</div>
<p style="text-align:center"><a href="https://firestartermethod.com/prize/auth" style="display:inline-block;background:#1a1a1a;color:white;text-decoration:none;padding:12px 32px;border-radius:6px">Sign In to Judge Dashboard</a></p>
<p><strong>Important:</strong> Please change your password after your first login.</p>
<p>If you have any questions, contact us at <a href="mailto:contactfirestartermethod@gmail.com">contactfirestartermethod@gmail.com</a>.</p>
<p>Thank you for supporting young poets!</p>
</div></body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Firestarter Prize <" + FROM_EMAIL + ">",
        to: [judge_email],
        subject: "You're a Judge \u2014 Firestarter Young Poets Prize 2026",
        html: html,
      }),
    });

    const text = await res.text();

    return new Response(JSON.stringify({ success: res.ok, status: res.status, body: text }), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
