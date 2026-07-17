import { db } from '@/lib/db'
import { auth, signOut } from '@/auth'
import CropChart from '@/components/dashboard/CropChart'
import StatsCard from '@/components/dashboard/StatsCard'
import AlertSection from '@/components/dashboard/AlertSection'
import BarangayMap from '@/components/dashboard/BarangayMap'
import WeeklyChart from '@/components/dashboard/WeeklyChart'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalFarmers,
    totalSubmissions,
    cropBreakdown,
    recentSubmissions,
    hectaresAggregate,
    barangayBreakdown,
    weeklySubmissions,
  ] = await Promise.all([
    db.farmer.count(),
    db.submission.count(),
    db.submission.groupBy({
      by: ['cropName'],
      _count: { cropName: true },
      orderBy: { _count: { cropName: 'desc' } },
      take: 8,
    }),
    db.submission.findMany({
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: { farmer: { select: { fullName: true, municipality: true } } },
    }),
    db.submission.aggregate({ _sum: { farmSizeHectares: true } }),
    db.farmer.groupBy({
      by: ['barangay'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 12,
    }),
    db.submission.findMany({
      where: { submittedAt: { gte: sevenDaysAgo } },
      select: { submittedAt: true },
      orderBy: { submittedAt: 'asc' },
    }),
  ])

  const totalPoints = totalSubmissions * 10
  const totalHectares = Number(hectaresAggregate._sum.farmSizeHectares ?? 0)

  // Build weekly chart data (last 7 days)
  const days: string[] = []
  const dayCounts: number[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    days.push(label)
    const count = weeklySubmissions.filter((s) => {
      const sd = new Date(s.submittedAt)
      return sd.getFullYear() === d.getFullYear() &&
        sd.getMonth() === d.getMonth() &&
        sd.getDate() === d.getDate()
    }).length
    dayCounts.push(count)
  }

  return {
    totalFarmers,
    totalSubmissions,
    totalPoints,
    totalHectares,
    cropBreakdown,
    recentSubmissions,
    barangayBreakdown,
    weeklyLabels: days,
    weeklyValues: dayCounts,
  }
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData()

  return (
    <main style={{ background: '#FAF6F0', minHeight: '100vh', paddingTop: '80px' }}>
      {/* Dashboard Header */}
      <div style={{
        background: 'linear-gradient(135deg, #2D5016 0%, #4A7C2C 100%)',
        color: 'white',
        padding: '30px 5%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}>
          <div>
            <h1 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '2rem', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              🌾 AgriPulse System
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
              BLISTT Area • Real-Time Crop Monitoring
              {session?.user?.email && <span style={{ marginLeft: '1rem', opacity: 0.7 }}>— {session.user.email}</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{
              padding: '10px 20px', background: '#F4A300', color: '#2D5016',
              borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem',
              textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
            }}>
              🏠 Home
            </Link>
            <Link href="/mobile-wizard" style={{
              padding: '10px 20px', background: 'transparent', color: 'white',
              border: '2px solid white', borderRadius: '8px', fontWeight: 700,
              fontSize: '0.875rem', textDecoration: 'none', textTransform: 'uppercase',
            }}>
              📝 Farmer Form
            </Link>
            <form action={async () => {
              'use server'
              await signOut({ redirectTo: '/auth/login' })
            }}>
              <button type="submit" style={{
                padding: '10px 20px', background: 'transparent', color: 'white',
                border: '2px solid rgba(255,255,255,0.5)', borderRadius: '8px',
                fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', textTransform: 'uppercase',
              }}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 5%' }}>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}>
          <StatsCard label="Active Farmers" value={data.totalFarmers} icon="👨‍🌾" />
          <StatsCard label="Hectares Tracked" value={`${data.totalHectares.toFixed(1)}`} icon="🌾" />
          <StatsCard label="Crop Varieties" value={data.cropBreakdown.length} icon="🥬" highlight />
          <StatsCard label="Total Points Earned" value={data.totalPoints} icon="🏆" />
        </div>

        {/* Alerts */}
        <AlertSection cropBreakdown={data.cropBreakdown} totalSubmissions={data.totalSubmissions} />

        {/* Charts 2×2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          marginBottom: '30px',
        }} className="charts-grid">
          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '3px solid #A8C686' }}>
            <h2 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1.2rem', color: '#3E2723', marginBottom: '5px' }}>Crop Distribution</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>Submissions by crop type</p>
            <CropChart
              labels={data.cropBreakdown.map((c) => c.cropName)}
              values={data.cropBreakdown.map((c) => c._count.cropName)}
              type="doughnut"
            />
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '3px solid #A8C686' }}>
            <h2 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1.2rem', color: '#3E2723', marginBottom: '5px' }}>Weekly Submissions</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>Last 7 days activity</p>
            <WeeklyChart labels={data.weeklyLabels} values={data.weeklyValues} />
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '3px solid #A8C686' }}>
            <h2 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1.2rem', color: '#3E2723', marginBottom: '5px' }}>Crop Volume</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>Submission count per crop</p>
            <CropChart
              labels={data.cropBreakdown.map((c) => c.cropName)}
              values={data.cropBreakdown.map((c) => c._count.cropName)}
              type="bar"
            />
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '3px solid #A8C686' }}>
            <h2 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1.2rem', color: '#3E2723', marginBottom: '5px' }}>Recent Submissions</h2>
            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '20px' }}>Latest 5 farmer entries</p>
            {data.recentSubmissions.length === 0 ? (
              <p style={{ color: '#666', fontSize: '0.875rem' }}>No submissions yet.</p>
            ) : (
              <div>
                {data.recentSubmissions.map((s) => (
                  <div key={s.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid #E0E0E0',
                  }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#2D5016', fontSize: '0.9rem' }}>{s.farmer.fullName}</p>
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>{s.cropName} · {s.farmer.municipality}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, color: '#F4A300', fontSize: '0.9rem' }}>+{s.pointsEarned} pts</p>
                      <p style={{ fontSize: '0.75rem', color: '#666' }}>{s.referenceNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Barangay Map */}
        <BarangayMap barangays={data.barangayBreakdown} />

        {/* Data Intelligence Table */}
        <div style={{ background: 'white', padding: '30px', borderRadius: '16px', border: '3px solid #A8C686', overflowX: 'auto' }}>
          <h2 style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: '1.5rem', color: '#3E2723', marginBottom: '20px' }}>
            📋 Data Intelligence Summary
          </h2>
          {data.cropBreakdown.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.95rem' }}>No data yet — submissions will appear here.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Crop', 'Submissions', 'Share', 'Status'].map((h) => (
                    <th key={h} style={{
                      background: '#2D5016', color: 'white', padding: '15px',
                      textAlign: 'left', fontWeight: 700, fontSize: '0.875rem',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.cropBreakdown.map((c) => {
                  const total = data.totalSubmissions || 1
                  const pct = Math.round((c._count.cropName / total) * 100)
                  const { label, bg, color } = pct > 40
                    ? { label: 'OVERSUPPLY RISK', bg: '#FFEBEE', color: '#D32F2F' }
                    : pct > 20
                    ? { label: 'MONITOR', bg: '#FFF3E0', color: '#FF6F00' }
                    : { label: 'OPPORTUNITY', bg: '#E8F5E9', color: '#2E7D32' }
                  return (
                    <tr key={c.cropName} style={{ borderBottom: '1px solid #E0E0E0' }}>
                      <td style={{ padding: '15px', fontWeight: 600, color: '#2D5016' }}>{c.cropName}</td>
                      <td style={{ padding: '15px', color: '#666' }}>{c._count.cropName}</td>
                      <td style={{ padding: '15px', color: '#666' }}>{pct}%</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          display: 'inline-block', padding: '5px 12px',
                          borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                          background: bg, color,
                        }}>
                          {label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '30px', color: '#7c8a70', fontSize: '0.85rem' }}>
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>

      <style>{`
        @media (max-width: 968px) {
          .charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
