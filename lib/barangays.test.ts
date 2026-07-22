import { describe, it, expect } from 'vitest'
import { BARANGAYS, BARANGAY_MANUAL } from './barangays'

const MUNICIPALITIES = ['Baguio City', 'La Trinidad', 'Itogon', 'Sablan', 'Tuba', 'Tublay']

describe('BARANGAYS', () => {
  it('covers every BLISTT municipality with a non-empty list', () => {
    for (const m of MUNICIPALITIES) {
      expect(BARANGAYS[m], m).toBeDefined()
      expect(BARANGAYS[m].length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate barangays within a municipality', () => {
    for (const m of MUNICIPALITIES) {
      const list = BARANGAYS[m]
      expect(new Set(list).size, m).toBe(list.length)
    }
  })

  it('does not collide with the manual sentinel value', () => {
    expect(BARANGAY_MANUAL).toBe('__manual__')
    for (const m of MUNICIPALITIES) {
      expect(BARANGAYS[m]).not.toContain(BARANGAY_MANUAL)
    }
  })
})
