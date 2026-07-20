'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const spring = { type: 'spring', stiffness: 500, damping: 22 } as const

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

type FarmerCache = {
  farmerName: string
  contactNumber: string
  municipality: string
  barangay: string
}
const FARMER_CACHE_KEY = 'agripulse_farmer'

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
  { id: 'none', label: 'Walang Problema' },
]

const TOTAL_STEPS = 9

const STEP_TITLES: Record<number, string> = {
  1: 'Magsimula',
  2: 'Pangalan',
  3: 'Lokasyon',
  4: 'GPS',
  5: 'Uri ng Tanim',
  6: 'Petsa ng Tanim',
  7: 'Laki ng Bukid',
  8: 'Petsa ng Ani',
  9: 'Mga Problema',
}

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FARMER_CACHE_KEY)
      if (!raw) return
      const cached = JSON.parse(raw) as FarmerCache
      setForm((prev) => ({ ...prev, ...cached }))
    } catch {
      // corrupted cache — ignore, start fresh
    }
  }, [])

  function update(field: keyof FormData, value: string | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleIssue(id: string) {
    setForm((prev) => {
      if (id === 'none') return { ...prev, issues: prev.issues.includes('none') ? [] : ['none'] }
      const withoutNone = prev.issues.filter((i) => i !== 'none')
      return {
        ...prev,
        issues: withoutNone.includes(id) ? withoutNone.filter((i) => i !== id) : [...withoutNone, id],
      }
    })
  }

  function today() {
    return new Date().toISOString().split('T')[0]
  }

  function resetForm() {
    setForm({ farmerName: '', municipality: '', barangay: '', contactNumber: '', cropCategory: '', cropName: '', customCrop: '', plantingDate: '', harvestDate: '', farmSizeHectares: '', farmSizeSqm: '', gpsLat: '', gpsLng: '', issues: [] })
    setStep(1)
    setReferenceNumber('')
    setError('')
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
      localStorage.setItem(
        FARMER_CACHE_KEY,
        JSON.stringify({
          farmerName: form.farmerName,
          contactNumber: form.contactNumber,
          municipality: form.municipality,
          barangay: form.barangay,
        })
      )
      setStep(10)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'May nangyaring mali. Subukan ulit.')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = Math.round((Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100)
  const isSuccess = step === 10

  return (
    <main style={{ background: '#F8F7F2', minHeight: '100vh', paddingTop: '80px' }}>
      {/* App container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        minHeight: 'calc(100vh - 80px)',
        boxShadow: '0 0 40px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* App header */}
        {!isSuccess && (
          <>
            <div style={{
              background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2C 100%)',
              padding: '20px',
              color: 'white',
              position: 'sticky',
              top: '80px',
              zIndex: 100,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      color: 'white',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      fontSize: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    ←
                  </button>
                )}
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '3px' }}>
                    {step === 1 ? 'Portal ng Magsasaka' : STEP_TITLES[step] || 'AgriPulse'}
                  </h1>
                  <p style={{ fontSize: '13px', opacity: 0.9 }}>
                    {step > 1 ? `Hakbang ${step} ng ${TOTAL_STEPS}` : 'BLISTT Agricultural System'}
                  </p>
                </div>
                {step > 1 && (
                  <span style={{ color: '#F4A300', fontSize: '14px', fontWeight: 700 }}>
                    {step}/{TOTAL_STEPS}
                  </span>
                )}
              </div>

              {step > 1 && (
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '3px', overflow: 'hidden', marginTop: '15px' }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: '#F4A300',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              )}
            </div>
          </>
        )}

        {/* Content area */}
        <div style={{ flex: 1, padding: '24px 20px' }}>

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '72px', marginBottom: '1rem' }}>🌾</div>
              <h1 style={{
                fontFamily: 'Anton, sans-serif',
                fontWeight: 400,
                fontSize: '2rem',
                color: '#2D5016',
                marginBottom: '0.5rem',
              }}>
                Magtanim Nang Matalino
              </h1>
              <p style={{ color: '#666', marginBottom: '2rem', lineHeight: 1.7 }}>
                I-share ang iyong pagtatanim at kumita ng{' '}
                <strong style={{ color: '#F4A300' }}>+10 Data Points</strong>{' '}
                sa bawat submission.
              </p>

              <div style={{
                background: '#F8F7F2',
                borderRadius: '16px',
                padding: '1.25rem',
                marginBottom: '2rem',
                textAlign: 'left',
                border: '1px solid #E7E4D5',
              }}>
                {[
                  ['🌱', 'Puntos para sa Pataba', 'I-redeem ang iyong points para sa fertilizer vouchers'],
                  ['📚', 'Libreng Training', 'Priority access sa mga pagsasanay ng LGU'],
                  ['🌾', 'Mga Binhi at Kagamitan', 'Para sa mga nangungunang contributor'],
                ].map(([icon, title, desc]) => (
                  <div key={title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.75rem' }}>{icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#2D5016', marginBottom: '2px' }}>{title}</p>
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                style={{
                  width: '100%',
                  background: '#F4A300',
                  color: '#2D5016',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '14px',
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                }}
              >
                MAGSIMULA →
              </motion.button>
            </div>
          )}

          {/* Step 2 — Name */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontWeight: 400, fontSize: '1.5rem', color: '#2D5016', marginBottom: '4px' }}>Pangalan mo</h2>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>Ayon sa iyong government ID</p>
              <input
                type="text"
                value={form.farmerName}
                onChange={(e) => update('farmerName', e.target.value)}
                placeholder="Buong pangalan"
                style={inputStyle}
              />
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(e) => update('contactNumber', e.target.value)}
                placeholder="Numero ng telepono (opsyonal)"
                style={{ ...inputStyle, marginTop: '12px' }}
              />
            </div>
          )}

          {/* Step 3 — Municipality */}
          {step === 3 && (
            <div>
              <h2 style={stepTitleStyle}>Nasaan ang iyong bukid?</h2>
              <p style={stepSubStyle}>Piliin ang iyong munisipalidad</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {MUNICIPALITIES.map((m) => (
                  <motion.button
                    key={m}
                    onClick={() => update('municipality', m)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    style={{
                      ...choiceBtn,
                      borderColor: form.municipality === m ? '#F4A300' : '#E0E0E0',
                      background: form.municipality === m ? 'rgba(244,163,0,0.1)' : 'white',
                      color: form.municipality === m ? '#2D5016' : '#666',
                    }}
                  >
                    {m}
                  </motion.button>
                ))}
              </div>
              {form.municipality && (
                <input
                  type="text"
                  value={form.barangay}
                  onChange={(e) => update('barangay', e.target.value)}
                  placeholder="Barangay"
                  style={{ ...inputStyle, marginTop: '16px' }}
                />
              )}
            </div>
          )}

          {/* Step 4 — GPS */}
          {step === 4 && (
            <div>
              <h2 style={stepTitleStyle}>Lokasyon ng Bukid</h2>
              <p style={stepSubStyle}>Opsyonal — para sa mas tumpak na datos</p>
              <motion.button
                onClick={() => {
                  navigator.geolocation?.getCurrentPosition(
                    (pos) => {
                      update('gpsLat', String(pos.coords.latitude))
                      update('gpsLng', String(pos.coords.longitude))
                    },
                    () => {}
                  )
                }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                style={{
                  width: '100%', background: '#2D5016', color: 'white',
                  border: 'none', padding: '14px', borderRadius: '14px',
                  fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', marginBottom: '16px',
                }}
              >
                📍 KUNIN ANG AKING LOKASYON
              </motion.button>
              {form.gpsLat && (
                <div style={{
                  background: 'rgba(107,154,76,0.1)', border: '1px solid #6b9a4c',
                  borderRadius: '10px', padding: '12px', textAlign: 'center',
                  color: '#2D5016', fontWeight: 600, fontSize: '0.875rem',
                }}>
                  ✅ LOKASYON NA-SAVE! — {parseFloat(form.gpsLat).toFixed(4)}, {parseFloat(form.gpsLng).toFixed(4)}
                </div>
              )}
            </div>
          )}

          {/* Step 5 — Crop */}
          {step === 5 && (
            <div>
              <h2 style={stepTitleStyle}>Anong pananim?</h2>
              <p style={stepSubStyle}>Piliin ang kategorya</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {Object.entries(CROPS).map(([key, { label, emoji }]) => (
                  <motion.button
                    key={key}
                    onClick={() => { update('cropCategory', key); update('cropName', '') }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    style={{
                      ...choiceBtn,
                      padding: '16px',
                      borderColor: form.cropCategory === key ? '#F4A300' : '#E0E0E0',
                      background: form.cropCategory === key ? 'rgba(244,163,0,0.1)' : 'white',
                      color: form.cropCategory === key ? '#2D5016' : '#666',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{emoji}</div>
                    <div style={{ fontSize: '0.8rem' }}>{label}</div>
                  </motion.button>
                ))}
              </div>

              {form.cropCategory && (
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2D5016', marginBottom: '8px' }}>Piliin ang pananim:</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {CROPS[form.cropCategory].crops.map((c) => (
                      <motion.button
                        key={c}
                        onClick={() => update('cropName', c)}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        transition={spring}
                        style={{
                          padding: '10px 12px', borderRadius: '10px',
                          border: `1.5px solid ${form.cropName === c ? '#F4A300' : '#E0E0E0'}`,
                          background: form.cropName === c ? 'rgba(244,163,0,0.1)' : 'white',
                          color: form.cropName === c ? '#2D5016' : '#666',
                          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                          transition: 'all 0.2s',
                        }}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </div>
                  {form.cropName === 'Other' && (
                    <input
                      type="text"
                      value={form.customCrop}
                      onChange={(e) => update('customCrop', e.target.value)}
                      placeholder="Isulat ang pananim"
                      style={{ ...inputStyle, marginTop: '12px' }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 6 — Planting date */}
          {step === 6 && (
            <div>
              <h2 style={stepTitleStyle}>Kailan magtatanim?</h2>
              <p style={stepSubStyle}>Petsa ng pagtatanim</p>
              <motion.button
                onClick={() => update('plantingDate', today())}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                style={{
                  width: '100%', background: 'rgba(107,154,76,0.15)', color: '#2D5016',
                  border: 'none', padding: '12px', borderRadius: '12px',
                  fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', marginBottom: '12px',
                }}
              >
                📅 Ngayon ({today()})
              </motion.button>
              <input type="date" value={form.plantingDate} onChange={(e) => update('plantingDate', e.target.value)} style={inputStyle} />
            </div>
          )}

          {/* Step 7 — Farm size */}
          {step === 7 && (
            <div>
              <h2 style={stepTitleStyle}>Laki ng Bukid</h2>
              <p style={stepSubStyle}>Opsyonal — maglagay ng isa</p>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Hectares</label>
                <input type="number" step="0.01" min="0" value={form.farmSizeHectares} onChange={(e) => update('farmSizeHectares', e.target.value)} placeholder="hal. 1.5" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Square Meters</label>
                <input type="number" min="0" value={form.farmSizeSqm} onChange={(e) => update('farmSizeSqm', e.target.value)} placeholder="hal. 5000" style={inputStyle} />
              </div>
            </div>
          )}

          {/* Step 8 — Harvest date */}
          {step === 8 && (
            <div>
              <h2 style={stepTitleStyle}>Inaasahang Ani</h2>
              <p style={stepSubStyle}>Kailan mo aanihin ang pananim?</p>
              <input type="date" value={form.harvestDate} onChange={(e) => update('harvestDate', e.target.value)} min={form.plantingDate || today()} style={inputStyle} />
            </div>
          )}

          {/* Step 9 — Issues */}
          {step === 9 && (
            <div>
              <h2 style={stepTitleStyle}>May mga Problema?</h2>
              <p style={stepSubStyle}>Opsyonal — piliin lahat ng naaangkop</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ISSUES.map(({ id, label }) => (
                  <motion.button
                    key={id}
                    onClick={() => toggleIssue(id)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    style={{
                      padding: '14px 16px', borderRadius: '12px',
                      border: `2px solid ${form.issues.includes(id) ? '#F4A300' : '#E0E0E0'}`,
                      background: form.issues.includes(id) ? 'rgba(244,163,0,0.1)' : 'white',
                      color: form.issues.includes(id) ? '#2D5016' : '#666',
                      cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                      textAlign: 'left', transition: 'all 0.2s',
                    }}
                  >
                    {form.issues.includes(id) ? '✓ ' : ''}{label}
                  </motion.button>
                ))}
              </div>
              {error && (
                <div style={{
                  marginTop: '16px', background: '#FFEBEE', border: '1px solid #FFCDD2',
                  color: '#C62828', padding: '12px 16px', borderRadius: '10px', fontSize: '0.875rem',
                }}>
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 10 — Success */}
          {step === 10 && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'successPop 0.6s ease' }}>🎉</div>
              <h2 style={{ fontFamily: 'Anton, sans-serif', fontWeight: 400, fontSize: '2.5rem', color: '#2D5016', marginBottom: '0.5rem' }}>
                Salamat!
              </h2>
              <p style={{ color: '#666', marginBottom: '2rem' }}>Natanggap na ang iyong submission.</p>

              <div style={{
                background: '#2D5016', color: 'white', borderRadius: '20px',
                padding: '1.5rem', marginBottom: '1.5rem',
              }}>
                <p style={{ fontSize: '0.75rem', color: '#a8c98a', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  REFERENCE NUMBER
                </p>
                <p style={{ fontFamily: 'Anton, sans-serif', fontWeight: 400, fontSize: '2rem', color: '#F4A300' }}>
                  {referenceNumber}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#a8c98a', marginTop: '12px' }}>
                  I-screenshot ito para sa iyong rekord
                </p>
              </div>

              <div style={{
                background: 'rgba(244,163,0,0.1)', border: '1px solid #F4A300',
                borderRadius: '12px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem',
              }}>
                <p style={{ fontWeight: 700, color: '#2D5016', fontSize: '0.9rem' }}>+10 Data Points nakuha! 🌟</p>
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                  Ang iyong puntos ay maidadagdag sa iyong leaderboard ranking.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <motion.button
                  onClick={resetForm}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  style={{
                    background: '#F4A300', color: '#2D5016', border: 'none',
                    padding: '14px', borderRadius: '12px', fontWeight: 800,
                    fontSize: '0.95rem', cursor: 'pointer',
                  }}
                >
                  Mag-submit Ulit
                </motion.button>
                <Link href="/leaderboard" style={{
                  display: 'block', background: '#2D5016', color: 'white',
                  padding: '14px', borderRadius: '12px', fontWeight: 700,
                  fontSize: '0.95rem', textDecoration: 'none', textAlign: 'center',
                }}>
                  🏆 Tingnan ang Leaderboard
                </Link>
                <Link href="/" style={{
                  display: 'block', background: 'white', color: '#2D5016',
                  border: '2px solid #2D5016', padding: '14px', borderRadius: '12px',
                  fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', textAlign: 'center',
                }}>
                  🏠 Umuwi
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        {step > 1 && step <= TOTAL_STEPS && (
          <div style={{
            padding: '16px 20px',
            background: 'white',
            borderTop: '1px solid #E7E4D5',
            display: 'flex',
            gap: '12px',
            position: 'sticky',
            bottom: 0,
          }}>
            <motion.button
              onClick={() => setStep((s) => s - 1)}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={spring}
              style={{
                flex: 1, padding: '14px', borderRadius: '12px',
                border: '2px solid #E0E0E0', background: 'white', color: '#666',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              ← Bumalik
            </motion.button>
            {step < TOTAL_STEPS ? (
              <motion.button
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 2 && !form.farmerName) ||
                  (step === 3 && (!form.municipality || !form.barangay)) ||
                  (step === 5 && (!form.cropCategory || !form.cropName || (form.cropName === 'Other' && !form.customCrop))) ||
                  (step === 6 && !form.plantingDate) ||
                  (step === 8 && !form.harvestDate)
                }
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={spring}
                style={{
                  flex: 2, padding: '14px', borderRadius: '12px',
                  background: '#F4A300', color: '#2D5016', border: 'none',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                }}
                className="next-btn"
              >
                Susunod →
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={submitting ? {} : { scale: 1.04, y: -2 }}
                whileTap={submitting ? {} : { scale: 0.97 }}
                transition={spring}
                style={{
                  flex: 2, padding: '14px', borderRadius: '12px',
                  background: '#2D5016', color: 'white', border: 'none',
                  fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer',
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? 'Isinusumite…' : 'I-SUBMIT ✓'}
              </motion.button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes successPop {
          0%{transform:scale(0.5);opacity:0}
          70%{transform:scale(1.1)}
          100%{transform:scale(1);opacity:1}
        }
        .next-btn:disabled { opacity: 0.4 !important; cursor: not-allowed !important; }
      `}</style>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 16px', borderRadius: '12px',
  border: '1.5px solid #E0E0E0', background: '#FAFAFA',
  fontSize: '1rem', color: '#2C2C2C', outline: 'none',
  fontFamily: 'inherit',
}

const choiceBtn: React.CSSProperties = {
  padding: '16px', borderRadius: '12px', border: '2px solid #E0E0E0',
  background: 'white', cursor: 'pointer', fontSize: '0.875rem',
  fontWeight: 600, transition: 'all 0.2s', fontFamily: 'inherit',
}

const stepTitleStyle: React.CSSProperties = {
  fontFamily: 'Anton, sans-serif', fontWeight: 400,
  fontSize: '1.5rem', color: '#2D5016', marginBottom: '4px',
}

const stepSubStyle: React.CSSProperties = {
  fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 700,
  color: '#2D5016', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.3px',
}
