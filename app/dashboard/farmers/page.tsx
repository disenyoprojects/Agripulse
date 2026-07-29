import { getAllFarmersWithStats } from '@/lib/repositories/farmer.repository'
import FarmersTable, { type FarmerRow } from '@/components/dashboard/FarmersTable'
import BackButton from '@/components/shared/BackButton'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_ORDER: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 }

const FILTER_MAP: Record<string, 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'> = {
  pending: 'PENDING',
  approved: 'APPROVED',
  rejected: 'REJECTED',
}

export default async function FarmerPortfoliosPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const initialFilter = FILTER_MAP[filter ?? ''] ?? 'ALL'
  const unsorted = await getAllFarmersWithStats()
  // Surface farmers awaiting review first, preserving the repository's recency order within each group.
  const sorted = [...unsorted].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3)
  )

  const farmers: FarmerRow[] = sorted.map((f) => ({
    id: f.id,
    fullName: f.fullName,
    status: f.status,
    barangay: f.barangay,
    municipality: f.municipality,
    totalSubmissions: f.totalSubmissions,
    pending: f.pending,
    verified: f.verified,
    totalPoints: f.totalPoints,
  }))

  const totals = {
    count: farmers.length,
    pendingFarmers: farmers.filter((f) => f.status === 'PENDING').length,
    submissions: farmers.reduce((s, f) => s + f.totalSubmissions, 0),
    verified: farmers.reduce((s, f) => s + f.verified, 0),
  }

  return (
    <main className="bg-[#FAF6F0] min-h-screen">
      {/* Header — matches dashboard */}
      <div
        className="text-white px-[5%] py-8 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 50% 120% at 88% 0%, rgba(93,158,135,0.28) 0%, transparent 60%), linear-gradient(135deg, #2D5016 0%, #4C7A2A 60%, #37661F 100%)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <div>
            <h1
              className="font-heading text-[1.8rem] flex items-center gap-3"
              style={{ letterSpacing: '-0.01em' }}
            >
              <span aria-hidden="true">👥</span> Farmer Portfolios
            </h1>
            <p className="opacity-85 text-[0.9rem] mt-1">
              Verify submissions and manage farmer records
            </p>
          </div>
          <div className="flex gap-2.5 items-center">
            <BackButton fallback="/dashboard" label="Back" tone="light" />
            <Link href="/dashboard" className="btn btn-sm btn-on-dark">Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-8">
        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
          {([
            { label: 'Total Farmers', value: totals.count, color: '#2D5016' },
            { label: 'Pending Review', value: totals.pendingFarmers, color: '#C15A00' },
            { label: 'Total Submissions', value: totals.submissions, color: '#2D5016' },
            { label: 'Verified Submissions', value: totals.verified, color: '#2E7D32' },
          ] as const).map(({ label, value, color }) => (
            <div key={label} className="card card-interactive text-center p-6">
              <p
                data-nums
                className="font-heading"
                style={{ fontSize: '2.4rem', color, letterSpacing: '-0.02em', lineHeight: 1 }}
              >
                {value}
              </p>
              <p className="text-sm text-[#6b7360] mt-2 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Farmers — searchable/filterable table (desktop) + cards (mobile) */}
        {farmers.length === 0 ? (
          <div className="card p-8 text-[#6b7360]">No farmers yet — submissions will appear here.</div>
        ) : (
          <FarmersTable farmers={farmers} initialFilter={initialFilter} />
        )}
      </div>

      <footer className="text-center py-8 text-[#8a917e] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
