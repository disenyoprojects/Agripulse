import { getFarmerWithSubmissions } from '@/lib/repositories/farmer.repository'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { approveFarmer, rejectFarmer } from '../actions'
import DeleteFarmerButton from '@/components/dashboard/DeleteFarmerButton'
import BackButton from '@/components/shared/BackButton'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const DATE_FMT: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  PENDING:  { dot: '#FF6F00', text: '#C15A00', bg: '#FDF3E7', border: 'rgba(193,90,0,0.18)' },
  VERIFIED: { dot: '#2E7D32', text: '#1e6b24', bg: '#EBF5EC', border: 'rgba(46,125,50,0.18)' },
  REJECTED: { dot: '#D32F2F', text: '#b52a2a', bg: '#FDECEC', border: 'rgba(211,47,47,0.18)' },
}

const FARMER_STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; border: string; label: string }> = {
  PENDING:  { dot: '#FF6F00', text: '#C15A00', bg: '#FDF3E7', border: 'rgba(193,90,0,0.18)', label: 'Pending review' },
  APPROVED: { dot: '#2E7D32', text: '#1e6b24', bg: '#EBF5EC', border: 'rgba(46,125,50,0.18)', label: 'Approved' },
  REJECTED: { dot: '#D32F2F', text: '#b52a2a', bg: '#FDECEC', border: 'rgba(211,47,47,0.18)', label: 'Rejected' },
}

