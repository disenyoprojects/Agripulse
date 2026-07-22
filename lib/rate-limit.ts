import { db } from '@/lib/db'

export type WindowRow = { count: number; expiresAt: Date }

export type WindowDecision = {
  allowed: boolean
  count: number
  expiresAt: Date
  retryAfterSec: number
}

/**
 * Pure fixed-window rate-limit decision. Given the current time, the existing
 * window row (if any), the limit and window size, compute the next state.
 * Kept side-effect-free so it can be unit-tested without a database.
 */
export function evaluateWindow(
  now: Date,
  existing: WindowRow | null,
  limit: number,
  windowMs: number
): WindowDecision {
  const expired = !existing || existing.expiresAt.getTime() <= now.getTime()

  if (expired) {
    const expiresAt = new Date(now.getTime() + windowMs)
    return { allowed: true, count: 1, expiresAt, retryAfterSec: 0 }
  }

  const count = existing.count + 1
  const allowed = count <= limit
  const retryAfterSec = allowed
    ? 0
    : Math.max(1, Math.ceil((existing.expiresAt.getTime() - now.getTime()) / 1000))

  return { allowed, count, expiresAt: existing.expiresAt, retryAfterSec }
}

/**
 * DB-backed fixed-window limiter. Reliable on serverless (state lives in
 * Postgres, not per-instance memory). Fails open on unexpected DB errors so a
 * limiter outage never takes down the endpoint it protects.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSec: number }> {
  try {
    const result = await db.$transaction(async (tx) => {
      const now = new Date()
      const existing = await tx.rateLimit.findUnique({ where: { key } })
      const decision = evaluateWindow(now, existing, limit, windowMs)

      await tx.rateLimit.upsert({
        where: { key },
        create: { key, count: decision.count, expiresAt: decision.expiresAt },
        update: { count: decision.count, expiresAt: decision.expiresAt },
      })

      return { allowed: decision.allowed, retryAfterSec: decision.retryAfterSec }
    })

    // Opportunistically purge expired rows (~2% of calls) so the table can't
    // grow unbounded as unique IPs accumulate. Fire-and-forget; never blocks.
    if (Math.random() < 0.02) {
      purgeExpiredRateLimits().catch(() => {})
    }

    return result
  } catch (error) {
    console.error('Rate limit check failed (failing open):', error)
    return { allowed: true, retryAfterSec: 0 }
  }
}

/** Delete every rate-limit window that has already expired. Safe to call from a cron. */
export async function purgeExpiredRateLimits(): Promise<number> {
  const { count } = await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } })
  return count
}

/** Best-effort client identifier from proxy headers (Vercel sets x-forwarded-for). */
export function clientKey(request: Request, prefix: string): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown'
  return `${prefix}:${ip}`
}
