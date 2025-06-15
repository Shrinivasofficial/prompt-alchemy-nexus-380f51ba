
-- Enable row level security for avatars bucket objects
update storage.buckets set public = true where id = 'avatars';

-- Allow anyone to read files in the avatars bucket (public access)
create policy "Public read access to avatars" on storage.objects
  for select using (bucket_id = 'avatars');

-- Allow authenticated users to upload to avatars
create policy "Authenticated upload to avatars" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars');

-- Allow authenticated users to update/delete their own avatar files
create policy "Authenticated update/delete own avatars" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and owner = auth.uid());

create policy "Authenticated delete own avatars" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and owner = auth.uid());
