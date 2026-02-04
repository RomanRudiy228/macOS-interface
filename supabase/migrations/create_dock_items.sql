create table if not exists public.dock_items (
  id uuid primary key default gen_random_uuid(),
  position int not null,
  app_key text not null,
  is_locked boolean not null default false,
  user_id uuid references auth.users(id) on delete cascade
);

create index if not exists dock_items_user_position on public.dock_items (user_id, position);

insert into public.dock_items (position, app_key, is_locked) values
  (1, 'finder', true),
  (2, 'safari', false),
  (3, 'notes', false),
  (4, 'messages', false),
  (5, 'calendar', false),
  (6, 'facetime', false),
  (7, 'app-store', false),
  (8, 'bluetooth', false),
  (9, 'calculator', false),
  (10, 'settings', false),
  (11, 'siri', false),
  (12, 'terminal', false),
  (13, 'voice-memos', false),
  (14, 'launchpad', true),
  (15, 'bin', true);
