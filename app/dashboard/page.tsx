import { auth } from '@/auth'
import { db } from '@/lib/db'
import Link from 'next/link'
import CropChart from '@/components/dashboard/CropChart'
import StatsCard from '@/components/dashboard/StatsCard'
import AlertSection from '@/components/dashboard/AlertSection'
import BarangayMap from '@/components/dashboard/BarangayMap'
import WeeklyChart from '@/components/dashboard/WeeklyChart'
import {
  getFarmerCount,
  getBarangayBreakdown,
} from '@/lib/repositories/farmer.repository'
import {
  getSubmissionCount,
  getCropBreakdown,
  getTotalHectares,
  getTotalPoints,
  getWeeklySubmissions,
  getHarvestSubmissions,
  buildWeeklyChartData,
  buildHarvestTimeline,
} from '@/lib/repositories/submission.repository'

export const dynamic = 'force-dynamic'

const EMPTY_DASHBOARD = {
  totalFarmers: 0,
  totalSubmissions: 0,
  totalPoints: 0,
  totalHectares: 0,
  pendingFarmers: 0,
  pendingSubmissions: 0,
  cropBreakdown: [] as Awaited<ReturnType<typeof getCropBreakdown>>,
  barangayBreakdown: [] as Awaited<ReturnType<typeof getBarangayBreakdown>>,
  weeklyLabels: [] as string[],
  weeklyValues: [] as number[],
  harvestTimelineLabels: [] as string[],
  harvestTimelineValues: [] as number[],
}

async function getDashboardData() {
  try {
    const [
      totalFarmers,
      totalSubmissions,
      totalPoints,
      cropBreakdown,
      totalHectares,
      barangayBreakdown,
      weeklySubmissions,
      harvestSubmissions,
      pendingFarmers,
      pendingSubmissions,
    ] = await Promise.all([
      getFarmerCount(),
      getSubmissionCount(),
      getTotalPoints(),
      getCropBreakdown(),
      getTotalHectares(),
      getBarangayBreakdown(),
      getWeeklySubmissions(),
      getHarvestSubmissions(),
      db.farmer.count({ where: { status: 'PENDING' } }),
      db.submission.count({ where: { status: 'PENDING' } }),
    ])

    const { labels: weeklyLabels, values: weeklyValues } =
      buildWeeklyChartData(weeklySubmissions)
    const { labels: harvestTimelineLabels, values: harvestTimelineValues } =
      buildHarvestTimeline(harvestSubmissions)

    return {
      totalFarmers,
      totalSubmissions,
      totalPoints,
      totalHectares,
      cropBreakdown,
      barangayBreakdown,
      weeklyLabels,
      weeklyValues,
      harvestTimelineLabels,
      harvestTimelineValues,
      pendingFarmers,
      pendingSubmissions,
    }
  } catch (error) {
    console.error('Dashboard data fetch failed:', error)
    return EMPTY_DASHBOARD
  }
}

const STATUS_CLASSES = {
  high: { label: 'High Risk', dot: '#D32F2F', text: 'text-warning-red' },
  monitor: { label: 'Monitor', dot: '#FF6F00', text: 'text-warning-orange' },
  opportunity: { label: 'Opportunity', dot: '#2E7D32', text: 'text-success-green' },
} as const

function getStatus(pct: number) {
  if (pct > 40) return STATUS_CLASSES.high
  if (pct > 20) return STATUS_CLASSES.monitor
  return STATUS_CLASSES.opportunity
}

