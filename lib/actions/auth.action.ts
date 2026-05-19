"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Returns the currently authenticated Supabase user, or null if not logged in.
 *
 * Uses supabase.auth.getUser() which validates the JWT server-side — NOT
 * getSession() which trusts the client-supplied token without re-validation.
 *
 * ── Admin access control ───────────────────────────────────────────────────
 * Application-level "admin role" enforcement via app_metadata is intentionally
 * NOT done here. Enforcing it in code requires:
 *   1. The SQL migration (supabase/migrations/20260519000000_fix_p0_admin_rls.sql)
 *      to be run in Supabase first, AND
 *   2. The admin user's app_metadata to be manually set:
 *        UPDATE auth.users
 *        SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
 *        WHERE email = 'your-admin@email.com';
 *
 * If you add the role check here BEFORE completing step 2, it will cause a
 * redirect loop: layout redirects to /login → proxy bounces authenticated
 * users back to /dashboard → infinite 307 loop.
 *
 * Database-level protection is enforced via RLS — run the SQL migration.
 * Public signup should be disabled in Supabase → Auth → Settings.
 * ──────────────────────────────────────────────────────────────────────────
 */
export async function getUserAction() {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function logoutAction() {
  const supabase = await createClient();
  if (!supabase) return;

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
    return;
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
