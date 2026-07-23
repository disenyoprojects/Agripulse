import { describe, it, expect, beforeEach, vi } from 'vitest'

// Control the Anthropic SDK and the rate limiter without touching the network
// or the database. `vi.hoisted` lets the mock factories reference these.
const { parseMock, checkRateLimitMock } = vi.hoisted(() => ({
  parseMock: vi.fn(),
  checkRateLimitMock: vi.fn(),
}))

vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { parse: parseMock }
  },
}))

vi.mock('@/lib/rate-limit', () => ({
  checkRateLimit: checkRateLimitMock,
  clientKey: () => 'price-advice:test',
}))

import { POST } from './route'

const validBody = {
  crop: 'Cabbage',
  quantity: 500,
  unit: 'kg',
  location: 'La Trinidad',
  expectedPrice: 30,
  harvestDate: '2026-08-15',
  grade: 'Class A',
}

const validAdvice = {
  price_low: 65,
  price_high: 85,
  price_explanation: 'x',
  revenue_low: 32500,
  revenue_high: 42500,
  confidence: 'High',
  recommendation: 'Find institutional buyers',
  reasoning: 'x',
  sustainability_tip: 'x',
  data_note: 'x',
}

function post(body: unknown) {
  return POST(
    new Request('http://localhost/api/price-advice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/price-advice', () => {
  beforeEach(() => {
    parseMock.mockReset()
    checkRateLimitMock.mockReset()
    checkRateLimitMock.mockResolvedValue({ allowed: true, retryAfterSec: 0 })
  })

  it('returns 429 with Retry-After when rate limited, without calling the model', async () => {
    checkRateLimitMock.mockResolvedValue({ allowed: false, retryAfterSec: 42 })
    const res = await post(validBody)
    expect(res.status).toBe(429)
    expect(res.headers.get('Retry-After')).toBe('42')
    expect(parseMock).not.toHaveBeenCalled()
  })

  it('returns 400 on an invalid request body', async () => {
    const res = await post({ ...validBody, quantity: -5 })
    expect(res.status).toBe(400)
    expect(parseMock).not.toHaveBeenCalled()
  })

  it('returns 200 with the parsed advice on success', async () => {
    parseMock.mockResolvedValue({ parsed_output: validAdvice, stop_reason: 'end_turn' })
    const res = await post(validBody)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ success: true, data: validAdvice })
  })

  it('returns 500 (not a crash) when the model output is truncated — the max_tokens regression', async () => {
    // Reproduces the exact failure we hit live: Sonnet 5 ran out of budget and
    // returned no structured output. The endpoint must fail gracefully.
    parseMock.mockResolvedValue({ parsed_output: null, stop_reason: 'max_tokens' })
    const res = await post(validBody)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('disables thinking so the whole token budget goes to the answer', async () => {
    parseMock.mockResolvedValue({ parsed_output: validAdvice, stop_reason: 'end_turn' })
    await post(validBody)
    expect(parseMock).toHaveBeenCalledOnce()
    const params = parseMock.mock.calls[0][0]
    expect(params.model).toBe('claude-sonnet-5')
    expect(params.thinking).toEqual({ type: 'disabled' })
  })
})
