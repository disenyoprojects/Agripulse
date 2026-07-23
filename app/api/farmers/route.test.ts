import { describe, it, expect, beforeEach, vi } from 'vitest'

const { checkRateLimitMock, dbMock } = vi.hoisted(() => ({
  checkRateLimitMock: vi.fn(),
  dbMock: {
    farmer: { findUnique: vi.fn(), create: vi.fn() },
    submission: { create: vi.fn() },
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: checkRateLimitMock,
  clientKey: () => 'submit:test',
}))

vi.mock('@/lib/db', () => ({ db: dbMock }))

import { POST } from './route'

const validPayload = {
  farmerName: 'Juan Dela Cruz',
  municipality: 'La Trinidad',
  barangay: 'Betag',
  cropCategory: 'LEAFY_VEGETABLES',
  cropName: 'Cabbage',
  plantingDate: '2026-07-01',
  harvestDate: '2026-09-01',
  issues: [],
}

function post(payload: unknown | null) {
  const fd = new FormData()
  if (payload !== null) fd.set('payload', JSON.stringify(payload))
  return POST(new Request('http://localhost/api/farmers', { method: 'POST', body: fd }))
}

describe('POST /api/farmers', () => {
  beforeEach(() => {
    checkRateLimitMock.mockReset()
    dbMock.farmer.findUnique.mockReset()
    dbMock.farmer.create.mockReset()
    dbMock.submission.create.mockReset()
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSec: 0 })
    dbMock.farmer.create.mockResolvedValue({ id: 'new-farmer' })
    dbMock.submission.create.mockResolvedValue({})
  })

  it('returns 429 when rate limited, without writing anything', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: false, retryAfterSec: 12 })
    const res = await post(validPayload)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('12')
    expect(dbMock.submission.create).not.toHaveBeenCalled()
  })

  it('returns 400 when the payload field is missing', async () => {
    const res = await post(null)
    expect(res.status).toBe(400)
  })

  it('returns 400 on an invalid payload', async () => {
    const res = await post({ ...validPayload, municipality: 'Manila' })
    expect(res.status).toBe(400)
    expect(dbMock.submission.create).not.toHaveBeenCalled()
  })

  it('creates a new farmer when there is no contact number (never looks one up)', async () => {
    const res = await post(validPayload)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.referenceNumber).toMatch(/^AP\d+$/)

    expect(dbMock.farmer.findUnique).not.toHaveBeenCalled()
    expect(dbMock.farmer.create).toHaveBeenCalledOnce()
    expect(dbMock.submission.create).toHaveBeenCalledOnce()
    expect(dbMock.submission.create.mock.calls[0][0].data.farmerId).toBe('new-farmer')
  })

  it('reuses an existing farmer matched by contact number, without creating or overwriting one', async () => {
    dbMock.farmer.findUnique.mockResolvedValue({ id: 'existing-farmer' })
    const res = await post({ ...validPayload, contactNumber: '09171234567' })
    expect(res.status).toBe(200)

    expect(dbMock.farmer.findUnique).toHaveBeenCalledOnce()
    expect(dbMock.farmer.create).not.toHaveBeenCalled()
    expect(dbMock.submission.create.mock.calls[0][0].data.farmerId).toBe('existing-farmer')
  })

  it('retries the submission on a referenceNumber collision (P2002) and succeeds', async () => {
    dbMock.submission.create
      .mockRejectedValueOnce({ code: 'P2002', meta: { target: ['referenceNumber'] } })
      .mockResolvedValueOnce({})
    const res = await post(validPayload)
    expect(res.status).toBe(200)
    expect(dbMock.submission.create).toHaveBeenCalledTimes(2)
    // The retry used a freshly generated reference number.
    const first = dbMock.submission.create.mock.calls[0][0].data.referenceNumber
    const second = dbMock.submission.create.mock.calls[1][0].data.referenceNumber
    expect(second).toMatch(/^AP\d+$/)
    expect(typeof first).toBe('string')
  })

  it('returns 500 on a non-collision database error (does not retry forever)', async () => {
    dbMock.submission.create.mockRejectedValue(new Error('connection lost'))
    const res = await post(validPayload)
    expect(res.status).toBe(500)
    expect(dbMock.submission.create).toHaveBeenCalledOnce()
  })
})
