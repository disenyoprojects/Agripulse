import { getFarmerWithSubmissions } from '@/lib/repositories/farmer.repository'
import { notFound, redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_STYLE: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  PENDING:  { dot: '#FF6F00', text: '#C15A00', bg: '#FDF3E7', border: 'rgba(193,90,0,0.18)' },
  VERIFIED: { dot: '#2E7D32', text: '#1e6b24', bg: '#EBF5EC', border: 'rgba(46,125,50,0.18)' },
  REJECTED: { dot: '#D32F2F', text: '#b52a2a', bg: '#FDECEC', border: 'rgba(211,47,47,0.18)' },
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

  async function verifySubmission(submissionId: string) {
    'use server'
    const session = await auth()
    if (!session?.user) redirect('/auth/login')
    await db.submission.update({
      where: { id: submissionId },
      data: { status: 'VERIFIED', pointsEarned: 10 },
    })
    revalidatePath(`/dashboard/farmers/${id}`)
  }

  return (
    <main className="bg-[#FAF6F0] min-h-screen pt-20">
      {/* Header */}
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
            <p
              className="text-[0.8rem] font-bold uppercase tracking-wider mb-1"
              style={{ color: 'var(--accent-turquoise-light)', opacity: 0.85 }}
            >
              Farmer Portfolio
            </p>
            <h1
              className="font-heading text-[1.8rem]"
              style={{ letterSpacing: '-0.01em' }}
            >
              {farmer.fullName}
            </h1>
            <p className="opacity-80 text-[0.9rem] mt-1">
              {farmer.barangay}, {farmer.municipality}
              {farmer.contactNumber && (
                <span className="ml-4 opacity-70">· {farmer.contactNumber}</span>
              )}
            </p>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <Link href="/dashboard/farmers" className="btn btn-sm btn-on-dark">← All Farmers</Link>
            <Link href="/dashboard" className="btn btn-sm btn-on-dark">Dashboard</Link>
          </div>
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

        {/* Submissions table */}
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
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {['Reference', 'Crop', 'Planted', 'Harvest', 'Hectares', 'Points', 'Status', 'Action'].map(
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
                        {s.status === 'PENDING' && (
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
                        )}
                      </td>
                    </tr>
                  )
                })}
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
