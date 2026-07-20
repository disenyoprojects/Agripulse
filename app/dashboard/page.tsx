import { auth, signOut } from '@/auth'
import CropChart from '@/components/dashboard/CropChart'
import StatsCard from '@/components/dashboard/StatsCard'
import AlertSection from '@/components/dashboard/AlertSection'
import BarangayMap from '@/components/dashboard/BarangayMap'
import WeeklyChart from '@/components/dashboard/WeeklyChart'
import Link from 'next/link'
import {
  getFarmerCount,
  getBarangayBreakdown,
} from '@/lib/repositories/farmer.repository'
import {
  getSubmissionCount,
  getCropBreakdown,
  getTotalHectares,
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
      cropBreakdown,
      totalHectares,
      barangayBreakdown,
      weeklySubmissions,
      harvestSubmissions,
    ] = await Promise.all([
      getFarmerCount(),
      getSubmissionCount(),
      getCropBreakdown(),
      getTotalHectares(),
      getBarangayBreakdown(),
      getWeeklySubmissions(),
      getHarvestSubmissions(),
    ])

    const { labels: weeklyLabels, values: weeklyValues } =
      buildWeeklyChartData(weeklySubmissions)
    const { labels: harvestTimelineLabels, values: harvestTimelineValues } =
      buildHarvestTimeline(harvestSubmissions)

    return {
      totalFarmers,
      totalSubmissions,
      totalPoints: totalSubmissions * 10,
      totalHectares,
      cropBreakdown,
      barangayBreakdown,
      weeklyLabels,
      weeklyValues,
      harvestTimelineLabels,
      harvestTimelineValues,
    }
  } catch (error) {
    console.error('Dashboard data fetch failed:', error)
    return EMPTY_DASHBOARD
  }
}

