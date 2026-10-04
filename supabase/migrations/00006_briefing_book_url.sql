-- Booking URL for the Briefing page Pathfinding Session buttons.
-- Editable from Admin → Site Content → Briefing video.

INSERT INTO public.site_settings (key, value) VALUES
  ('briefing.book_url', '"https://mainstack.com/p/pathfinding-session?utm_source=website"')
ON CONFLICT (key) DO NOTHING;
