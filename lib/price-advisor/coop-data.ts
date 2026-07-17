export const COOP_SOURCE =
  'The Legacy Farmer Agriculture Cooperative / Northern Roots SG Group, Madaymen, Kibungan, Benguet'

interface CoopEntry {
  breakeven: number
  listPrice: number | null
  buyers: string
}

export const COOP_DATA: Record<string, CoopEntry> = {
  Cabbage: {
    breakeven: 33.39,
    listPrice: 74.32,
    buyers: 'Trading buyer (bulk 1,000kg+, cash): ₱95/kg',
  },
  'Chinese Cabbage': {
    breakeven: 29.44,
    listPrice: 77.94,
    buyers:
      'NDA/Mabalacat, Pampanga (fixed 1-yr contract): ₱75/kg; Session Groceries/The Locale Farm: ₱99/kg; Trading buyer (bulk, cash): ₱108/kg',
  },
  Carrots: {
    breakeven: 62.87,
    listPrice: 127.76,
    buyers:
      'NDA/Mabalacat, Pampanga (fixed 1-yr contract): ₱130/kg; Session Groceries/The Locale Farm: ₱130/kg',
  },
  Potato: {
    breakeven: 92.05,
    listPrice: 135.96,
    buyers: 'Session Groceries/The Locale Farm: ₱100/kg',
  },
  'Bok Choi': {
    breakeven: 95.05,
    listPrice: null,
    buyers: 'Trading buyer (bulk, cash): ₱130/kg',
  },
  Broccoli: {
    breakeven: 249.36,
    listPrice: null,
    buyers:
      'No confirmed buyer price on record yet — cost is notably high per kilo for this crop',
  },
  'Lettuce Romaine': {
    breakeven: 87.77,
    listPrice: 156.37,
    buyers: "No individual buyer quote on file; sold via cooperative's general produce list",
  },
  'Lettuce Green Ice': {
    breakeven: 87.61,
    listPrice: 156.2,
    buyers: "No individual buyer quote on file; sold via cooperative's general produce list",
  },
  'Onion Leeks': {
    breakeven: 107.24,
    listPrice: 159.91,
    buyers: "No individual buyer quote on file; sold via cooperative's general produce list",
  },
  'Chayote (Sayote)': {
    breakeven: 27.82,
    listPrice: 68.31,
    buyers: "No individual buyer quote on file; sold via cooperative's general produce list",
  },
}

export function coopBlockFor(crop: string): string | null {
  const d = COOP_DATA[crop]
  if (!d) return null
  const lines = [
    `COOPERATIVE REFERENCE DATA (source: ${COOP_SOURCE} — Agro-Enterprise Cluster production & marketing cost worksheet):`,
    `- Farmer's actual production cost (breakeven): PHP ${d.breakeven} per kg`,
  ]
  if (d.listPrice) {
    lines.push(`- Cooperative's current dry-season list price to buyers: PHP ${d.listPrice} per kg`)
  }
  lines.push(`- Known buyer prices: ${d.buyers}`)
  lines.push(
    `Use this as your primary, ground-truth reference for this crop's farmgate price and revenue estimate. Note in your explanation that the figures are grounded in the cooperative's own cost and buyer records, not a general estimate.`
  )
  return lines.join('\n')
}
