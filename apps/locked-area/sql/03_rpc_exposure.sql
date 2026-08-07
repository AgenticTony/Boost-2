-- ============================================================
-- Boost by FCR - Locked Area: close RPC exposure on SECURITY DEFINER
-- functions
--
-- Additive migration over 02_security_hardening.sql. Run it in the
-- Supabase SQL Editor after 02. Safe to re-run.
--
-- Addresses two Supabase advisor findings:
--   anon_security_definer_function_executable
--   authenticated_security_definer_function_executable
--
-- PostgREST publishes every function in an exposed schema as an RPC
-- endpoint for any role holding EXECUTE. Both of these run as their
-- owner, so being reachable at /rest/v1/rpc/<name> is a bigger surface
-- than it looks - and neither is meant to be called over HTTP at all.
-- ============================================================

-- ------------------------------------------------------------
-- 1. handle_new_user() - a trigger function, never an endpoint
-- ------------------------------------------------------------
-- 02 revoked PUBLIC on is_admin but never touched this one, so its ACL
-- still carries the default `=X/postgres` (PUBLIC) entry on top of
-- explicit anon and authenticated grants. Revoking from anon alone
-- would achieve nothing while PUBLIC still holds EXECUTE.
--
-- Safe for signups: this fires on INSERT into auth.users, which the
-- auth service performs as supabase_auth_admin - not as anon or
-- authenticated. That role is granted explicitly below so the trigger
-- cannot depend on the PUBLIC grant being present.
grant execute on function public.handle_new_user() to supabase_auth_admin;

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

-- ------------------------------------------------------------
-- 2. is_admin() - keep it for RLS, drop it for anon
-- ------------------------------------------------------------
-- `authenticated` MUST retain EXECUTE. The policies from 02 call
-- is_admin() inside their USING and WITH CHECK expressions, and
-- Postgres checks EXECUTE against the *querying* role when evaluating
-- them. Revoking it here would not merely close an endpoint - it would
-- break admin reads and writes on profiles entirely.
--
-- `anon` needs nothing: 02 revoked all of anon's privileges on
-- public.profiles, so an anonymous query is refused at the grant level
-- before any policy is evaluated.
revoke execute on function public.is_admin() from anon;

-- ------------------------------------------------------------
-- 3. Verification
-- ------------------------------------------------------------
-- Expected ACLs afterwards:
--   handle_new_user -> postgres, service_role, supabase_auth_admin
--                      (no PUBLIC "=X/", no anon, no authenticated)
--   is_admin        -> postgres, authenticated, service_role
--                      (no anon)
--
--   select proname, coalesce(array_to_string(proacl, E'\n'), '(default)')
--   from pg_proc
--   where pronamespace = 'public'::regnamespace
--     and proname in ('is_admin', 'handle_new_user');
--
-- After applying, confirm signup still works end to end: register a new
-- account and check that a matching public.profiles row appears. That
-- row is created by the trigger this migration re-grants, so it is the
-- one behaviour worth exercising by hand.
