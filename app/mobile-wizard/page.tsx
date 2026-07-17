'use client'

import { useState } from 'react'

type FormData = {
  farmerName: string
  municipality: string
  barangay: string
  contactNumber: string
  cropCategory: string
  cropName: string
  customCrop: string
  plantingDate: string
  harvestDate: string
  farmSizeHectares: string
  farmSizeSqm: string
  gpsLat: string
  gpsLng: string
  issues: string[]
}

const MUNICIPALITIES = ['Baguio City', 'La Trinidad', 'Itogon', 'Sablan', 'Tuba', 'Tublay']

const CROPS: Record<string, { label: string; emoji: string; crops: string[] }> = {
  LEAFY_VEGETABLES: {
    label: 'Dahon na Gulay',
    emoji: '🥬',
    crops: ['Cabbage', 'Chinese Cabbage', 'Lettuce Romaine', 'Lettuce Green Ice', 'Bok Choi'],
  },
  FRUITING_VEGETABLES: {
    label: 'Prutas na Gulay',
    emoji: '🍅',
    crops: ['Tomato', 'Bell Pepper', 'Eggplant', 'Chayote (Sayote)', 'Sweet Pea (Snap Pea)'],
  },
  ROOT_CROPS: {
    label: 'Ugat na Pananim',
    emoji: '🥕',
    crops: ['Carrots', 'Potato', 'Onion Leeks'],
  },
  HIGH_VALUE_CROPS: {
    label: 'Mataas na Halaga',
    emoji: '🍓',
    crops: ['Strawberry', 'Broccoli', 'Other'],
  },
}

const ISSUES = [
  { id: 'pest', label: 'Peste / Insekto' },
  { id: 'rain', label: 'Sobrang Ulan' },
  { id: 'drought', label: 'Tagtuyot' },
  { id: 'disease', label: 'Sakit ng Halaman' },
]

const TOTAL_STEPS = 9

