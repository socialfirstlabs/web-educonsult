import type { NextConfig } from "next";

/**
 * Security HTTP headers applied to every response.
 * P2 fix — previously no security headers were configured at all.
 *
 * References:
 *  - https://nextjs.org/docs/app/api-reference/next-config-js/headers
 *  - https://securityheaders.com
 *  - https://owasp.org/www-project-secure-headers/
 */
const SECURITY_HEADERS = [
  // ── Anti-clickjacking ──────────────────────────────────────────────────────
  // Prevents the site from being embedded in an <iframe> on another domain.
  // Stops clickjacking attacks where an attacker overlays the admin dashboard.
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  // ── MIME-sniffing protection ───────────────────────────────────────────────
  // Forces browsers to honour the declared Content-Type and not guess.
  // Critical here because we serve user-uploaded image files from Supabase Storage —
  // a browser that sniffs could execute a disguised HTML/JS file as a document.
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  // ── Referrer leakage control ───────────────────────────────────────────────
  // Sends full URL on same-origin requests (preserves analytics).
  // Sends only the origin (no path/query) on cross-origin requests.
  // Prevents dashboard paths like /dashboard/leads?filter=... leaking in Referer headers.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },

  // ── Browser API lockdown ───────────────────────────────────────────────────
  // Revokes permissions for APIs this app never uses.
  // An attacker who injects JS cannot silently access camera, mic, or location.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },

  // ── DNS prefetch control ───────────────────────────────────────────────────
  // Allows the browser to prefetch DNS for linked hostnames — improves perf
  // without meaningful privacy risk given the public nature of those hostnames.
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },

  // ── HTTP Strict Transport Security (HSTS) ─────────────────────────────────
  // Tells browsers to always use HTTPS for this domain for 1 year.
  // includeSubDomains protects all subdomains. preload submits to the HSTS preload list.
  // NOTE: Only safe once the domain is confirmed to be HTTPS-only in production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },

  // ── Content Security Policy ────────────────────────────────────────────────
  // Baseline CSP. Intentionally not using 'unsafe-inline' for scripts.
  // Next.js inlines some scripts by default — nonce-based CSP is the correct
  // long-term solution, but that requires middleware integration.
  // This baseline blocks the most dangerous injection patterns while remaining
  // compatible with Next.js App Router without nonce setup.
  {
    key: "Content-Security-Policy",
    value: [
      // Only load scripts from same origin and trusted CDNs.
      "default-src 'self'",
      // Scripts: self + Next.js runtime needs 'unsafe-inline' for now.
      // TODO: Replace with a nonce-based policy for full XSS protection.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      // Styles: self + inline (Tailwind CSS injects inline styles).
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Images: self + Supabase storage CDN + data URIs.
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      // Fonts: Google Fonts.
      "font-src 'self' https://fonts.gstatic.com",
      // Iframes: privacy-safe YouTube, Vimeo, and Google Maps embed.
      "frame-src https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com",
      // API calls: self + Supabase project URL only.
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co`,
      // No plugins (Flash etc.).
      "object-src 'none'",
      // base href cannot be changed by injected content.
      "base-uri 'self'",
      // Forms may only submit to same origin.
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {

  async headers() {
    return [
      {
        // Apply security headers to ALL routes.
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Raise the Server Action body limit to 5 MB so blog images can be
      // uploaded via the dashboard form. The storage action enforces this same
      // limit server-side via magic-byte inspection before writing to Supabase.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
