
-- Backfill the profiles table for all users without a profile
insert into public.profiles (id, email, username, created_at)
select
  u.id,
  u.email,
  split_part(u.email, '@', 1) as username,  -- Username = email prefix (you can adjust)
  now()
from auth.users u
left join public.profiles p on u.id = p.id
where p.id is null;