export default function MobileWizardPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>({
    farmerName: '',
    municipality: '',
    barangay: '',
    contactNumber: '',
    cropCategory: '',
    cropName: '',
    customCrop: '',
    plantingDate: '',
    harvestDate: '',
    farmSizeHectares: '',
    farmSizeSqm: '',
    gpsLat: '',
    gpsLng: '',
    issues: [],
  })
  const [referenceNumber, setReferenceNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function update(field: keyof FormData, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleIssue(id: string) {
    setForm((prev) => ({
      ...prev,
      issues: prev.issues.includes(id)
        ? prev.issues.filter((i) => i !== id)
        : [...prev.issues, id],
    }))
  }

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        farmerName: form.farmerName,
        municipality: form.municipality,
        barangay: form.barangay,
        contactNumber: form.contactNumber || undefined,
        cropCategory: form.cropCategory,
        cropName: form.cropName === 'Other' ? form.customCrop : form.cropName,
        customCrop: form.cropName === 'Other' ? form.customCrop : undefined,
        plantingDate: form.plantingDate,
        harvestDate: form.harvestDate,
        farmSizeHectares: form.farmSizeHectares ? parseFloat(form.farmSizeHectares) : undefined,
        farmSizeSqm: form.farmSizeSqm ? parseFloat(form.farmSizeSqm) : undefined,
        gpsLat: form.gpsLat ? parseFloat(form.gpsLat) : undefined,
        gpsLng: form.gpsLng ? parseFloat(form.gpsLng) : undefined,
        issues: form.issues,
      }
      const res = await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Submission failed')
      setReferenceNumber(data.referenceNumber)
      setStep(10)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'May nangyaring mali. Subukan ulit.')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = Math.round((Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100)

  return (
    <main className="min-h-screen bg-[#F8F7F2] flex flex-col">
      {/* Header */}
      <header className="bg-[#25361a] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#a8c98a] text-xs font-semibold tracking-widest">AGRIPULSE</p>
          <p className="text-white text-sm font-medium">Portal ng Magsasaka</p>
        </div>
        {step <= TOTAL_STEPS && (
          <span className="text-[#F4A300] text-sm font-bold">{step}/{TOTAL_STEPS}</span>
        )}
      </header>

      {/* Progress bar */}
      {step <= TOTAL_STEPS && (
        <div className="h-1.5 bg-[#dfe2d3]">
          <div
            className="h-full bg-[#F4A300] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex-1 px-5 py-6 max-w-lg mx-auto w-full">

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div className="text-center">
            <div className="text-6xl mb-4">🌾</div>
            <h1 className="font-heading text-2xl text-[#2D5016] mb-2">Magtanim Nang Matalino</h1>
            <p className="text-[#6b7a5f] mb-6">
              I-share ang iyong pagtatanim at kumita ng <strong className="text-[#F4A300]">+10 Data Points</strong> sa bawat submission.
            </p>
            <div className="bg-white rounded-2xl p-4 mb-8 text-left shadow-sm border border-[#e7e4d5] space-y-3">
              {[['🌱', 'Puntos para sa Pataba', 'I-redeem ang iyong points para sa fertilizer vouchers'], ['📚', 'Libreng Training', 'Priority access sa mga pagsasanay ng LGU'], ['🌾', 'Mga Binhi at Kagamitan', 'Para sa mga nangungunang contributor']].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-3 items-start">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="font-semibold text-sm text-[#2D5016]">{title}</p>
                    <p className="text-xs text-[#6b7a5f]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-[#F4A300] text-[#2D5016] font-bold py-4 rounded-xl text-base">
              MAGSIMULA →
            </button>
          </div>
        )}

        {/* Step 2 — Farmer name */}
        {step === 2 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Pangalan mo</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Ayon sa iyong government ID</p>
            <input
              type="text"
              value={form.farmerName}
              onChange={(e) => update('farmerName', e.target.value)}
              placeholder="Buong pangalan"
              className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c]"
            />
            <input
              type="tel"
              value={form.contactNumber}
              onChange={(e) => update('contactNumber', e.target.value)}
              placeholder="Numero ng telepono (opsyonal)"
              className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c] mt-3"
            />
          </div>
        )}

        {/* Step 3 — Municipality */}
        {step === 3 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Nasaan ang iyong bukid?</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Piliin ang iyong munisipalidad</p>
            <div className="grid grid-cols-2 gap-3">
              {MUNICIPALITIES.map((m) => (
                <button
                  key={m}
                  onClick={() => update('municipality', m)}
                  className={`py-4 rounded-xl border-2 text-sm font-semibold transition-all ${form.municipality === m ? 'border-[#F4A300] bg-[#F4A300]/10 text-[#2D5016]' : 'border-[#dfe2d3] bg-white text-[#6b7a5f]'}`}
                >
                  {m}
                </button>
              ))}
            </div>
            {form.municipality && (
              <input
                type="text"
                value={form.barangay}
                onChange={(e) => update('barangay', e.target.value)}
                placeholder="Barangay"
                className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c] mt-4"
              />
            )}
          </div>
        )}

        {/* Step 4 — GPS (optional) */}
        {step === 4 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Lokasyon ng Bukid</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Opsyonal — para sa mas tumpak na datos</p>
            <button
              onClick={() => {
                navigator.geolocation?.getCurrentPosition(
                  (pos) => {
                    update('gpsLat', String(pos.coords.latitude))
                    update('gpsLng', String(pos.coords.longitude))
                  },
                  () => {}
                )
              }}
              className="w-full bg-[#2D5016] text-white font-semibold py-3 rounded-xl mb-4"
            >
              📍 Kunin ang GPS Location
            </button>
            {form.gpsLat && (
              <p className="text-sm text-[#6b9a4c] text-center bg-[#6b9a4c]/10 rounded-lg py-2">
                ✓ GPS nakuha: {parseFloat(form.gpsLat).toFixed(4)}, {parseFloat(form.gpsLng).toFixed(4)}
              </p>
            )}
          </div>
        )}

        {/* Step 5 — Crop category + name */}
        {step === 5 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Anong pananim?</h2>
            <p className="text-sm text-[#6b7a5f] mb-4">Piliin ang kategorya</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {Object.entries(CROPS).map(([key, { label, emoji }]) => (
                <button
                  key={key}
                  onClick={() => { update('cropCategory', key); update('cropName', '') }}
                  className={`py-4 rounded-xl border-2 text-sm font-semibold transition-all ${form.cropCategory === key ? 'border-[#F4A300] bg-[#F4A300]/10 text-[#2D5016]' : 'border-[#dfe2d3] bg-white text-[#6b7a5f]'}`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  {label}
                </button>
              ))}
            </div>
            {form.cropCategory && (
              <div>
                <p className="text-sm font-semibold text-[#2D5016] mb-2">Piliin ang pananim:</p>
                <div className="grid grid-cols-2 gap-2">
                  {CROPS[form.cropCategory].crops.map((c) => (
                    <button
                      key={c}
                      onClick={() => update('cropName', c)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all ${form.cropName === c ? 'border-[#F4A300] bg-[#F4A300]/10 text-[#2D5016]' : 'border-[#dfe2d3] bg-white text-[#6b7a5f]'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {form.cropName === 'Other' && (
                  <input
                    type="text"
                    value={form.customCrop}
                    onChange={(e) => update('customCrop', e.target.value)}
                    placeholder="Isulat ang pananim"
                    className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c] mt-3"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 6 — Planting date */}
        {step === 6 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Kailan magtatanim?</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Petsa ng pagtatanim</p>
            <button
              onClick={() => update('plantingDate', today())}
              className="w-full bg-[#6b9a4c]/20 text-[#2D5016] font-semibold py-3 rounded-xl mb-3 text-sm"
            >
              📅 Ngayon ({today()})
            </button>
            <input
              type="date"
              value={form.plantingDate}
              onChange={(e) => update('plantingDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c]"
            />
          </div>
        )}

        {/* Step 7 — Farm size */}
        {step === 7 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Laki ng Bukid</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Opsyonal — maglagay ng isa</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#2e4321] block mb-1">Hectares</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.farmSizeHectares}
                  onChange={(e) => update('farmSizeHectares', e.target.value)}
                  placeholder="hal. 1.5"
                  className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#2e4321] block mb-1">Square Meters</label>
                <input
                  type="number"
                  min="0"
                  value={form.farmSizeSqm}
                  onChange={(e) => update('farmSizeSqm', e.target.value)}
                  placeholder="hal. 5000"
                  className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 8 — Harvest date */}
        {step === 8 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">Inaasahang Ani</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Kailan mo aanihin ang pananim?</p>
            <input
              type="date"
              value={form.harvestDate}
              onChange={(e) => update('harvestDate', e.target.value)}
              min={form.plantingDate || today()}
              className="w-full px-4 py-3 rounded-xl border border-[#dfe2d3] bg-white text-base focus:outline-none focus:border-[#6b9a4c]"
            />
          </div>
        )}

        {/* Step 9 — Issues */}
        {step === 9 && (
          <div>
            <h2 className="font-heading text-xl text-[#2D5016] mb-1">May mga Problema?</h2>
            <p className="text-sm text-[#6b7a5f] mb-6">Opsyonal — piliin lahat ng naaangkop</p>
            <div className="space-y-3">
              {ISSUES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => toggleIssue(id)}
                  className={`w-full py-3 px-4 rounded-xl border-2 text-left text-sm font-semibold transition-all ${form.issues.includes(id) ? 'border-[#F4A300] bg-[#F4A300]/10 text-[#2D5016]' : 'border-[#dfe2d3] bg-white text-[#6b7a5f]'}`}
                >
                  {form.issues.includes(id) ? '✓ ' : ''}{label}
                </button>
              ))}
            </div>
            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Step 10 — Success */}
        {step === 10 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="font-heading text-2xl text-[#2D5016] mb-2">Salamat!</h2>
            <p className="text-[#6b7a5f] mb-6">Natanggap na ang iyong submission.</p>
            <div className="bg-[#2D5016] text-white rounded-2xl p-6 mb-6">
              <p className="text-xs text-[#a8c98a] mb-1">REFERENCE NUMBER</p>
              <p className="font-heading text-2xl text-[#F4A300]">{referenceNumber}</p>
              <p className="text-xs text-[#a8c98a] mt-3">I-screenshot ito para sa iyong rekord</p>
            </div>
            <div className="bg-[#F4A300]/10 border border-[#F4A300] rounded-xl p-4 text-left mb-6">
              <p className="font-semibold text-[#2D5016] text-sm">+10 Data Points nakuha! 🌟</p>
              <p className="text-xs text-[#6b7a5f] mt-1">Ang iyong puntos ay maidadagdag sa iyong leaderboard ranking.</p>
            </div>
            <button
              onClick={() => { setStep(1); setForm({ farmerName: '', municipality: '', barangay: '', contactNumber: '', cropCategory: '', cropName: '', customCrop: '', plantingDate: '', harvestDate: '', farmSizeHectares: '', farmSizeSqm: '', gpsLat: '', gpsLng: '', issues: [] }) }}
              className="w-full bg-[#2D5016] text-white font-bold py-4 rounded-xl"
            >
              Mag-submit Ulit
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav — not shown on welcome or success */}
      {step > 1 && step <= TOTAL_STEPS && (
        <div className="px-5 py-4 bg-white border-t border-[#e7e4d5] flex gap-3">
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-3 rounded-xl border-2 border-[#dfe2d3] text-[#6b7a5f] font-semibold text-sm"
          >
            ← Bumalik
          </button>
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={
                (step === 2 && !form.farmerName) ||
                (step === 3 && (!form.municipality || !form.barangay)) ||
                (step === 5 && (!form.cropCategory || !form.cropName || (form.cropName === 'Other' && !form.customCrop))) ||
                (step === 6 && !form.plantingDate) ||
                (step === 8 && !form.harvestDate)
              }
              className="flex-[2] py-3 rounded-xl bg-[#F4A300] text-[#2D5016] font-bold text-sm disabled:opacity-40"
            >
              Susunod →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-[2] py-3 rounded-xl bg-[#2D5016] text-white font-bold text-sm disabled:opacity-50"
            >
              {submitting ? 'Isinusumite…' : 'I-SUBMIT ✓'}
            </button>
          )}
        </div>
      )}
    </main>
  )
}
