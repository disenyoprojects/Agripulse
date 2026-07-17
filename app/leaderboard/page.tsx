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
  const [farmers, submissions] = await Promise.all([
    db.farmer.count(),
    db.submission.count(),
  ])
  return { farmers, submissions, points: submissions * 10 }
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
    <main className="min-h-screen bg-[#2D5016] text-white">
      <header className="bg-[#25361a] px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[#a8c98a] text-xs font-semibold tracking-widest">AGRIPULSE</p>
          <p className="text-white text-sm">Leaderboard</p>
        </div>
        <nav className="flex gap-4 text-xs text-[#a8c98a]">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/mobile-wizard" className="hover:text-white">Portal</Link>
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="font-heading text-3xl text-[#F4A300] mb-2">AgriPulse Leaderboard</h1>
          <p className="text-[#a8c98a] text-sm">Top Contributing Farmers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Farmers', value: totals.farmers },
            { label: 'Submissions', value: totals.submissions },
            { label: 'Points Earned', value: totals.points },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm border border-[#F4A300]/20">
              <p className="text-2xl font-bold text-[#F4A300]">{value}</p>
              <p className="text-xs text-[#a8c98a] mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Rankings */}
        <div className="space-y-3">
          {rankings.length === 0 ? (
            <div className="text-center py-12 text-[#a8c98a]">
              <p className="text-4xl mb-3">🌱</p>
              <p>Walang datos pa. Mag-submit sa Farmer Portal!</p>
            </div>
          ) : (
            rankings.map((r) => (
              <div
                key={r.rank}
                className="flex items-center gap-4 bg-white/10 rounded-xl p-4 border border-transparent hover:border-[#F4A300] transition-all"
              >
                <div className="w-10 text-center">
                  {medal(r.rank) ? (
                    <span className="text-2xl">{medal(r.rank)}</span>
                  ) : (
                    <span className="text-lg font-bold text-[#a8c98a]">#{r.rank}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{r.name}</p>
                  <p className="text-xs text-[#a8c98a]">
                    📍 {r.municipality} · 🌾 {r.cropName}
                    {r.hectares ? ` · ${r.hectares}ha` : ''}
                  </p>
                  <p className="text-xs text-[#a8c98a] mt-0.5">{r.submissions} submission{r.submissions !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#F4A300]">{r.points}</p>
                  <p className="text-xs text-[#a8c98a]">POINTS</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-[#a8c98a]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
