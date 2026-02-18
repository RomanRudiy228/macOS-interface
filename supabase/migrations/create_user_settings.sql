alter table public.settings
add column if not exists user_id uuid references auth.users(id) on delete cascade;

insert into public.settings (wallpaper_id, theme, system_color, user_id)
select
  (select s.wallpaper_id from public.settings s order by s.id asc limit 1),
  'dark',
  'blue',
  u.id
from auth.users u
where not exists (
  select 1
  from public.settings existing
  where existing.user_id = u.id
);

update public.settings
set theme = coalesce(theme, 'dark'),
    system_color = coalesce(system_color, 'blue')
where user_id is not null;

delete from public.settings where user_id is null;

create unique index if not exists settings_user_id_unique
  on public.settings (user_id)
  where user_id is not null;

create or replace function public.seed_settings_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.settings (wallpaper_id, theme, system_color, user_id)
  select null, 'dark', 'blue', new.id
  where not exists (
    select 1
    from public.settings existing
    where existing.user_id = new.id
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_seed_settings on auth.users;

create trigger on_auth_user_created_seed_settings
after insert on auth.users
for each row
execute function public.seed_settings_for_new_user();
