import { getAllFarmersWithStats } from '@/lib/repositories/farmer.repository'
import FarmerRowMenu from '@/components/dashboard/FarmerRowMenu'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const FARMER_STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; border: string; label: string }> = {
  PENDING:  { dot: '#FF6F00', text: '#C15A00', bg: '#FDF3E7', border: 'rgba(193,90,0,0.18)', label: 'Pending' },
  APPROVED: { dot: '#2E7D32', text: '#1e6b24', bg: '#EBF5EC', border: 'rgba(46,125,50,0.18)', label: 'Approved' },
  REJECTED: { dot: '#D32F2F', text: '#b52a2a', bg: '#FDECEC', border: 'rgba(211,47,47,0.18)', label: 'Rejected' },
}

const STATUS_ORDER: Record<string, number> = { PENDING: 0, APPROVED: 1, REJECTED: 2 }

export default async function FarmerPortfoliosPage() {
  const unsorted = await getAllFarmersWithStats()
  // Surface farmers awaiting review first, preserving the repository's recency order within each group.
  const farmers = [...unsorted].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 3) - (STATUS_ORDER[b.status] ?? 3)
  )

  const totals = {
    count: farmers.length,
    pendingFarmers: farmers.filter((f) => f.status === 'PENDING').length,
    submissions: farmers.reduce((s, f) => s + f.totalSubmissions, 0),
    verified: farmers.reduce((s, f) => s + f.verified, 0),
  }

  return (
    <main className="bg-[#FAF6F0] min-h-screen pt-20">
      {/* Header — matches dashboard */}
      <div
        className="text-white px-[5%] py-8 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 50% 120% at 88% 0%, rgba(93,158,135,0.28) 0%, transparent 60%), linear-gradient(135deg, #2D5016 0%, #38541F 60%, #234011 100%)',
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
          <div className="flex gap-2.5">
            <Link href="/dashboard" className="btn btn-sm btn-on-dark">← Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-8">
        {/* Summary stat cards */}
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-6">
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

        {/* Farmers table */}
        <div className="card overflow-x-auto">
          {farmers.length === 0 ? (
            <p className="p-8 text-[#6b7360]">No farmers yet — submissions will appear here.</p>
          ) : (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['Farmer', 'Status', 'Barangay', 'Municipality', 'Submissions', 'Pending', 'Verified', 'Points', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-[#6b7360] pt-6 pb-3 px-4 text-left font-bold text-xs uppercase tracking-wider border-b-2 border-[#e6e2d6]"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {farmers.map((f) => (
                  <tr
                    key={f.id}
                    className="border-b border-[#eeeae0] hover:bg-[#faf8f2] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-primary-green">{f.fullName}</td>
                    <td className="py-3.5 px-4">
                      {(() => {
                        const st = FARMER_STATUS_STYLE[f.status] ?? FARMER_STATUS_STYLE.PENDING
                        return (
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                            style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
                          >
                            <span
                              aria-hidden="true"
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: st.dot }}
                            />
                            {st.label}
                          </span>
                        )
                      })()}
                    </td>
                    <td className="py-3.5 px-4 text-[#5a5f52]">{f.barangay || '—'}</td>
                    <td className="py-3.5 px-4 text-[#5a5f52]">{f.municipality}</td>
                    <td className="py-3.5 px-4 text-[#5a5f52] text-center" data-nums>
                      {f.totalSubmissions}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {f.pending > 0 ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[#C15A00]">
                          <span
                            aria-hidden="true"
                            className="w-2 h-2 rounded-full"
                            style={{ background: '#FF6F00' }}
                          />
                          {f.pending}
                        </span>
                      ) : (
                        <span className="text-[#b0b8a6]">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#2E7D32]">
                        <span
                          aria-hidden="true"
                          className="w-2 h-2 rounded-full"
                          style={{ background: '#2E7D32' }}
                        />
                        {f.verified}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-accent-gold" data-nums>
                      {f.totalPoints}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <FarmerRowMenu farmerId={f.id} farmerName={f.fullName} status={f.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <footer className="text-center py-8 text-[#8a917e] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
