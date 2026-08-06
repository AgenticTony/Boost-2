-- ============================================================
-- Boost by FCR - Locked Area: Supabase Auth Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Create profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  approved boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. RLS Policies
-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles (for approval dashboard)
-- Uses a security definer function to avoid infinite recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Admins can update profiles (approve users)
create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin());

-- 4. Trigger: automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$;

-- Drop old trigger if it exists, then create fresh
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Grant permissions
-- Only authenticated users get access; anon has no business here.
-- INSERT is handled by the SECURITY DEFINER trigger, so we don't grant it.
grant select, update on public.profiles to authenticated;

-- 6. Bootstrap first admin
-- After registering your first user, run this in SQL Editor to make them admin:
-- UPDATE public.profiles SET approved = true, is_admin = true WHERE email = 'your-email@example.com';
