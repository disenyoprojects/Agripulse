import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export type AuthenticatedUser = { id: string; email: string; name: string | null }

/**
 * Verify an LGU staff email/password pair against the database.
 *
 * Returns the authenticated user on success, or `null` for every failure mode
 * (missing input, unknown email, wrong password). Extracted from the NextAuth
 * `authorize` callback so the credential logic can be unit-tested in isolation.
 */
export async function verifyCredentials(
  credentials: Partial<Record<'email' | 'password', unknown>> | undefined
): Promise<AuthenticatedUser | null> {
  if (!credentials?.email || !credentials?.password) return null

  const user = await db.lguUser.findUnique({ where: { email: String(credentials.email) } })
  if (!user) return null

  const valid = await bcrypt.compare(String(credentials.password), user.password)
  if (!valid) return null

  return { id: user.id, email: user.email, name: user.name }
}
