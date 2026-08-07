-- ============================================================
-- Boost by FCR - Locked Area: security hardening
--
-- Additive migration over 01_profiles_and_rls.sql. Run it in the
-- Supabase SQL Editor after 01. Safe to re-run: every statement is
-- idempotent, which 01 was not (its bare `create policy` calls fail
-- on a second run).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Pin the search_path on the SECURITY DEFINER function
-- ------------------------------------------------------------
-- is_admin() runs with the privileges of its owner. Without a fixed
-- search_path, whoever calls it controls which schema `profiles`
-- resolves to - so a caller able to create objects in a schema earlier
-- on their own search_path can have this function read their table
-- instead of ours, while still running as the owner. Supabase's linter
-- flags exactly this as `function_search_path_mutable`.
--
-- handle_new_user() in 01 already sets it; this one was missed.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- A SECURITY DEFINER function should not be executable by every role
-- that can reach the database. Only signed-in users need it.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ------------------------------------------------------------
-- 2. Add the `denied` column
-- ------------------------------------------------------------
-- Consumed by the admin deny flow. Added here so the table is touched
-- by one migration rather than two.
--
-- Note `denied` is distinct from `not approved`: a new account is
-- unapproved because nobody has looked at it yet, whereas a denied one
-- has been actively rejected. Without the distinction a rejected
-- account reappears in the pending queue forever.
alter table public.profiles
  add column if not exists denied boolean not null default false;

-- ------------------------------------------------------------
-- 3. Recreate the policies, idempotently and with explicit WITH CHECK
-- ------------------------------------------------------------
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Admins can update profiles" on public.profiles;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- WITH CHECK was omitted in 01, which means Postgres silently defaults
-- it to the USING clause. That happened to be equivalent here, but
-- relying on an implicit default for a write rule is not something a
-- reader should have to know. Spelled out.
create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- ------------------------------------------------------------
-- 4. Restrict which columns an admin can actually write
-- ------------------------------------------------------------
-- RLS decides which ROWS a statement may touch; it cannot restrict
-- which COLUMNS. 01 granted table-wide UPDATE, so any admin could set
-- is_admin = true on any row through the public API - a single
-- compromised admin session was enough to mint more admins, silently
-- and permanently.
--
-- Column-level grants are the right tool. After this, `is_admin`,
-- `email`, `full_name` and `id` are not writable through PostgREST by
-- anyone. Promoting an admin is deliberately a SQL Editor operation
-- (see the bootstrap note in 01), which runs as the table owner and is
-- unaffected by these grants.
revoke update on public.profiles from authenticated;
grant update (approved, denied) on public.profiles to authenticated;

-- SELECT stays table-wide: RLS already limits it to your own row,
-- unless you are an admin.
grant select on public.profiles to authenticated;

-- anon has no business here at all.
revoke all on public.profiles from anon;

-- ------------------------------------------------------------
-- 5. Verification
-- ------------------------------------------------------------
-- Run these after applying. Expected results in the comments.

-- search_path is pinned -> proconfig contains "search_path=public"
--   select proname, proconfig from pg_proc
--   where proname in ('is_admin', 'handle_new_user');

-- Column grants -> only `approved` and `denied` for `authenticated`
--   select grantee, privilege_type, column_name
--   from information_schema.column_privileges
--   where table_name = 'profiles' and grantee = 'authenticated'
--     and privilege_type = 'UPDATE';

-- Policies -> three rows, the UPDATE one with a non-null with_check
--   select policyname, cmd, qual, with_check
--   from pg_policies where tablename = 'profiles';
