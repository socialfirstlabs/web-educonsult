/**
 * Simple in-memory rate limiter for Server Actions.
 *
 * Sliding-window: each IP gets MAX_REQUESTS calls per WINDOW_MS.
 * After exceeding the limit, subsequent calls are rejected until the window
 * resets.
 *
 * ⚠️  LIMITATION: The store is module-level, so it resets on cold starts in
 * serverless/edge environments (Vercel, AWS Lambda, etc.). For true
 * distributed rate limiting in a serverless deployment, replace with
 * Upstash Ratelimit: https://upstash.com/docs/oss/sdks/ts/ratelimit/overview
 *
 * For a self-hosted Node.js deployment this works correctly as a persistent
 * in-process store.
 */

const WINDOW_MS = 60_000   // 1-minute sliding window
const MAX_REQUESTS = 5     // max public form submissions per IP per minute

type Entry = { count: number; windowStart: number }

const store = new Map<string, Entry>()
let lastCleanup = Date.now()

/** Prune stale entries to prevent unbounded memory growth. */
function maybeCleanup() {
  const now = Date.now()
  if (now - lastCleanup < WINDOW_MS) return
  lastCleanup = now
  for (const [ip, entry] of store) {
    if (now - entry.windowStart > WINDOW_MS * 2) store.delete(ip)
  }
}

/**
 * Check whether the given IP has exceeded the rate limit.
 *
 * @param ip  The caller's IP address (read from `x-forwarded-for` or similar).
 * @returns   `{ allowed: true }` if the request is within limits,
 *            `{ allowed: false }` if it should be rejected.
 */
export function checkRateLimit(ip: string): { allowed: boolean } {
  maybeCleanup()

  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // First request in this window — start a new window
    store.set(ip, { count: 1, windowStart: now })
    return { allowed: true }
  }

  entry.count++
  return { allowed: entry.count <= MAX_REQUESTS }
}

/**
 * Extract the best-guess client IP from Next.js request headers.
 * Use inside Server Actions via `import { headers } from 'next/headers'`.
 *
 * @param headersList  Awaited result of `headers()` from `next/headers`.
 */
export function getClientIp(
  headersList: Awaited<ReturnType<typeof import('next/headers').headers>>
): string {
  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headersList.get('x-real-ip') ??
    'unknown'
  )
}
