-- 1) Clean duplicate template rows (user_id is null).
with ranked_template as (
  select
    id,
    row_number() over (
      partition by app_key
      order by position asc, id asc
    ) as rn
  from public.dock_items
  where user_id is null
)
delete from public.dock_items d
using ranked_template r
where d.id = r.id
  and r.rn > 1;

-- 2) Ensure exactly one template row per app_key.
create unique index if not exists dock_items_template_app_unique
  on public.dock_items (app_key)
  where user_id is null;

-- 3) Seed/refresh the 15 default template apps (user_id is null).
insert into public.dock_items (position, app_key, is_locked, user_id)
values
  (1, 'finder', true, null),
  (2, 'safari', false, null),
  (3, 'notes', false, null),
  (4, 'messages', false, null),
  (5, 'calendar', false, null),
  (6, 'facetime', false, null),
  (7, 'app-store', false, null),
  (8, 'bluetooth', false, null),
  (9, 'calculator', false, null),
  (10, 'settings', false, null),
  (11, 'siri', false, null),
  (12, 'terminal', false, null),
  (13, 'voice-memos', false, null),
  (14, 'launchpad', true, null),
  (15, 'bin', true, null)
on conflict (app_key) where user_id is null
do update set
  position = excluded.position,
  is_locked = excluded.is_locked;

-- 4) Remove template rows that are not part of default 15.
delete from public.dock_items
where user_id is null
  and app_key not in (
    'finder',
    'safari',
    'notes',
    'messages',
    'calendar',
    'facetime',
    'app-store',
    'bluetooth',
    'calculator',
    'settings',
    'siri',
    'terminal',
    'voice-memos',
    'launchpad',
    'bin'
  );

-- 5) Clean duplicate user rows (keeps first by position/id).
with ranked_user as (
  select
    id,
    row_number() over (
      partition by user_id, app_key
      order by position asc, id asc
    ) as rn
  from public.dock_items
  where user_id is not null
)
delete from public.dock_items d
using ranked_user r
where d.id = r.id
  and r.rn > 1;

-- 6) Enforce one app per user in dock_items.
create unique index if not exists dock_items_user_app_unique
  on public.dock_items (user_id, app_key)
  where user_id is not null;

-- 7) Trigger: copy template apps to each new auth user.
create or replace function public.seed_dock_items_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.dock_items (position, app_key, is_locked, user_id)
  select d.position, d.app_key, d.is_locked, new.id
  from public.dock_items d
  where d.user_id is null
    and not exists (
      select 1
      from public.dock_items existing
      where existing.user_id = new.id
        and existing.app_key = d.app_key
    )
  order by d.position;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_seed_dock_items on auth.users;

create trigger on_auth_user_created_seed_dock_items
after insert on auth.users
for each row
execute function public.seed_dock_items_for_new_user();
