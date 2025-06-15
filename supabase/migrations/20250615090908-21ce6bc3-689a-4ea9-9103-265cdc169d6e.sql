
-- Create the avatars bucket (public)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- (Optionally) For stricter public upload/read/write, you may also want to add RLS policies for the bucket!
