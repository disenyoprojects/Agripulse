import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import { coopBlockFor } from '@/lib/price-advisor/coop-data'
import { SYSTEM_PROMPT } from '@/lib/price-advisor/system-prompt'
import { adviceResultSchema } from '@/lib/price-advisor/advice.schema'
import { checkRateLimit, clientKey } from '@/lib/rate-limit'

const client = new Anthropic()

// Each call bills Anthropic, so this public endpoint is capped tighter than the
// DB-only submission route: a handful of advice requests per IP per few minutes.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 5 * 60_000

const requestSchema = z.object({
  crop: z.string().min(1),
  quantity: z.number().positive(),
  unit: z.enum(['kg', 'sacks (50kg)', 'crates']),
  location: z.string().min(1),
  expectedPrice: z.number().positive(),
  harvestDate: z.string(),
  grade: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const rate = await checkRateLimit(clientKey(request, 'price-advice'), RATE_LIMIT, RATE_WINDOW_MS)
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Sobra ang bilang ng request. Subukan muli mamaya.' },
        { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
      )
    }

    const body = await request.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { crop, quantity, unit, location, expectedPrice, harvestDate, grade } = parsed.data

    const coopBlock = coopBlockFor(crop)
    const userMessage = [
      `Crop: ${crop}`,
      `Harvest Quantity: ${quantity} ${unit}`,
      `Location: ${location}, Cordillera Administrative Region (CAR), Philippines`,
      `Farmer's Expected Selling Price: PHP ${expectedPrice} per kg`,
      `Harvest Date: ${harvestDate}`,
      `Quality Grade: ${grade}`,
      coopBlock ? `\n${coopBlock}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    // Structured outputs: the API constrains the response to the schema, so we
    // read `parsed_output` directly instead of stripping fences and hoping the
    // text is valid JSON. A safety refusal leaves `parsed_output` null.
    const response = await client.messages.parse({
      model: 'claude-sonnet-5',
      max_tokens: 1500,
      // Sonnet 5 runs adaptive thinking by default (Sonnet 4.6 didn't). This is
      // a bounded, well-specified extraction, so thinking only burns the token
      // budget and latency — disable it and keep the whole budget for output.
      thinking: { type: 'disabled' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      output_config: { format: zodOutputFormat(adviceResultSchema) },
    })

    if (!response.parsed_output) {
      throw new Error(`No structured advice returned (stop_reason: ${response.stop_reason})`)
    }

    return NextResponse.json({ success: true, data: response.parsed_output })
  } catch (error) {
    console.error('Price advice error:', error)
    return NextResponse.json(
      { success: false, error: 'The advisor is temporarily unavailable. Please try again.' },
      { status: 500 }
    )
  }
}
