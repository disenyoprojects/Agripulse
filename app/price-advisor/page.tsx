'use client'

import { useState } from 'react'
import Link from 'next/link'

const BLISTT_MUNICIPALITIES = [
  'Baguio City',
  'La Trinidad',
  'Itogon',
  'Sablan',
  'Tuba',
  'Tublay',
]

const COMMON_CROPS = [
  'Cabbage', 'Chinese Cabbage', 'Carrots', 'Potato', 'Bok Choi',
  'Broccoli', 'Lettuce Romaine', 'Lettuce Green Ice', 'Onion Leeks',
  'Chayote (Sayote)', 'Strawberry', 'Other',
]

const UNITS = ['kg', 'sacks (50kg)', 'crates'] as const
const GRADES = ['Grade A (Premium)', 'Grade B (Commercial)', 'Grade C (Local market)']

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

const CONFIDENCE_COLORS: Record<string, string> = {
  High: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  Low: 'text-orange-700 bg-orange-50 border-orange-200',
}

const RECOMMENDATION_ICONS: Record<string, string> = {
  'Sell today': '⚡',
  'Wait': '⏳',
  'Find institutional buyers': '🏢',
  'Process into value-added products': '🏭',
  'Bundle with other crops': '🧺',
  'Donate excess for community impact': '🤝',
}

function formatPHP(amount: number) {
  return `₱${amount.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`
}

export default function PriceAdvisorPage() {
  const [form, setForm] = useState<FormData>({
    crop: '',
    customCrop: '',
    quantity: '',
    unit: 'kg',
    location: '',
    expectedPrice: '',
    harvestDate: '',
    grade: '',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AdviceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const effectiveCrop = form.crop === 'Other' ? form.customCrop : form.crop

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
      setError('Pakumpleto ang lahat ng fields (Please fill in all fields).')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/price-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: effectiveCrop,
          quantity: qty,
          unit: form.unit,
          location: form.location,
          expectedPrice: price,
          harvestDate: form.harvestDate,
          grade: form.grade,
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error ?? 'Request failed')
      setResult(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F2]">
      <header className="bg-[#25361a] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#a8c98a] text-xs font-semibold tracking-widest">AGRIPULSE</p>
          <p className="text-white text-sm">AI Price Advisor</p>
        </div>
        <nav className="flex gap-4 text-xs text-[#a8c98a]">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/mobile-wizard" className="hover:text-white">Portal</Link>
          <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="font-heading text-3xl text-[#2D5016] mb-2">AI Price Advisor</h1>
          <p className="text-[#6b7a5f] text-sm max-w-sm mx-auto">
            Get AI-powered farmgate price estimates grounded in Cordillera cooperative data.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e4d5] space-y-5">
          {/* Crop */}
          <div>
            <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
              Crop
            </label>
            <select
              value={form.crop}
              onChange={(e) => updateField('crop', e.target.value)}
              className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#2D5016]"
            >
              <option value="">— Pumili ng pananim —</option>
              {COMMON_CROPS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {form.crop === 'Other' && (
            <div>
              <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
                Specify Crop
              </label>
              <input
                type="text"
                value={form.customCrop}
                onChange={(e) => updateField('customCrop', e.target.value)}
                placeholder="e.g. Chili peppers"
                className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D5016]"
              />
            </div>
          )}

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={(e) => updateField('quantity', e.target.value)}
                placeholder="e.g. 500"
                className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D5016]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
                Unit
              </label>
              <select
                value={form.unit}
                onChange={(e) => updateField('unit', e.target.value as typeof UNITS[number])}
                className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#2D5016]"
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
              Municipality
            </label>
            <select
              value={form.location}
              onChange={(e) => updateField('location', e.target.value)}
              className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm text-[#2C2C2C] focus:outline-none focus:border-[#2D5016]"
            >
              <option value="">— Pumili ng lugar —</option>
              {BLISTT_MUNICIPALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Expected price + Harvest date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
                Expected Price (₱/kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.expectedPrice}
                onChange={(e) => updateField('expectedPrice', e.target.value)}
                placeholder="e.g. 80"
                className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D5016]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
                Harvest Date
              </label>
              <input
                type="date"
                value={form.harvestDate}
                onChange={(e) => updateField('harvestDate', e.target.value)}
                className="w-full border border-[#e7e4d5] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2D5016]"
              />
            </div>
          </div>

          {/* Grade */}
          <div>
            <label className="block text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-1">
              Quality Grade
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => updateField('grade', g)}
                  className={`rounded-lg py-2 px-2 text-xs font-semibold border transition-all ${
                    form.grade === g
                      ? 'bg-[#2D5016] text-white border-[#2D5016]'
                      : 'bg-white text-[#6b7a5f] border-[#e7e4d5] hover:border-[#2D5016]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F4A300] hover:bg-[#d48f00] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Analyzing market data...
              </span>
            ) : (
              'Get Price Advice'
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 space-y-4">
            {/* Price range */}
            <div className="bg-[#2D5016] rounded-2xl p-6 text-white">
              <p className="text-[#a8c98a] text-xs font-semibold uppercase tracking-widest mb-3">Estimated Farmgate Price</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-4xl font-bold text-[#F4A300]">{formatPHP(result.price_low)}</span>
                <span className="text-2xl text-[#a8c98a] mb-1">–</span>
                <span className="text-4xl font-bold text-[#F4A300]">{formatPHP(result.price_high)}</span>
                <span className="text-sm text-[#a8c98a] mb-2">/ kg</span>
              </div>
              <p className="text-sm text-[#a8c98a] mt-3">{result.price_explanation}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-[#a8c98a]">Confidence:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${CONFIDENCE_COLORS[result.confidence] ?? ''}`}>
                  {result.confidence}
                </span>
              </div>
            </div>

            {/* Revenue estimate */}
            <div className="bg-white rounded-2xl p-5 border border-[#e7e4d5] shadow-sm">
              <p className="text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-3">Total Revenue Estimate</p>
              <p className="text-2xl font-bold text-[#2D5016]">
                {formatPHP(result.revenue_low)} – {formatPHP(result.revenue_high)}
              </p>
              <p className="text-xs text-[#6b7a5f] mt-1">for your {form.quantity} {form.unit} of {effectiveCrop}</p>
            </div>

            {/* Recommendation */}
            <div className="bg-[#F4A300]/10 border border-[#F4A300]/30 rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#6b7a5f] uppercase tracking-wide mb-2">Recommendation</p>
              <p className="text-xl font-bold text-[#2D5016] flex items-center gap-2">
                <span>{RECOMMENDATION_ICONS[result.recommendation] ?? '📋'}</span>
                <span>{result.recommendation}</span>
              </p>
              <p className="text-sm text-[#2C2C2C] mt-3">{result.reasoning}</p>
            </div>

            {/* Sustainability tip */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">🌿 Sustainability Tip</p>
              <p className="text-sm text-emerald-800">{result.sustainability_tip}</p>
            </div>

            {/* Data note */}
            <div className="bg-[#F8F7F2] border border-[#e7e4d5] rounded-xl px-4 py-3">
              <p className="text-xs text-[#6b7a5f]">ℹ️ {result.data_note}</p>
            </div>

            <button
              onClick={() => { setResult(null); setError(null) }}
              className="w-full border border-[#2D5016] text-[#2D5016] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#2D5016] hover:text-white transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-xs text-[#7c8a70]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
