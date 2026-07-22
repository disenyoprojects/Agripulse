import { describe, it, expect } from 'vitest'
import { evaluateWindow } from './rate-limit'

const WINDOW = 60_000
const LIMIT = 5

describe('evaluateWindow', () => {
  const now = new Date('2026-07-22T12:00:00.000Z')

  it('starts a fresh window when none exists', () => {
    const d = evaluateWindow(now, null, LIMIT, WINDOW)
    expect(d.allowed).toBe(true)
    expect(d.count).toBe(1)
    expect(d.expiresAt.getTime()).toBe(now.getTime() + WINDOW)
    expect(d.retryAfterSec).toBe(0)
  })

  it('resets when the existing window has expired', () => {
    const expired = { count: 99, expiresAt: new Date(now.getTime() - 1) }
    const d = evaluateWindow(now, expired, LIMIT, WINDOW)
    expect(d.allowed).toBe(true)
    expect(d.count).toBe(1)
  })

  it('increments within an active window and stays allowed under the limit', () => {
    const existing = { count: 3, expiresAt: new Date(now.getTime() + 30_000) }
    const d = evaluateWindow(now, existing, LIMIT, WINDOW)
    expect(d.count).toBe(4)
    expect(d.allowed).toBe(true)
  })

  it('allows exactly at the limit', () => {
    const existing = { count: 4, expiresAt: new Date(now.getTime() + 30_000) }
    const d = evaluateWindow(now, existing, LIMIT, WINDOW)
    expect(d.count).toBe(5)
    expect(d.allowed).toBe(true)
  })

  it('blocks once over the limit and reports retry-after', () => {
    const existing = { count: 5, expiresAt: new Date(now.getTime() + 30_000) }
    const d = evaluateWindow(now, existing, LIMIT, WINDOW)
    expect(d.count).toBe(6)
    expect(d.allowed).toBe(false)
    expect(d.retryAfterSec).toBe(30)
    // preserves the original window expiry when blocking
    expect(d.expiresAt).toEqual(existing.expiresAt)
  })
})
