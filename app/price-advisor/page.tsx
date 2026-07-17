'use client'

import { useState } from 'react'

const BLISTT_LOCATIONS = [
  'La Trinidad, Benguet',
  'Baguio City',
  'Itogon, Benguet',
  'Sablan, Benguet',
  'Tuba, Benguet',
  'Tublay, Benguet',
  'Atok, Benguet',
  'Buguias, Benguet',
  'Kapangan, Benguet',
  'Kibungan, Benguet',
  'Mankayan, Benguet',
  'Bakun, Benguet',
]

const COMMON_CROPS = [
  'Cabbage', 'Chinese Cabbage', 'Carrots', 'Potato', 'Bok Choi',
  'Broccoli', 'Lettuce Romaine', 'Lettuce Green Ice', 'Onion Leeks',
  'Chayote (Sayote)', 'Sweet Pea (Snap Pea)', 'Bell Pepper', 'Strawberry', 'Other',
]

const UNITS = ['kg', 'sacks (50kg)', 'crates'] as const

const GRADES = [
  'Grade A — Premium / Export Quality',
  'Grade B — Standard / Local Market',
  'Grade C — Processing / Below Standard',
]

const COOP_SOURCE = 'The Legacy Farmer Agriculture Cooperative / Northern Roots SG Group, Madaymen, Kibungan, Benguet'

const COOP_DATA: Record<string, { breakeven: number; listPrice: number | null; buyers: string }> = {
  'Cabbage': { breakeven: 33.39, listPrice: 74.32, buyers: 'Trading buyer (bulk 1,000kg+, cash): ₱95/kg' },
  'Chinese Cabbage': { breakeven: 29.44, listPrice: 77.94, buyers: 'NDA/Mabalacat, Pampanga (fixed 1-yr contract): ₱75/kg; Session Groceries/The Locale Farm: ₱99/kg; Trading buyer (bulk, cash): ₱108/kg' },
  'Carrots': { breakeven: 62.87, listPrice: 127.76, buyers: 'NDA/Mabalacat, Pampanga (fixed 1-yr contract): ₱130/kg; Session Groceries/The Locale Farm: ₱130/kg' },
  'Potato': { breakeven: 92.05, listPrice: 135.96, buyers: 'Session Groceries/The Locale Farm: ₱100/kg' },
  'Bok Choi': { breakeven: 95.05, listPrice: null, buyers: 'Trading buyer (bulk, cash): ₱130/kg' },
  'Broccoli': { breakeven: 249.36, listPrice: null, buyers: 'No confirmed buyer price on record yet — cost is notably high per kilo for this crop' },
  'Lettuce Romaine': { breakeven: 87.77, listPrice: 156.37, buyers: 'No individual buyer quote on file; sold via cooperative\'s general produce list' },
  'Lettuce Green Ice': { breakeven: 87.61, listPrice: 156.20, buyers: 'No individual buyer quote on file; sold via cooperative\'s general produce list' },
  'Onion Leeks': { breakeven: 107.24, listPrice: 159.91, buyers: 'No individual buyer quote on file; sold via cooperative\'s general produce list' },
  'Chayote (Sayote)': { breakeven: 27.82, listPrice: 68.31, buyers: 'No individual buyer quote on file; sold via cooperative\'s general produce list' },
}

function coopBlockFor(crop: string): string | null {
  const d = COOP_DATA[crop]
  if (!d) return null
  const lines = [
    `COOPERATIVE REFERENCE DATA (source: ${COOP_SOURCE} — Agro-Enterprise Cluster production & marketing cost worksheet):`,
    `- Farmer's actual production cost (breakeven): PHP ${d.breakeven} per kg`,
  ]
  if (d.listPrice) lines.push(`- Cooperative's current dry-season list price to buyers: PHP ${d.listPrice} per kg`)
  lines.push(`- Known buyer prices: ${d.buyers}`)
  lines.push(`Use this as your primary, ground-truth reference for this crop's farmgate price and revenue estimate. Note in your explanation that the figures are grounded in the cooperative's own cost and buyer records, not a general estimate.`)
  return lines.join('\n')
}

interface FormData {
  crop: string
  customCrop: string
  quantity: string
  unit: typeof UNITS[number]
  location: string
  expectedPrice: string
  harvestDate: string
  grade: string
}

