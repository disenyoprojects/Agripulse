import { describe, it, expect } from 'vitest'
import { submissionSchema } from './submission.schema'
import { changePasswordSchema } from './password.schema'

const validSubmission = {
  farmerName: 'Juan Dela Cruz',
  municipality: 'La Trinidad',
  barangay: 'Betag',
  cropCategory: 'LEAFY_VEGETABLES',
  cropName: 'Cabbage',
  plantingDate: '2026-07-01',
  harvestDate: '2026-09-01',
  issues: [],
}

describe('submissionSchema', () => {
  it('accepts a valid submission', () => {
    expect(submissionSchema.safeParse(validSubmission).success).toBe(true)
  })

  it('rejects an unknown municipality', () => {
    const r = submissionSchema.safeParse({ ...validSubmission, municipality: 'Manila' })
    expect(r.success).toBe(false)
  })

  it('rejects an empty barangay', () => {
    const r = submissionSchema.safeParse({ ...validSubmission, barangay: '' })
    expect(r.success).toBe(false)
  })

  it('defaults issues to an empty array when omitted', () => {
    const { issues, ...withoutIssues } = validSubmission
    void issues
    const r = submissionSchema.safeParse(withoutIssues)
    expect(r.success).toBe(true)
    if (r.success) expect(r.data.issues).toEqual([])
  })
})

describe('changePasswordSchema', () => {
  const base = { currentPassword: 'oldpass1', newPassword: 'brandnew1', confirmPassword: 'brandnew1' }

  it('accepts a valid change', () => {
    expect(changePasswordSchema.safeParse(base).success).toBe(true)
  })

  it('rejects a new password shorter than 8 characters', () => {
    const r = changePasswordSchema.safeParse({ ...base, newPassword: 'short', confirmPassword: 'short' })
    expect(r.success).toBe(false)
  })

  it('rejects when confirmation does not match', () => {
    const r = changePasswordSchema.safeParse({ ...base, confirmPassword: 'different1' })
    expect(r.success).toBe(false)
  })

  it('rejects when the new password equals the current one', () => {
    const r = changePasswordSchema.safeParse({
      currentPassword: 'samepass1',
      newPassword: 'samepass1',
      confirmPassword: 'samepass1',
    })
    expect(r.success).toBe(false)
  })
})
