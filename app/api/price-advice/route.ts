import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { coopBlockFor } from '@/lib/price-advisor/coop-data'
import { SYSTEM_PROMPT } from '@/lib/price-advisor/system-prompt'

const client = new Anthropic()

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

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No response from AI')
    }

    const cleaned = textBlock.text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Price advice error:', error)
    return NextResponse.json(
      { success: false, error: 'The advisor is temporarily unavailable. Please try again.' },
      { status: 500 }
    )
  }
}
