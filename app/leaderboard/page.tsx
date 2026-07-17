import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getLeaderboard() {
  const rankings = await db.submission.groupBy({
    by: ['farmerId'],
    _sum: { pointsEarned: true },
    _count: { farmerId: true },
    orderBy: { _sum: { pointsEarned: 'desc' } },
    take: 10,
  })

  const farmerIds = rankings.map((r) => r.farmerId)
  const farmers = await db.farmer.findMany({
    where: { id: { in: farmerIds } },
    include: {
      submissions: {
        select: { cropName: true, farmSizeHectares: true },
        orderBy: { submittedAt: 'desc' },
        take: 1,
      },
    },
  })

  const farmerMap = new Map(farmers.map((f) => [f.id, f]))

  return rankings.map((r, i) => {
    const farmer = farmerMap.get(r.farmerId)
    const latest = farmer?.submissions[0]
    return {
      rank: i + 1,
      name: farmer?.fullName ?? 'Unknown',
      municipality: farmer?.municipality ?? '',
      cropName: latest?.cropName ?? '—',
      hectares: latest?.farmSizeHectares ? Number(latest.farmSizeHectares) : null,
      points: r._sum.pointsEarned ?? 0,
      submissions: r._count.farmerId,
    }
  })
}

async function getTotals() {
  const [farmers, submissions, hectaresAggregate] = await Promise.all([
    db.farmer.count(),
    db.submission.count(),
    db.submission.aggregate({ _sum: { farmSizeHectares: true } }),
  ])
  const hectares = Number(hectaresAggregate._sum.farmSizeHectares ?? 0)
  return { farmers, submissions, points: submissions * 10, hectares }
}

function medal(rank: number) {
  if (rank === 1) return '🥇'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return null
}

export default async function LeaderboardPage() {
  const [rankings, totals] = await Promise.all([getLeaderboard(), getTotals()])

  return (
    <main style={{
      background: 'linear-gradient(135deg, #2D5016 0%, #1a3010 100%)',
      color: 'white',
      minHeight: '100vh',
      paddingTop: '80px',
      paddingBottom: '40px',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeIn 0.6s ease' }}>
          <div style={{ fontSize: '60px', marginBottom: '10px', animation: 'pulse 2s infinite' }}>🌾</div>
          <h1 style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: '42px',
            color: '#F4A300',
            marginBottom: '10px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}>
            AgriPulse Leaderboard
          </h1>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: '20px' }}>
            Top Contributing Farmers — BLISTT Area
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(46,125,50,0.3)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            marginBottom: '10px',
          }}>
            <span style={{
              width: '10px', height: '10px',
              background: '#4CAF50', borderRadius: '50%',
              animation: 'blink 1.5s infinite',
              display: 'inline-block',
            }} />
            Live Data
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          {[
            { label: 'Farmers', value: totals.farmers },
            { label: 'Submissions', value: totals.submissions },
            { label: 'Ha Tracked', value: totals.hectares.toFixed(1) },
            { label: 'Points Earned', value: totals.points },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(244,163,0,0.3)',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: '#F4A300', marginBottom: '5px' }}>
                {value}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Rankings */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '20px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(244,163,0,0.2)',
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 800,
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}>
            <span style={{ fontSize: '32px' }}>🏆</span>
            Top 10 Contributors
          </h2>

          {rankings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', opacity: 0.7 }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</p>
              <p>Walang datos pa. Mag-submit sa Farmer Portal!</p>
            </div>
          ) : (
            rankings.map((r, idx) => (
              <div
                key={r.rank}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '15px',
                  marginBottom: '15px',
                  border: '2px solid transparent',
                  transition: 'all 0.3s ease',
                  animationDelay: `${idx * 0.1}s`,
                }}
                className="farmer-row"
              >
                <div style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  width: '50px',
                  textAlign: 'center',
                  color: r.rank === 1 ? '#FFD700' : r.rank === 2 ? '#C0C0C0' : r.rank === 3 ? '#CD7F32' : 'white',
                }}>
                  {medal(r.rank) ? (
                    <span style={{ fontSize: '32px' }}>{medal(r.rank)}</span>
                  ) : (
                    `#${r.rank}`
                  )}
                </div>

                <div style={{ flex: 1, marginLeft: '15px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '5px' }}>{r.name}</div>
                  <div style={{ fontSize: '14px', opacity: 0.7, display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <span>📍 {r.municipality}</span>
                    <span>🌾 {r.cropName}</span>
                    {r.hectares && <span>📏 {r.hectares}ha</span>}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#F4A300' }}>{r.points}</div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>POINTS</div>
                  <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '5px' }}>
                    {r.submissions} submission{r.submissions !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.2)', opacity: 0.7, fontSize: '14px' }}>
          <p><strong>AgriPulse System</strong> — The Pulse of Predictive Farming</p>
          <p style={{ marginTop: '10px' }}>© 2026 DisenyoDigitals | In collaboration with The Locale Farm & Session Groceries</p>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .farmer-row:hover {
          background: rgba(244,163,0,0.2) !important;
          border-color: #F4A300 !important;
          transform: translateX(5px);
        }
      `}</style>
    </main>
  )
}
