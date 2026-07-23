import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import bcrypt from 'bcryptjs'

const { findUniqueMock } = vi.hoisted(() => ({ findUniqueMock: vi.fn() }))
vi.mock('@/lib/db', () => ({ db: { lguUser: { findUnique: findUniqueMock } } }))

import { verifyCredentials } from './verify-credentials'

const PASSWORD = 'correct-horse-battery'
let passwordHash: string

const storedUser = () => ({
  id: 'user-1',
  email: 'admin@agripulse.gov.ph',
  name: 'LGU Admin',
  password: passwordHash,
})

describe('verifyCredentials', () => {
  beforeAll(async () => {
    // Low cost keeps the hash fast in tests; the real seed uses cost 12.
    passwordHash = await bcrypt.hash(PASSWORD, 4)
  })

  beforeEach(() => {
    findUniqueMock.mockReset()
  })

  it('returns null when the email is missing', async () => {
    expect(await verifyCredentials({ password: PASSWORD })).toBeNull()
    expect(findUniqueMock).not.toHaveBeenCalled()
  })

  it('returns null when the password is missing', async () => {
    expect(await verifyCredentials({ email: storedUser().email })).toBeNull()
    expect(findUniqueMock).not.toHaveBeenCalled()
  })

  it('returns null when no user matches the email', async () => {
    findUniqueMock.mockResolvedValue(null)
    const result = await verifyCredentials({ email: 'nobody@x.com', password: PASSWORD })
    expect(result).toBeNull()
  })

  it('returns null when the password is wrong', async () => {
    findUniqueMock.mockResolvedValue(storedUser())
    const result = await verifyCredentials({ email: storedUser().email, password: 'wrong' })
    expect(result).toBeNull()
  })

  it('returns the safe user fields (no password hash) on a correct login', async () => {
    findUniqueMock.mockResolvedValue(storedUser())
    const result = await verifyCredentials({ email: storedUser().email, password: PASSWORD })
    expect(result).toEqual({ id: 'user-1', email: 'admin@agripulse.gov.ph', name: 'LGU Admin' })
    expect(result).not.toHaveProperty('password')
  })
})
