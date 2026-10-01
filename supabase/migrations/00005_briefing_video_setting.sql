-- Briefing video URL setting. Empty default keeps the YouTube fallback
-- until the admin pastes the custom (Supabase-hosted) video URL.

INSERT INTO public.site_settings (key, value) VALUES
  ('briefing.video_url', '""')
ON CONFLICT (key) DO NOTHING;
