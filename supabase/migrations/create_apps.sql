create table if not exists public.apps (
  id uuid primary key default gen_random_uuid(),
  app_key text not null,
  name text,
  icon text
);
create unique index if not exists apps_app_key_unique
on public.apps (app_key);

insert into public.apps (app_key, name, icon)
values
  ('finder', 'Finder', 'url(/images/finder.webp)'),
  ('safari', 'Safari', 'url(/images/safari.webp)'),
  ('notes', 'Notes', 'url(/images/notes.webp)'),
  ('messages', 'Messages', 'url(/images/messages.webp)'),
  ('calendar', 'Calendar', 'url(/images/calendar.webp)'),
  ('facetime', 'FaceTime', 'url(/images/facetime.webp)'),
  ('app-store', 'App Store', 'url(/images/app-store.webp)'),
  ('bluetooth', 'Bluetooth', 'url(/images/bluetooth.webp)'),
  ('calculator', 'Calculator', 'url(/images/calculator.webp)'),
  ('settings', 'Settings', 'url(/images/settings.webp)'),
  ('siri', 'Siri', 'url(/images/siri.webp)'),
  ('terminal', 'Terminal', 'url(/images/terminal.webp)'),
  ('voice-memos', 'Voice Memos', 'url(/images/voice-memos.webp)'),
  ('launchpad', 'Launchpad', 'url(/images/launchpad.png)'),
  ('bin', 'Bin', 'url(/images/bin.png)'),
  ('dictionary', 'Dictionary', '/url(images/dictionary.webp)'),
  ('chess', 'Chess', 'url(/images/chess.webp)'),
  ('contacts', 'Contacts', 'url(/images/contacts.webp)'),
  ('music', 'Music', 'url(/images/music.webp)')
on conflict (app_key)
do update set
  name = excluded.name,
  icon = excluded.icon;