const STATUS_CLASSES = {
  high: { label: 'HIGH RISK', badge: 'bg-[#FFEBEE] text-warning-red' },
  monitor: { label: 'MONITOR', badge: 'bg-[#FFF3E0] text-warning-orange' },
  opportunity: { label: 'OPPORTUNITY', badge: 'bg-[#E8F5E9] text-success-green' },
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
    <main className="bg-[#FAF6F0] min-h-screen pt-20">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-br from-primary-green to-earth-medium-2 text-white px-[5%] py-[30px] shadow-lg">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <div>
            <h1 className="font-heading text-[2rem] mb-1 flex items-center gap-[15px]">
              🌾 AgriPulse System
            </h1>
            <p className="opacity-90 text-[0.95rem]">
              BLISTT Area • Real-Time Crop Monitoring
              {session?.user?.email && (
                <span className="ml-4 opacity-70">— {session.user.email}</span>
              )}
            </p>
          </div>

          <div className="flex gap-3 items-center flex-wrap">
            <Link
              href="/"
              className="px-5 py-2.5 bg-accent-gold text-primary-green rounded-lg font-bold text-sm uppercase tracking-[0.5px]"
            >
              🏠 Home
            </Link>
            <Link
              href="/dashboard/farmers"
              className="px-5 py-2.5 bg-transparent text-white border-2 border-white rounded-lg font-bold text-sm uppercase"
            >
              👥 Farmers
            </Link>
            <Link
              href="/mobile-wizard"
              className="px-5 py-2.5 bg-transparent text-white border-2 border-white rounded-lg font-bold text-sm uppercase"
            >
              📝 Farmer Form
            </Link>
            <form
              action={async () => {
                'use server'
                await signOut({ redirectTo: '/auth/login' })
              }}
            >
              <button
                type="submit"
                className="px-5 py-2.5 bg-transparent text-white border-2 border-white/50 rounded-lg font-bold text-sm cursor-pointer uppercase"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-[30px]">
        {/* KPI Cards */}
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] gap-5 mb-[30px]">
          <StatsCard label="Active Farmers" value={data.totalFarmers} icon="👨‍🌾" />
          <StatsCard label="Hectares Tracked" value={`${data.totalHectares.toFixed(1)}`} icon="🌾" />
          <StatsCard label="Crop Varieties" value={data.cropBreakdown.length} icon="🥬" highlight />
          <StatsCard label="Total Points Earned" value={data.totalPoints} icon="🏆" />
        </div>

        {/* Alerts */}
        <AlertSection cropBreakdown={data.cropBreakdown} totalSubmissions={data.totalSubmissions} />

        {/* Charts 2×2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] mb-[30px]">
          <div className="bg-white p-[30px] rounded-2xl border-[3px] border-earth-light-2">
            <h2 className="font-heading text-[1.2rem] text-[#3E2723] mb-1">Crop Distribution</h2>
            <p className="text-[0.85rem] text-[#666] mb-5">Current planting breakdown by crop type</p>
            <CropChart
              labels={data.cropBreakdown.map((c) => c.cropName)}
              values={data.cropBreakdown.map((c) => c._count.cropName)}
              type="doughnut"
            />
          </div>

          <div className="bg-white p-[30px] rounded-2xl border-[3px] border-earth-light-2">
            <h2 className="font-heading text-[1.2rem] text-[#3E2723] mb-1">Harvest Timeline</h2>
            <p className="text-[0.85rem] text-[#666] mb-5">Projected harvest area (ha) by month</p>
            <CropChart
              labels={data.harvestTimelineLabels}
              values={data.harvestTimelineValues}
              type="bar"
              barColor="#2D5016"
            />
          </div>

          <div className="bg-white p-[30px] rounded-2xl border-[3px] border-earth-light-2">
            <h2 className="font-heading text-[1.2rem] text-[#3E2723] mb-1">Barangay Participation</h2>
            <p className="text-[0.85rem] text-[#666] mb-5">Active farmers by barangay</p>
            <CropChart
              labels={data.barangayBreakdown.map((b) => b.barangay || 'Unknown')}
              values={data.barangayBreakdown.map((b) => b._count.id)}
              type="bar"
              horizontal
              barColor="#F4A300"
            />
          </div>

          <div className="bg-white p-[30px] rounded-2xl border-[3px] border-earth-light-2">
            <h2 className="font-heading text-[1.2rem] text-[#3E2723] mb-1">Weekly Submissions</h2>
            <p className="text-[0.85rem] text-[#666] mb-5">Data submission trends</p>
            <WeeklyChart labels={data.weeklyLabels} values={data.weeklyValues} />
          </div>
        </div>

        {/* Barangay Map */}
        <BarangayMap barangays={data.barangayBreakdown} />

        {/* Data Intelligence Table */}
        <div className="bg-white p-[30px] rounded-2xl border-[3px] border-earth-light-2 overflow-x-auto">
          <h2 className="font-heading text-2xl text-[#3E2723] mb-5">
            📋 Data Intelligence Summary
          </h2>
          {data.cropBreakdown.length === 0 ? (
            <p className="text-[#666] text-[0.95rem]">No data yet — submissions will appear here.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Crop Type', 'Submissions', 'Hectares', 'Next Harvest', 'Saturation', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="bg-primary-green text-white p-[15px] text-left font-bold text-sm uppercase tracking-[0.5px]"
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
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : '—'
                  const status = getStatus(pct)
                  return (
                    <tr key={c.cropName} className="border-b border-[#E0E0E0]">
                      <td className="p-[15px] font-semibold text-primary-green">{c.cropName}</td>
                      <td className="p-[15px] text-[#666]">{c._count.cropName}</td>
                      <td className="p-[15px] text-[#666]">{hectares > 0 ? `${hectares.toFixed(1)} ha` : '—'}</td>
                      <td className="p-[15px] text-[#666]">{nextHarvest}</td>
                      <td className="p-[15px] text-[#666]">{pct}%</td>
                      <td className="p-[15px]">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${status.badge}`}>
                          {status.label}
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

      <footer className="text-center p-[30px] text-[#7c8a70] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
