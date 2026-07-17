import { db } from '@/lib/db'
import { auth } from '@/auth'
import { signOut } from '@/auth'

export const dynamic = 'force-dynamic'
import CropChart from '@/components/dashboard/CropChart'
import StatsCard from '@/components/dashboard/StatsCard'

async function getDashboardData() {
  const [totalFarmers, totalSubmissions, cropBreakdown, municipalityBreakdown, recentSubmissions] =
    await Promise.all([
      db.farmer.count(),
      db.submission.count(),
      db.submission.groupBy({
        by: ['cropName'],
        _count: { cropName: true },
        orderBy: { _count: { cropName: 'desc' } },
        take: 8,
      }),
      db.submission.groupBy({
        by: ['farmerId'],
        _count: { farmerId: true },
      }),
      db.submission.findMany({
        take: 5,
        orderBy: { submittedAt: 'desc' },
        include: { farmer: { select: { fullName: true, municipality: true } } },
      }),
    ])

  const totalPoints = totalSubmissions * 10

  return { totalFarmers, totalSubmissions, totalPoints, cropBreakdown, municipalityBreakdown, recentSubmissions }
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData()

  return (
    <main className="min-h-screen bg-cream">
      {/* Nav */}
      <header className="bg-green-900 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-green-300 text-xs font-semibold tracking-widest">AGRIPULSE</p>
          <p className="text-white text-sm">LGU Agricultural Intelligence Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-300 text-xs hidden sm:block">{session?.user?.email}</span>
          <form
            action={async () => {
              'use server'
              await signOut({ redirectTo: '/auth/login' })
            }}
          >
            <button type="submit" className="text-xs text-accent-gold hover:underline">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl text-primary-green mb-6">
          Agricultural Intelligence — BLISTT
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Active Farmers" value={data.totalFarmers} />
          <StatsCard label="Total Submissions" value={data.totalSubmissions} />
          <StatsCard label="Points Earned" value={data.totalPoints} highlight />
          <StatsCard label="Crop Varieties" value={data.cropBreakdown.length} />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e4d5]">
            <h2 className="font-semibold text-primary-green mb-4">Crop Distribution</h2>
            <CropChart
              labels={data.cropBreakdown.map((c) => c.cropName)}
              values={data.cropBreakdown.map((c) => c._count.cropName)}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e4d5]">
            <h2 className="font-semibold text-primary-green mb-4">Recent Submissions</h2>
            {data.recentSubmissions.length === 0 ? (
              <p className="text-sm text-[#6b7a5f]">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {data.recentSubmissions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-2 border-b border-[#f0ede0] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-primary-green">{s.farmer.fullName}</p>
                      <p className="text-xs text-[#6b7a5f]">{s.cropName} · {s.farmer.municipality}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-accent-gold">+{s.pointsEarned} pts</p>
                      <p className="text-xs text-[#6b7a5f]">{s.referenceNumber}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Saturation alerts */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e4d5]">
          <h2 className="font-semibold text-primary-green mb-4">Crop Intelligence Summary</h2>
          {data.cropBreakdown.length === 0 ? (
            <p className="text-sm text-[#6b7a5f]">No data yet — submissions will appear here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-semibold text-[#6b7a5f] border-b border-[#e7e4d5]">
                    <th className="pb-2 pr-4">Crop</th>
                    <th className="pb-2 pr-4">Submissions</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.cropBreakdown.map((c, i) => {
                    const total = data.totalSubmissions || 1
                    const pct = Math.round((c._count.cropName / total) * 100)
                    const status = pct > 40 ? '🔴 Oversupply Risk' : pct > 20 ? '🟡 Monitor' : '🟢 Opportunity'
                    return (
                      <tr key={c.cropName} className="border-b border-[#f0ede0] last:border-0">
                        <td className="py-3 pr-4 font-medium text-primary-green">{c.cropName}</td>
                        <td className="py-3 pr-4 text-[#6b7a5f]">{c._count.cropName} ({pct}%)</td>
                        <td className="py-3 text-xs">{status}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer className="text-center py-6 text-xs text-[#7c8a70]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
