create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null,
  avatar_path text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);
create index if not exists profiles_email_idx on public.profiles (email);

alter table public.profiles disable row level security;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select on table public.profiles to anon;

create or replace function public.touch_profiles_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.touch_profiles_updated_at();

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resolved_username text;
begin
  resolved_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, username)
  values (new.id, new.email, resolved_username)
  on conflict (id) do update
    set email = excluded.email,
        username = excluded.username;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_auth_user_profile();

create or replace function public.sync_profile_on_auth_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    email = new.email,
    username = coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), username)
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated_profile on auth.users;
create trigger on_auth_user_updated_profile
after update of email, raw_user_meta_data on auth.users
for each row
execute function public.sync_profile_on_auth_user_update();

insert into public.profiles (id, email, username)
select
  u.id,
  u.email,
  coalesce(nullif(u.raw_user_meta_data ->> 'username', ''), split_part(u.email, '@', 1))
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
