/**
 * proxy.ts — Project root. Executed by Next.js on every request (Edge runtime).
 *
 * NOTE: Next.js 16 renamed the convention from `middleware.ts` → `proxy.ts`
 * and the exported function from `middleware` → `proxy`. This file replaces
 * the deprecated `middleware.ts`.
 *
 * Responsibilities:
 *  1. Refresh the Supabase session cookie on every request (required by @supabase/ssr).
 *  2. Protect /dashboard/* — redirect to /login if no valid session.
 *  3. Redirect /login → /dashboard if the user is already authenticated.
 *  4. Locale routing — redirect bare paths to /{defaultLocale}/...
 *
 * P0 Security fix: This edge-level guard fires BEFORE any page or Server Action
 * is reached, closing the bypass that existed when protection lived only in layout.tsx.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "ja"] as const;
const DEFAULT_LOCALE = "en";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Locale routing ──────────────────────────────────────────────────────
  // Redirect bare "/" to the default locale.
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  // Redirect paths that are not /dashboard, /login, or locale-prefixed.
  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/login")) {
    const hasLocale = LOCALES.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );
    if (!hasLocale) {
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url)
      );
    }
  }

  // ── 2. Supabase session refresh ────────────────────────────────────────────
  // @supabase/ssr requires the proxy to read + write cookies so that the
  // access token is refreshed silently on every request. Without this, sessions
  // expire mid-visit and users are logged out unexpectedly.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth checks during build / when env vars are absent.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // Must create a mutable response so cookie mutations propagate to the browser.
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Write refreshed tokens to both the request and the outgoing response.
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // IMPORTANT: Use getUser() (server-validated JWT), NOT getSession() (client-trusted).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── 3. Dashboard route protection ──────────────────────────────────────────
  // Block unauthenticated access to any /dashboard/* route at the edge.
  if (pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── 4. Login page redirect ─────────────────────────────────────────────────
  // If already authenticated, bounce away from /login to the dashboard.
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

/**
 * Matcher: run proxy on every request EXCEPT Next.js internals and static assets.
 * This is required for Supabase session cookie refresh to work on all routes.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