interface AdviceResult {
  price_low: number
  price_high: number
  price_explanation: string
  revenue_low: number
  revenue_high: number
  confidence: 'High' | 'Medium' | 'Low'
  recommendation: string
  reasoning: string
  sustainability_tip: string
  data_note: string
}

const RECOMMENDATION_ICONS: Record<string, string> = {
  'Sell today': '⚡',
  'Wait': '⏳',
  'Find institutional buyers': '🏢',
  'Process into value-added products': '🏭',
  'Bundle with other crops': '🧺',
  'Donate excess for community impact': '🤝',
}

const CONF_DOT: Record<string, string> = {
  High: '#6b9a4c',
  Medium: '#dfa93a',
  Low: '#c9503f',
}

const LOADING_MESSAGES = [
  'Checking regional market trends…',
  'Comparing farmgate prices nearby…',
  'Working out a fair recommendation…',
]

function peso(n: number) {
  return `₱${Number(n).toLocaleString('en-PH', { maximumFractionDigits: 0 })}`
}

export default function PriceAdvisorPage() {
  const [form, setForm] = useState<FormData>({
    crop: '', customCrop: '', quantity: '', unit: 'kg',
    location: '', expectedPrice: '', harvestDate: '', grade: '',
  })
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [result, setResult] = useState<AdviceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const effectiveCrop = form.crop === 'Other' ? form.customCrop : form.crop
  const coopData = COOP_DATA[effectiveCrop]

  function updateField(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setResult(null)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
    const qty = parseFloat(form.quantity)
    const price = parseFloat(form.expectedPrice)
    if (!effectiveCrop || !qty || !price || !form.location || !form.harvestDate || !form.grade) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    let msgIndex = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[msgIndex])
    }, 1800)
    try {
      const res = await fetch('/api/price-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: effectiveCrop, quantity: qty, unit: form.unit,
          location: form.location, expectedPrice: price,
          harvestDate: form.harvestDate, grade: form.grade,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Request failed')
      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <main style={{ background: '#f8f6ef', minHeight: '100vh', paddingTop: '72px' }}>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(155deg, #25361a 0%, #3f5c2c 100%)',
        padding: '64px 40px 84px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 26px)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: '760px', position: 'relative' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.12)',
            color: '#a8c98a',
            fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)',
            fontWeight: 600,
            fontSize: '0.78rem',
            letterSpacing: '1.2px',
            padding: '6px 16px',
            borderRadius: '999px',
            marginBottom: '18px',
          }}>
            AI PRICE ADVISOR
          </span>
          <h1 style={{
            fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)',
            color: 'white',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            margin: '0 0 16px',
          }}>
            Know Your Harvest&apos;s{' '}
            <span style={{ color: '#e79c3d' }}>True Value</span>{' '}
            Before You Sell
          </h1>
          <p style={{ color: '#dfe6d4', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '560px', margin: 0 }}>
            Tell us about your crop, and AgriPulse AI will walk you through a fair farmgate price,
            an honest explanation of the market, and a clear next step — in plain, friendly language.
          </p>
        </div>
      </section>

      {/* Content area */}
      <div style={{ maxWidth: '920px', margin: '0 auto', padding: '0 40px 60px' }}>

        {/* Advisor card — floats over hero */}
        <section style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 45px -20px rgba(37,54,26,0.35)',
          padding: '36px',
          marginTop: '-46px',
          position: 'relative',
          zIndex: 2,
        }}>
          <h2 style={{
            fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)',
            margin: '0 0 6px',
            fontSize: '1.4rem',
            color: '#25361a',
          }}>Tell Us About Your Harvest</h2>
          <p style={{ color: '#61705a', fontSize: '0.93rem', margin: '0 0 26px' }}>
            Fill in what you know — estimates are fine. This takes less than a minute.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px 24px',
            }} className="field-grid">

              {/* Crop */}
              <div>
                <label style={labelStyle}>Crop</label>
                <select
                  value={form.crop}
                  onChange={(e) => updateField('crop', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select crop</option>
                  {COMMON_CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {/* Coop status */}
                {form.crop && form.crop !== 'Other' && (
                  <span style={{
                    display: 'block', fontSize: '0.78rem', marginTop: '6px',
                    fontWeight: 600,
                    color: coopData ? '#3f5c2c' : '#8a7a55',
                  }}>
                    {coopData
                      ? `✓ Using your cooperative's own cost data — breakeven ₱${coopData.breakeven}/kg`
                      : 'No cooperative cost data on file — estimate uses general regional trends'
                    }
                  </span>
                )}
                {form.crop === 'Other' && (
                  <input
                    type="text"
                    value={form.customCrop}
                    onChange={(e) => updateField('customCrop', e.target.value)}
                    placeholder="e.g. Chili peppers"
                    style={{ ...inputStyle, marginTop: '8px' }}
                  />
                )}
              </div>

              {/* Harvest Quantity */}
              <div>
                <label style={labelStyle}>Harvest Quantity</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 500"
                    value={form.quantity}
                    onChange={(e) => updateField('quantity', e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                    required
                  />
                  <select
                    value={form.unit}
                    onChange={(e) => updateField('unit', e.target.value as typeof UNITS[number])}
                    style={{ ...inputStyle, flex: '0 0 110px' }}
                  >
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  list="locationList"
                  placeholder="e.g. La Trinidad, Benguet"
                  value={form.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  style={inputStyle}
                  required
                />
                <datalist id="locationList">
                  {BLISTT_LOCATIONS.map((l) => <option key={l} value={l} />)}
                </datalist>
              </div>

              {/* Expected Price */}
              <div>
                <label style={labelStyle}>Your Expected Selling Price (₱ / kg)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g. 35"
                  value={form.expectedPrice}
                  onChange={(e) => updateField('expectedPrice', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Harvest Date */}
              <div>
                <label style={labelStyle}>Harvest Date</label>
                <input
                  type="date"
                  value={form.harvestDate}
                  onChange={(e) => updateField('harvestDate', e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>

              {/* Grade */}
              <div>
                <label style={labelStyle}>Quality Grade</label>
                <select
                  value={form.grade}
                  onChange={(e) => updateField('grade', e.target.value)}
                  style={inputStyle}
                  required
                >
                  <option value="">Select grade</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

            </div>

            <div style={{ marginTop: '28px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? '#d8cdb8' : '#e79c3d',
                  color: '#25361a',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.6px',
                  padding: '14px 30px',
                  borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s, transform 0.1s',
                }}
              >
                GET PRICE ADVICE
              </button>
              {loading && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#61705a', fontSize: '0.88rem', fontStyle: 'italic' }}>
                  <span style={{
                    width: '18px', height: '18px',
                    border: '2.5px solid #e2ddc9',
                    borderTopColor: '#e79c3d',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  {loadingMsg}
                </span>
              )}
            </div>

            {error && (
              <div style={{
                marginTop: '20px', background: '#fbebe8',
                border: '1px solid #eec3bb', color: '#8a3527',
                padding: '14px 16px', borderRadius: '10px', fontSize: '0.9rem',
              }}>
                {error}
              </div>
            )}
          </form>
        </section>

        {/* Results section */}
        {result && (
          <section style={{
            background: 'white',
            borderRadius: '20px',
            boxShadow: '0 20px 45px -20px rgba(37,54,26,0.35)',
            padding: '40px',
            margin: '28px 0 0',
          }}>
            <span style={{
              display: 'inline-block',
              background: '#a8c98a',
              color: '#25361a',
              fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '1.2px',
              padding: '6px 16px',
              borderRadius: '999px',
              marginBottom: '14px',
            }}>
              AI RECOMMENDATION
            </span>
            <h2 style={{
              fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)',
              color: '#4a2c1d',
              fontSize: '1.7rem',
              margin: '0 0 28px',
            }}>
              Your Price Advisory
            </h2>

            {/* Price hero */}
            <div style={{
              background: 'linear-gradient(135deg, #3f5c2c, #25361a)',
              borderRadius: '16px',
              padding: '28px 32px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px',
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.5px', color: '#a8c98a', fontWeight: 600, marginBottom: '6px' }}>
                  ESTIMATED FARMGATE PRICE
                </div>
                <div style={{ fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)', fontSize: '2.3rem', fontWeight: 700, color: '#e79c3d' }}>
                  {peso(result.price_low)}–{peso(result.price_high)}{' '}
                  <small style={{ fontSize: '1rem', color: '#e7ecd9', fontWeight: 500 }}>/ kg</small>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', letterSpacing: '0.5px', color: '#a8c98a', fontWeight: 600, marginBottom: '6px' }}>
                  ESTIMATED REVENUE
                </div>
                <div style={{ fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
                  {peso(result.revenue_low)}–{peso(result.revenue_high)}
                </div>
              </div>
            </div>

            {/* Stat grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }} className="stat-grid">
              <div style={{ borderRadius: '14px', padding: '20px 22px', background: '#f8f6ef', border: '1px solid #e7e4d5' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.4px', color: '#6b7a5f', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Confidence Level
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '13px', height: '13px',
                    background: CONF_DOT[result.confidence] ?? '#6b9a4c',
                    display: 'inline-block', flexShrink: 0,
                    borderRadius: '50%',
                  }} />
                  <span style={{ fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)', fontSize: '1.05rem', fontWeight: 700, color: '#25361a' }}>
                    {result.confidence}
                  </span>
                </div>
              </div>
              <div style={{ borderRadius: '14px', padding: '20px 22px', background: '#f8f6ef', border: '1px solid #e7e4d5' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.4px', color: '#6b7a5f', marginBottom: '10px', textTransform: 'uppercase' }}>
                  Recommended Action
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: '#e79c3d',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0,
                  }}>
                    {RECOMMENDATION_ICONS[result.recommendation] ?? '📋'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-baloo2, Baloo 2, sans-serif)', fontSize: '1.02rem', fontWeight: 700, color: '#25361a', lineHeight: 1.3 }}>
                    {result.recommendation}
                  </span>
                </div>
              </div>
            </div>

            {/* Explain panel */}
            <div style={{
              padding: '20px 22px', borderRadius: '14px', marginBottom: '16px',
              lineHeight: 1.65, fontSize: '0.95rem',
              background: '#fbf3e6', border: '1px solid #f0dfc0',
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.4px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', color: '#c97f24' }}>
                Why the price may differ from what you expected
              </span>
              {result.price_explanation}
            </div>

            {/* Reason panel */}
            <div style={{
              padding: '20px 22px', borderRadius: '14px', marginBottom: '16px',
              lineHeight: 1.65, fontSize: '0.95rem',
              background: '#f8f6ef', border: '1px solid #e7e4d5',
            }}>
              <span style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.4px', textTransform: 'uppercase', display: 'block', marginBottom: '8px', color: '#2e4321' }}>
                What this means for you
              </span>
              {result.reasoning}
            </div>

            {/* Sustainability banner */}
            <div style={{
              background: '#a8c98a', color: '#25361a',
              borderRadius: '14px', padding: '18px 22px',
              fontSize: '0.93rem', lineHeight: 1.55,
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              marginBottom: '16px',
            }}>
              <span style={{ flexShrink: 0, marginTop: '2px' }}>🌱</span>
              <span>{result.sustainability_tip}</span>
            </div>

            {/* Data note */}
            <p style={{ fontSize: '0.82rem', color: '#7c8a70', fontStyle: 'italic', margin: '0 0 24px' }}>
              ℹ️ {result.data_note}
            </p>

            <button
              onClick={() => { setResult(null); setError(null) }}
              style={{
                width: '100%', border: '1.5px solid #25361a', color: '#25361a',
                background: 'transparent', fontFamily: 'inherit',
                fontWeight: 600, padding: '12px', borderRadius: '10px',
                fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Start New Analysis
            </button>
          </section>
        )}
      </div>

      <footer style={{
        background: '#25361a', color: '#c9d3bd',
        textAlign: 'center', padding: '26px',
        fontSize: '0.85rem',
      }}>
        AgriPulse AI Price Advisor — estimates are based on regional trends and are meant to guide, not replace, your own judgment.
      </footer>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 680px) {
          .field-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '0.94rem',
  padding: '11px 13px',
  border: '1.5px solid #dfe2d3',
  borderRadius: '10px',
  background: '#f8f6ef',
  color: '#26301b',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: '#2e4321',
  letterSpacing: '0.2px',
  marginBottom: '6px',
}
