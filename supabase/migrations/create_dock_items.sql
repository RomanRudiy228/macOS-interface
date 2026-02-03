create table if not exists public.dock_items (
  id uuid primary key default gen_random_uuid(),
  position int not null,
  app_key text not null,
  user_id uuid references auth.users(id) on delete cascade
);

create index if not exists dock_items_user_position on public.dock_items (user_id, position);

insert into public.dock_items (position, app_key) values
  (1, 'finder'),
  (2, 'safari'),
  (3, 'notes'),
  (4, 'messages'),
  (5, 'calendar'),
  (6, 'facetime'),
  (7, 'app-store'),
  (8, 'bluetooth'),
  (9, 'calculator'),
  (10, 'settings'),
  (11, 'siri'),
  (12, 'terminal'),
  (13, 'voice-memos'),
  (14, 'weather'),
  (15, 'trash');