export default async function FarmerPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const farmer = await getFarmerWithSubmissions(id)

  if (!farmer) notFound()

  const totalPoints = farmer.submissions.reduce((sum, s) => sum + s.pointsEarned, 0)
  const totalHectares = farmer.submissions.reduce(
    (sum, s) => sum + Number(s.farmSizeHectares ?? 0),
    0
  )
  const pendingCount = farmer.submissions.filter((s) => s.status === 'PENDING').length

  const isApproved = farmer.status === 'APPROVED'

  async function verifySubmission(submissionId: string) {
    'use server'
    const session = await auth()
    if (!session?.user) redirect('/auth/login')
    // Only verified (real) farmers may have their submissions verified.
    const owner = await db.farmer.findUnique({ where: { id }, select: { status: true } })
    if (owner?.status !== 'APPROVED') return
    await db.submission.update({
      where: { id: submissionId },
      data: { status: 'VERIFIED', pointsEarned: 10 },
    })
    revalidatePath(`/dashboard/farmers/${id}`)
  }

  return (
    <main className="bg-[#FAF6F0] min-h-screen">
      {/* Header */}
      <div
        className="text-white px-[5%] py-8 relative overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 50% 120% at 88% 0%, rgba(93,158,135,0.28) 0%, transparent 60%), linear-gradient(135deg, #2D5016 0%, #38541F 60%, #234011 100%)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-[0.78rem]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <Link href="/dashboard" className="hover:underline" style={{ color: 'inherit' }}>Dashboard</Link>
              <span className="mx-1.5 opacity-60">/</span>
              <Link href="/dashboard/farmers" className="hover:underline" style={{ color: 'inherit' }}>Farmers</Link>
              <span className="mx-1.5 opacity-60">/</span>
              <span style={{ color: 'var(--accent-turquoise-light)' }}>{farmer.fullName}</span>
            </nav>
            <BackButton fallback="/dashboard/farmers" label="Back" tone="light" />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-heading text-[1.8rem]" style={{ letterSpacing: '-0.01em' }}>
              {farmer.fullName}
            </h1>
            {(() => {
              const st = FARMER_STATUS_STYLE[farmer.status] ?? FARMER_STATUS_STYLE.PENDING
              return (
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
                >
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.dot }} />
                  {st.label}
                </span>
              )
            })()}
          </div>
          <p className="opacity-80 text-[0.9rem] mt-1">
            {farmer.barangay}, {farmer.municipality}
            {farmer.contactNumber && (
              <span className="ml-4 opacity-70">· {farmer.contactNumber}</span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
          {([
            { label: 'Total Submissions', value: farmer.submissions.length, color: '#2D5016' },
            { label: 'Pending', value: pendingCount, color: '#C15A00' },
            { label: 'AgriPoints', value: totalPoints, color: '#b37200' },
            { label: 'Total Hectares', value: `${totalHectares.toFixed(1)} ha`, color: '#2D5016' },
          ] as const).map(({ label, value, color }) => (
            <div key={label} className="card card-interactive text-center p-6">
              <p
                data-nums
                className="font-heading"
                style={{ fontSize: '2.2rem', color, letterSpacing: '-0.02em', lineHeight: 1 }}
              >
                {value}
              </p>
              <p className="text-sm text-[#6b7360] mt-2 font-semibold">{label}</p>
            </div>
          ))}
        </div>

        {/* Profile + submissions two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — profile details + files */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="card p-6">
              <h2 className="font-heading text-[1.25rem] text-[#243016] mb-4" style={{ letterSpacing: '-0.01em' }}>
                Farmer Profile
              </h2>
              <dl className="flex flex-col gap-3">
                {([
                  ['Full name', farmer.fullName],
                  ['Contact', farmer.contactNumber ?? '—'],
                  ['Municipality', farmer.municipality],
                  ['Barangay', farmer.barangay],
                  ['Registered', new Date(farmer.createdAt).toLocaleDateString('en-US', DATE_FMT)],
                  ['Verified', farmer.verifiedAt ? new Date(farmer.verifiedAt).toLocaleDateString('en-US', DATE_FMT) : '—'],
                ] as const).map(([label, value]) => (
                  <div key={label} className="flex justify-between items-baseline gap-4 border-b border-[#f0ece2] pb-3 last:border-0 last:pb-0">
                    <dt className="text-xs uppercase tracking-wider font-bold text-[#8a917e] shrink-0">{label}</dt>
                    <dd className="text-sm text-[#3a4a2c] font-semibold text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card p-6">
              <h2 className="font-heading text-[1.25rem] text-[#243016] mb-1" style={{ letterSpacing: '-0.01em' }}>
                Attached Files
              </h2>
              <p className="text-sm text-[#6b7360] mb-4">
                {farmer.attachments.length} file{farmer.attachments.length !== 1 ? 's' : ''} uploaded
              </p>
              {farmer.attachments.length === 0 ? (
                <p className="text-sm text-[#8a917e]">No files uploaded yet.</p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {farmer.attachments.map((a) => (
                    <li key={a.id}>
                      <a
                        href={`/api/farmers/${farmer.id}/attachments/${a.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-[#faf8f2]"
                        style={{ border: '1px solid #eeeae0' }}
                      >
                        <span aria-hidden="true" className="text-xl shrink-0">
                          {a.mimeType.startsWith('image/') ? '🖼️' : a.mimeType === 'application/pdf' ? '📄' : '📎'}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-[#2D5016] truncate">{a.fileName}</span>
                          <span className="block text-xs text-[#8a917e]">
                            {formatBytes(a.size)} · {new Date(a.createdAt).toLocaleDateString('en-US', DATE_FMT)}
                          </span>
                        </span>
                        <span className="text-xs font-semibold shrink-0" style={{ color: 'var(--accent-turquoise-strong)' }}>View →</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Right column — submissions */}
          <div className="lg:col-span-2">
          <div className="card overflow-x-auto">
          <div className="px-7 pt-6 pb-4 border-b border-[#eeeae0]">
            <h2
              className="font-heading text-[1.25rem] text-[#243016]"
              style={{ letterSpacing: '-0.01em' }}
            >
              Submission History
            </h2>
            {pendingCount > 0 && (
              <p className="text-sm mt-1" style={{ color: '#C15A00' }}>
                {pendingCount} submission{pendingCount > 1 ? 's' : ''} awaiting verification
              </p>
            )}
          </div>

          {farmer.submissions.length === 0 ? (
            <p className="p-8 text-[#6b7360]">No submissions yet.</p>
          ) : (
          <>
            {/* Mobile: submission cards */}
            <div className="flex flex-col gap-3 p-4 md:hidden">
              {farmer.submissions.map((s) => {
                const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.PENDING
                return (
                  <div key={s.id} className="rounded-xl p-4" style={{ border: '1px solid #eeeae0', background: '#faf8f2' }}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-primary-green">{s.cropName}</span>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
                      >
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: st.dot }} />
                        {s.status}
                      </span>
                    </div>
                    <p className="font-mono text-[0.72rem] text-[#8a917e] mt-1">{s.referenceNumber}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[0.8rem] text-[#5a5f52]">
                      <span>🌱 {new Date(s.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>🌾 {new Date(s.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span data-nums>{Number(s.farmSizeHectares ?? 0) > 0 ? `${Number(s.farmSizeHectares).toFixed(2)} ha` : '— ha'}</span>
                      <span className="font-semibold text-accent-gold" data-nums>{s.pointsEarned} pts</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-3">
                      {s.photoMime ? (
                        <a
                          href={`/api/submissions/${s.id}/photo`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold"
                          style={{ color: 'var(--accent-turquoise-strong)' }}
                        >
                          📷 View photo
                        </a>
                      ) : <span className="text-xs text-[#b0b8a6]">No photo</span>}
                      {s.status === 'PENDING' && (isApproved ? (
                        <form action={verifySubmission.bind(null, s.id)}>
                          <button type="submit" className="btn btn-sm" style={{ background: '#EBF5EC', color: '#1e6b24', border: '1px solid rgba(46,125,50,0.22)' }}>
                            ✓ Verify
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-[#8a917e]">Approve farmer first</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Tablet+: table */}
            <table className="w-full border-collapse text-sm hidden md:table">
              <thead>
                <tr>
                  {['Reference', 'Crop', 'Photo', 'Planted', 'Harvest', 'Hectares', 'Points', 'Status', 'Action'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-[#6b7360] pb-3 px-4 text-left font-bold text-xs uppercase tracking-wider border-b-2 border-[#e6e2d6] pt-5"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {farmer.submissions.map((s) => {
                  const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.PENDING
                  return (
                    <tr key={s.id} className="border-b border-[#eeeae0] hover:bg-[#faf8f2] transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#8a917e]">
                        {s.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-primary-green">{s.cropName}</td>
                      <td className="py-3.5 px-4">
                        {s.photoMime ? (
                          <a
                            href={`/api/submissions/${s.id}/photo`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold"
                            style={{ color: 'var(--accent-turquoise-strong)' }}
                          >
                            📷 View
                          </a>
                        ) : (
                          <span className="text-[#b0b8a6]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#5a5f52]">
                        {new Date(s.plantingDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-[#5a5f52]">
                        {new Date(s.harvestDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-[#5a5f52]" data-nums>
                        {Number(s.farmSizeHectares ?? 0) > 0
                          ? `${Number(s.farmSizeHectares).toFixed(2)} ha`
                          : '—'}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-accent-gold" data-nums>
                        {s.pointsEarned}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: st.bg, color: st.text, border: `1px solid ${st.border}` }}
                        >
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: st.dot }}
                          />
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {s.status === 'PENDING' &&
                          (isApproved ? (
                            <form action={verifySubmission.bind(null, s.id)}>
                              <button
                                type="submit"
                                className="btn btn-sm"
                                style={{
                                  background: '#EBF5EC',
                                  color: '#1e6b24',
                                  border: '1px solid rgba(46,125,50,0.22)',
                                }}
                              >
                                ✓ Verify
                              </button>
                            </form>
                          ) : (
                            <span
                              className="text-xs text-[#8a917e]"
                              title="Approve the farmer first"
                            >
                              Approve farmer first
                            </span>
                          ))}
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
        </div>
      </div>

      <footer className="text-center py-8 pb-28 text-[#8a917e] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>

      {/* Sticky action bar — Approve / Reject / Delete */}
      <div
        className="sticky bottom-0 z-10 border-t border-[#e6e2d6] bg-white/95 backdrop-blur px-[5%] py-3"
        style={{ boxShadow: '0 -8px 24px -12px rgba(0,0,0,0.2)' }}
      >
        <div className="max-w-[1400px] mx-auto flex gap-2.5">
          {farmer.status !== 'APPROVED' && (
            <form action={approveFarmer.bind(null, farmer.id)} className="flex-1">
              <button type="submit" className="btn w-full" style={{ background: '#2E7D32', color: '#fff', border: 'none' }}>
                ✓ Approve
              </button>
            </form>
          )}
          {farmer.status !== 'REJECTED' && (
            <form action={rejectFarmer.bind(null, farmer.id)} className="flex-1">
              <button type="submit" className="btn w-full" style={{ background: '#D32F2F', color: '#fff', border: 'none' }}>
                ✕ Reject
              </button>
            </form>
          )}
          <div className="flex-1 flex">
            <DeleteFarmerButton farmerId={farmer.id} farmerName={farmer.fullName} className="btn w-full btn-secondary" />
          </div>
        </div>
      </div>
    </main>
  )
}
