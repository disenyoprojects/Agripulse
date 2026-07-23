import { describe, it, expect } from 'vitest'
import {
  generateReferenceNumber,
  resolveFarmerAction,
  isUniqueViolation,
} from './submission-helpers'

describe('generateReferenceNumber', () => {
  it('produces an AP-prefixed reference with 12 digits', () => {
    const ref = generateReferenceNumber(1_700_000_000_000, () => 0.5)
    expect(ref).toMatch(/^AP\d{12}$/)
  })

  it('varies the suffix with the RNG for the same timestamp', () => {
    const now = 1_700_000_000_000
    const a = generateReferenceNumber(now, () => 0.1)
    const b = generateReferenceNumber(now, () => 0.9)
    expect(a).not.toBe(b)
  })

  it('keeps the 4-digit suffix in the 1000–9999 range at the RNG extremes', () => {
    const now = 1_700_000_000_000
    const low = generateReferenceNumber(now, () => 0).slice(-4)
    const high = generateReferenceNumber(now, () => 0.999999).slice(-4)
    expect(Number(low)).toBe(1000)
    expect(Number(high)).toBe(9999)
  })

  it('produces different references across different timestamps', () => {
    const a = generateReferenceNumber(1_700_000_000_000, () => 0.5)
    const b = generateReferenceNumber(1_700_000_000_001, () => 0.5)
    expect(a).not.toBe(b)
  })

  it('can still collide within the same millisecond on the same RNG value — which is why the caller retries on the DB unique constraint', () => {
    const now = 1_700_000_000_000
    const a = generateReferenceNumber(now, () => 0.5)
    const b = generateReferenceNumber(now, () => 0.5)
    expect(a).toBe(b)
  })
})

describe('resolveFarmerAction', () => {
  it('reuses an existing farmer matched by contact number', () => {
    const r = resolveFarmerAction({ contactNumber: '09171234567', existing: { id: 'farmer-1' } })
    expect(r).toEqual({ action: 'reuse', id: 'farmer-1' })
  })

  it('creates a new farmer when there is no contact number, even if one is passed in', () => {
    const r = resolveFarmerAction({ existing: { id: 'farmer-1' } })
    expect(r).toEqual({ action: 'create' })
  })

  it('creates a new farmer when the contact number is blank', () => {
    const r = resolveFarmerAction({ contactNumber: '   ', existing: { id: 'farmer-1' } })
    expect(r).toEqual({ action: 'create' })
  })

  it('creates a new farmer when no existing match was found', () => {
    const r = resolveFarmerAction({ contactNumber: '09171234567', existing: null })
    expect(r).toEqual({ action: 'create' })
  })
})

describe('isUniqueViolation', () => {
  it('matches a P2002 on the named column (array target)', () => {
    expect(isUniqueViolation({ code: 'P2002', meta: { target: ['referenceNumber'] } }, 'referenceNumber')).toBe(true)
  })

  it('matches a P2002 on the named column (string target)', () => {
    expect(isUniqueViolation({ code: 'P2002', meta: { target: 'referenceNumber' } }, 'referenceNumber')).toBe(true)
  })

  it('does not match a P2002 on a different column', () => {
    expect(isUniqueViolation({ code: 'P2002', meta: { target: ['contactNumber'] } }, 'referenceNumber')).toBe(false)
  })

  it('does not match non-P2002 errors or non-objects', () => {
    expect(isUniqueViolation({ code: 'P2003' }, 'referenceNumber')).toBe(false)
    expect(isUniqueViolation(new Error('boom'), 'referenceNumber')).toBe(false)
    expect(isUniqueViolation(null, 'referenceNumber')).toBe(false)
  })
})
