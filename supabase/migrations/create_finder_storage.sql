insert into storage.buckets (id, name, public)
values ('finder-files', 'finder-files', false)
on conflict (id) do update
set public = false;

drop policy if exists "finder_select_own_files" on storage.objects;
create policy "finder_select_own_files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'finder-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "finder_insert_own_files" on storage.objects;
create policy "finder_insert_own_files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'finder-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "finder_update_own_files" on storage.objects;
create policy "finder_update_own_files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'finder-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'finder-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "finder_delete_own_files" on storage.objects;
create policy "finder_delete_own_files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'finder-files'
  and (storage.foldername(name))[1] = 'users'
  and (storage.foldername(name))[2] = auth.uid()::text
);
