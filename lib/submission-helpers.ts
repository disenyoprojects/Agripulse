/**
 * Pure helpers for the farmer-submission flow, kept side-effect-free so the
 * decision logic can be unit-tested without a database.
 */

/**
 * Build a submission reference number: `AP` + last 8 digits of the timestamp +
 * a 4-digit random suffix. `now`/`rand` are injectable so tests are
 * deterministic; production uses the real clock and RNG.
 *
 * The 4-digit suffix (vs the old 2) widens the space, but same-millisecond
 * collisions are still possible — the caller retries on the DB unique
 * constraint rather than assuming this is collision-proof.
 */
export function generateReferenceNumber(
  now: number = Date.now(),
  rand: () => number = Math.random
): string {
  const ts = now.toString().slice(-8)
  const suffix = Math.floor(rand() * 9000 + 1000) // 1000–9999
  return `AP${ts}${suffix}`
}

export type FarmerActionInput = {
  contactNumber?: string | null
  /** The farmer found by a *contactNumber* lookup, or null. */
  existing: { id: string } | null
}

export type FarmerAction = { action: 'create' } | { action: 'reuse'; id: string }

/**
 * Decide whether to reuse an existing farmer or create a new one.
 *
 * A farmer is only ever reused when matched by their unique contact number.
 * Without a contact number there is no reliable identity key, so we always
 * create — two farmers who happen to share a name in the same barangay must
 * never be merged into one record.
 */
export function resolveFarmerAction({ contactNumber, existing }: FarmerActionInput): FarmerAction {
  if (existing && contactNumber && contactNumber.trim().length > 0) {
    return { action: 'reuse', id: existing.id }
  }
  return { action: 'create' }
}

/**
 * True when a thrown error is a Prisma unique-constraint violation (P2002) on
 * the given column. Duck-typed so it needn't import the generated client.
 */
export function isUniqueViolation(error: unknown, column: string): boolean {
  if (typeof error !== 'object' || error === null) return false
  const e = error as { code?: unknown; meta?: { target?: unknown } }
  if (e.code !== 'P2002') return false
  const target = e.meta?.target
  return Array.isArray(target) ? target.includes(column) : target === column
}
