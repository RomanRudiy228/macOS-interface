create table if not exists public.wallpapers (
  id text primary key,
  name text not null,
  background_image text not null
);

insert into public.wallpapers (id, name, background_image) values
  ('sierra-dusk', 'Sierra Dusk', 'linear-gradient(140deg, #0f172a 0%, #1e293b 35%, #0f766e 70%, #22c55e 100%)'),
  ('monterey-glow', 'Monterey Glow', 'linear-gradient(135deg, #111827 0%, #1f2937 30%, #7c3aed 70%, #f472b6 100%)'),
  ('catalina-breeze', 'Catalina Breeze', 'linear-gradient(150deg, #020617 0%, #0f172a 40%, #0284c7 70%, #bae6fd 100%)'),
  ('sonoma-morning', 'Sonoma Morning', 'linear-gradient(160deg, #0b1020 0%, #1f2937 35%, #f59e0b 70%, #fef3c7 100%)'),
  ('ventura-twilight', 'Ventura Twilight', 'linear-gradient(150deg, #0f172a 0%, #1e1b4b 35%, #4c1d95 65%, #a78bfa 100%)'),
  ('big-sur-coast', 'Big Sur Coast', 'linear-gradient(160deg, #0f172a 0%, #0f766e 40%, #14b8a6 70%, #99f6e4 100%)'),
  ('mojave-night', 'Mojave Night', 'linear-gradient(145deg, #0b1020 0%, #111827 35%, #1f2937 65%, #6b7280 100%)'),
  ('sequoia-sunrise', 'Sequoia Sunrise', 'linear-gradient(150deg, #0b1020 0%, #1f2937 35%, #f97316 70%, #fdba74 100%)'),
  ('yosemite-clear', 'Yosemite Clear', 'linear-gradient(160deg, #0f172a 0%, #1d4ed8 45%, #38bdf8 75%, #e0f2fe 100%)'),
  ('desktop-1', 'Desktop', 'url(/images/wallpapers/1.jpg)')
on conflict (id) do nothing;
