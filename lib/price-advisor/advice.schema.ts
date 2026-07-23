import { z } from 'zod'

/**
 * The exact shape the price advisor returns to the client. This is both the
 * contract we hand the model (via `zodOutputFormat`, so the API guarantees a
 * conforming object) and the validation gate on the way out — the frontend
 * reads every one of these fields, so a missing or mistyped field must never
 * reach it.
 *
 * Kept free of numeric range / string-length constraints: structured outputs
 * ignore them, and the frontend does its own display formatting.
 */
export const adviceResultSchema = z.object({
  price_low: z.number(),
  price_high: z.number(),
  price_explanation: z.string(),
  revenue_low: z.number(),
  revenue_high: z.number(),
  confidence: z.enum(['High', 'Medium', 'Low']),
  recommendation: z.enum([
    'Sell today',
    'Wait',
    'Find institutional buyers',
    'Process into value-added products',
    'Bundle with other crops',
    'Donate excess for community impact',
  ]),
  reasoning: z.string(),
  sustainability_tip: z.string(),
  data_note: z.string(),
})

export type AdviceResult = z.infer<typeof adviceResultSchema>
