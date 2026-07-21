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
    <main
      className="min-h-screen pt-20 pb-12"
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(93,158,135,0.12) 0%, transparent 50%), linear-gradient(160deg, #1a2e10 0%, #0c150a 100%)',
      }}
    >
      <div className="max-w-[820px] mx-auto px-5">

        {/* Header */}
        <div className="text-center py-12">
          <div aria-hidden="true" className="text-[5rem] mb-4 leading-none inline-block">🌾</div>
          <h1
            className="font-heading mb-3"
            style={{
              fontSize: 'clamp(2rem, 5vw, 2.8rem)',
              color: 'var(--color-accent-gold)',
              letterSpacing: '-0.02em',
            }}
          >
            AgriPulse Leaderboard
          </h1>
          <p className="text-[1.05rem] mb-5" style={{ color: '#dfe6d4' }}>
            Top Contributing Farmers — BLISTT Area
          </p>
          <span
            className="inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full"
            style={{
              background: 'rgba(93,158,135,0.14)',
              border: '1px solid rgba(93,158,135,0.28)',
              color: 'var(--accent-turquoise-light)',
            }}
          >
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ background: 'var(--accent-turquoise)', animation: 'blink 1.5s infinite' }}
            />
            Live Data
          </span>
        </div>

        {/* Stat grid */}
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-8">
          {[
            { label: 'Farmers', value: totals.farmers },
            { label: 'Submissions', value: totals.submissions },
            { label: 'Ha Tracked', value: totals.hectares.toFixed(1) },
            { label: 'Points Earned', value: totals.points },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="surface-glass text-center p-5 rounded-2xl"
              style={{ border: '1px solid rgba(93,158,135,0.22)' }}
            >
              <div
                data-nums
                className="font-heading"
                style={{
                  fontSize: '2.2rem',
                  color: 'var(--color-accent-gold)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                {value}
              </div>
              <div className="text-[0.85rem] mt-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Rankings panel */}
        <div
          className="surface-glass rounded-3xl p-6 mb-8"
          style={{ border: '1px solid rgba(93,158,135,0.18)' }}
        >
          <h2
            className="font-heading text-[1.5rem] mb-5 flex items-center gap-3"
            style={{ color: 'white', letterSpacing: '-0.01em' }}
          >
            <span aria-hidden="true">🏆</span>
            Top 10 Contributors
          </h2>

          {rankings.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <p className="text-5xl mb-4">🌱</p>
              <p>Walang datos pa. Mag-submit sa Farmer Portal!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {rankings.map((r) => (
                <div
                  key={r.rank}
                  className="ranking-row flex items-center gap-4 rounded-2xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    transition: `all var(--dur-base) var(--ease-out-quart)`,
                  }}
                >
                  {/* Rank / Medal */}
                  <div
                    className="w-11 text-center font-heading text-[1.35rem] shrink-0"
                    style={{
                      color:
                        r.rank === 1
                          ? '#FFD700'
                          : r.rank === 2
                          ? '#C0C0C0'
                          : r.rank === 3
                          ? '#CD7F32'
                          : 'rgba(255,255,255,0.45)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {medal(r.rank) ?? `#${r.rank}`}
                  </div>

                  {/* Farmer info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-white text-[0.97rem] truncate">{r.name}</div>
                    <div
                      className="text-[0.8rem] mt-0.5 flex gap-3 flex-wrap"
                      style={{ color: 'rgba(255,255,255,0.50)' }}
                    >
                      <span>📍 {r.municipality}</span>
                      <span>🌾 {r.cropName}</span>
                      {r.hectares && <span>📏 {r.hectares}ha</span>}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right shrink-0">
                    <div
                      data-nums
                      className="font-heading"
                      style={{
                        fontSize: '1.75rem',
                        color: 'var(--color-accent-gold)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                      }}
                    >
                      {r.points}
                    </div>
                    <div className="text-[0.68rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>
                      POINTS
                    </div>
                    <div className="text-[0.78rem] mt-1" style={{ color: 'rgba(255,255,255,0.50)' }}>
                      {r.submissions} sub{r.submissions !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center mb-8">
          <Link href="/mobile-wizard" className="btn btn-primary btn-sm">
            Farmer Portal →
          </Link>
          <Link href="/" className="btn btn-on-dark btn-sm">
            Home
          </Link>
        </div>

        <footer
          className="text-center text-[0.8rem] pb-4"
          style={{
            color: 'rgba(255,255,255,0.30)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            paddingTop: '24px',
          }}
        >
          <p>
            <strong style={{ color: 'rgba(255,255,255,0.50)' }}>AgriPulse System</strong> — The Pulse of
            Predictive Farming
          </p>
          <p className="mt-2">
            © 2026 DisenyoDigitals | In collaboration with The Locale Farm &amp; Session Groceries
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .ranking-row:hover {
          background: rgba(93,158,135,0.12) !important;
          border-color: rgba(93,158,135,0.30) !important;
          transform: translateX(4px);
        }
      `}</style>
    </main>
  )
}