export default async function DashboardPage() {
  const session = await auth()
  const data = await getDashboardData()

  return (
    <main className="bg-[#FAF6F0] min-h-screen">
      {/* Dashboard Header */}
      <div
        className="text-white px-[5%] py-8 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 50% 120% at 88% 0%, rgba(93,158,135,0.28) 0%, transparent 60%), linear-gradient(135deg, #2D5016 0%, #38541F 60%, #234011 100%)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h1 className="font-heading text-[1.8rem] flex items-center gap-3" style={{ letterSpacing: '-0.01em' }}>
            <span aria-hidden="true">🌾</span>
            Agri<span style={{ color: 'var(--accent-turquoise-light)' }}>Pulse</span>
          </h1>
          <p className="opacity-85 text-[0.9rem] mt-1">
            BLISTT Area · Real-Time Crop Monitoring
            {session?.user?.email && (
              <span className="ml-3 opacity-70">— {session.user.email}</span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-8">
        {/* Pending actions banner */}
        {(data.pendingFarmers > 0 || data.pendingSubmissions > 0) && (
          <div
            className="rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
            style={{ background: '#FDF3E7', border: '1px solid rgba(193,90,0,0.22)' }}
          >
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="text-xl">⏳</span>
              <span className="font-bold text-[#C15A00]">Needs your attention</span>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:ml-auto">
              {data.pendingFarmers > 0 && (
                <Link
                  href="/dashboard/farmers?filter=pending"
                  className="btn btn-sm"
                  style={{ background: '#fff', color: '#C15A00', border: '1px solid rgba(193,90,0,0.3)' }}
                >
                  {data.pendingFarmers} farmer{data.pendingFarmers !== 1 ? 's' : ''} to review →
                </Link>
              )}
              {data.pendingSubmissions > 0 && (
                <Link
                  href="/dashboard/farmers"
                  className="btn btn-sm"
                  style={{ background: '#fff', color: '#C15A00', border: '1px solid rgba(193,90,0,0.3)' }}
                >
                  {data.pendingSubmissions} submission{data.pendingSubmissions !== 1 ? 's' : ''} pending →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* KPI Cards — 2×2 on mobile, 4-across on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
          <StatsCard label="Active Farmers" value={data.totalFarmers} icon="👨‍🌾" />
          <StatsCard label="Hectares Tracked" value={`${data.totalHectares.toFixed(1)}`} icon="🌾" />
          <StatsCard label="Crop Varieties" value={data.cropBreakdown.length} icon="🥬" highlight />
          <StatsCard label="Total Points Earned" value={data.totalPoints} icon="🏆" />
        </div>

        {/* Alerts */}
        <AlertSection cropBreakdown={data.cropBreakdown} totalSubmissions={data.totalSubmissions} />

        {/* Charts — 1 column on mobile, 2 on tablet+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card p-7">
            <h2 className="font-heading text-[1.15rem] text-[#243016]" style={{ letterSpacing: '-0.01em' }}>Crop Distribution</h2>
            <p className="text-[0.85rem] text-[#6b7360] mt-0.5 mb-5">Current planting breakdown by crop type</p>
            <CropChart
              labels={data.cropBreakdown.map((c) => c.cropName)}
              values={data.cropBreakdown.map((c) => c._count.cropName)}
              type="doughnut"
            />
          </div>

          <div className="card p-7">
            <h2 className="font-heading text-[1.15rem] text-[#243016]" style={{ letterSpacing: '-0.01em' }}>Harvest Timeline</h2>
            <p className="text-[0.85rem] text-[#6b7360] mt-0.5 mb-5">Projected harvest area (ha) by month</p>
            <CropChart
              labels={data.harvestTimelineLabels}
              values={data.harvestTimelineValues}
              type="bar"
              barColor="#2D5016"
            />
          </div>

          <div className="card p-7">
            <h2 className="font-heading text-[1.15rem] text-[#243016]" style={{ letterSpacing: '-0.01em' }}>Barangay Participation</h2>
            <p className="text-[0.85rem] text-[#6b7360] mt-0.5 mb-5">Active farmers by barangay</p>
            <CropChart
              labels={data.barangayBreakdown.map((b) => b.barangay || 'Unknown')}
              values={data.barangayBreakdown.map((b) => b._count.id)}
              type="bar"
              horizontal
              barColor="#5d9e87"
            />
          </div>

          <div className="card p-7">
            <h2 className="font-heading text-[1.15rem] text-[#243016]" style={{ letterSpacing: '-0.01em' }}>Weekly Submissions</h2>
            <p className="text-[0.85rem] text-[#6b7360] mt-0.5 mb-5">Data submission trends</p>
            <WeeklyChart labels={data.weeklyLabels} values={data.weeklyValues} />
          </div>
        </div>

        {/* Barangay Map */}
        <BarangayMap barangays={data.barangayBreakdown} />

        {/* Data Intelligence Table */}
        <div className="card p-7 overflow-x-auto">
          <h2 className="font-heading text-[1.3rem] text-[#243016] mb-5" style={{ letterSpacing: '-0.01em' }}>
            Data Intelligence Summary
          </h2>
          {data.cropBreakdown.length === 0 ? (
            <p className="text-[#6b7360] text-[0.95rem]">No data yet — submissions will appear here.</p>
          ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {data.cropBreakdown.map((c) => {
                const total = data.totalSubmissions || 1
                const pct = Math.round((c._count.cropName / total) * 100)
                const hectares = Number(c._sum.farmSizeHectares ?? 0)
                const status = getStatus(pct)
                return (
                  <div key={c.cropName} className="card p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-primary-green">{c.cropName}</span>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status.text}`}>
                        <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: status.dot }} />
                        {status.label}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-2 text-[0.82rem] text-[#5a5f52]">
                      <span data-nums>{c._count.cropName} subs</span>
                      <span data-nums>{hectares > 0 ? `${hectares.toFixed(1)} ha` : '— ha'}</span>
                      <span data-nums>{pct}% share</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tablet+: table */}
            <table className="w-full border-collapse text-sm hidden md:table">
              <thead>
                <tr>
                  {['Crop Type', 'Submissions', 'Hectares', 'Next Harvest', 'Saturation', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="text-[#6b7360] pb-3 px-3 text-left font-bold text-xs uppercase tracking-wider border-b-2 border-[#e6e2d6]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.cropBreakdown.map((c) => {
                  const total = data.totalSubmissions || 1
                  const pct = Math.round((c._count.cropName / total) * 100)
                  const hectares = Number(c._sum.farmSizeHectares ?? 0)
                  const nextHarvest = c._max.harvestDate
                    ? new Date(c._max.harvestDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'
                  const status = getStatus(pct)
                  return (
                    <tr key={c.cropName} className="border-b border-[#eeeae0] hover:bg-[#faf8f2] transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-primary-green">{c.cropName}</td>
                      <td className="py-3.5 px-3 text-[#5a5f52]" data-nums>{c._count.cropName}</td>
                      <td className="py-3.5 px-3 text-[#5a5f52]" data-nums>{hectares > 0 ? `${hectares.toFixed(1)} ha` : '—'}</td>
                      <td className="py-3.5 px-3 text-[#5a5f52]">{nextHarvest}</td>
                      <td className="py-3.5 px-3 text-[#5a5f52]" data-nums>{pct}%</td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-2 font-semibold ${status.text}`}>
                          <span aria-hidden="true" className="w-2 h-2 rounded-full" style={{ background: status.dot }} />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
          )}
        </div>
      </div>

      <footer className="text-center py-8 text-[#8a917e] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
