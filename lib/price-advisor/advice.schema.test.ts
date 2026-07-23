import { describe, it, expect } from 'vitest'
import { adviceResultSchema } from './advice.schema'

const validAdvice = {
  price_low: 18,
  price_high: 25,
  price_explanation: 'Cabbage supply is high this week, pulling farmgate prices below your expectation.',
  revenue_low: 9000,
  revenue_high: 12500,
  confidence: 'Medium',
  recommendation: 'Wait',
  reasoning: 'Prices usually recover after the current oversupply clears in about two weeks.',
  sustainability_tip: 'Store in a cool, shaded area to avoid spoilage while you wait.',
  data_note: 'Estimate grounded in your cooperative’s own price records.',
}

describe('adviceResultSchema', () => {
  it('accepts a fully-formed advice object', () => {
    expect(adviceResultSchema.safeParse(validAdvice).success).toBe(true)
  })

  it('rejects a missing field', () => {
    const { reasoning, ...withoutReasoning } = validAdvice
    void reasoning
    expect(adviceResultSchema.safeParse(withoutReasoning).success).toBe(false)
  })

  it('rejects a price given as a string instead of a number', () => {
    const r = adviceResultSchema.safeParse({ ...validAdvice, price_low: '18' })
    expect(r.success).toBe(false)
  })

  it('rejects a confidence outside the allowed set', () => {
    const r = adviceResultSchema.safeParse({ ...validAdvice, confidence: 'Very High' })
    expect(r.success).toBe(false)
  })

  it('rejects a recommendation outside the allowed set', () => {
    const r = adviceResultSchema.safeParse({ ...validAdvice, recommendation: 'Sell tomorrow' })
    expect(r.success).toBe(false)
  })
})
