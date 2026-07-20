import { getFarmerWithSubmissions } from '@/lib/repositories/farmer.repository'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-[#FFF3E0] text-warning-orange',
  VERIFIED: 'bg-[#E8F5E9] text-success-green',
  REJECTED: 'bg-[#FFEBEE] text-warning-red',
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
    await db.submission.update({
      where: { id: submissionId },
      data: { status: 'VERIFIED', pointsEarned: 10 },
    })
    revalidatePath(`/dashboard/farmers/${id}`)
  }

  return (
    <main className="bg-[#FAF6F0] min-h-screen pt-20">
      <div className="bg-gradient-to-br from-primary-green to-earth-medium-2 text-white px-[5%] py-[30px] shadow-lg">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <div>
            <p className="text-sm opacity-70 mb-1">Farmer Portfolio</p>
            <h1 className="font-heading text-[2rem] mb-1">{farmer.fullName}</h1>
            <p className="opacity-90 text-[0.95rem]">
              {farmer.barangay}, {farmer.municipality}
              {farmer.contactNumber && (
                <span className="ml-4 opacity-70">· {farmer.contactNumber}</span>
              )}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/dashboard/farmers"
              className="px-5 py-2.5 bg-white/10 text-white border-2 border-white/50 rounded-lg font-bold text-sm uppercase"
            >
              ← All Farmers
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-accent-gold text-primary-green rounded-lg font-bold text-sm uppercase"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-[30px]">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-[30px]">
          <div className="bg-white p-6 rounded-2xl border-[3px] border-earth-light-2 text-center">
            <p className="font-heading text-3xl text-primary-green">{farmer.submissions.length}</p>
            <p className="text-sm text-[#666] mt-1">Total Submissions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-[3px] border-[#FFF3E0] text-center">
            <p className="font-heading text-3xl text-warning-orange">{pendingCount}</p>
            <p className="text-sm text-[#666] mt-1">Pending</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-[3px] border-earth-light-2 text-center">
            <p className="font-heading text-3xl text-accent-gold">{totalPoints}</p>
            <p className="text-sm text-[#666] mt-1">AgriPoints</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-[3px] border-earth-light-2 text-center">
            <p className="font-heading text-3xl text-primary-green">{totalHectares.toFixed(1)}</p>
            <p className="text-sm text-[#666] mt-1">Total Hectares</p>
          </div>
        </div>

        {/* Submissions table */}
        <div className="bg-white rounded-2xl border-[3px] border-earth-light-2 overflow-x-auto">
          <div className="p-[30px] border-b border-[#E0E0E0]">
            <h2 className="font-heading text-xl text-[#3E2723]">Submission History</h2>
            {pendingCount > 0 && (
              <p className="text-sm text-warning-orange mt-1">
                {pendingCount} submission{pendingCount > 1 ? 's' : ''} awaiting verification
              </p>
            )}
          </div>

          {farmer.submissions.length === 0 ? (
            <p className="p-[30px] text-[#666]">No submissions yet.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Reference', 'Crop', 'Planted', 'Harvest', 'Hectares', 'Points', 'Status', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="bg-[#F5F5F5] text-[#555] p-[12px] text-left font-bold text-xs uppercase tracking-[0.5px] border-b border-[#E0E0E0]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {farmer.submissions.map((s) => (
                  <tr key={s.id} className="border-b border-[#E0E0E0] hover:bg-[#FAFAFA]">
                    <td className="p-[12px] font-mono text-xs text-[#888]">{s.referenceNumber}</td>
                    <td className="p-[12px] font-semibold text-primary-green">{s.cropName}</td>
                    <td className="p-[12px] text-[#666] text-sm">
                      {new Date(s.plantingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-[12px] text-[#666] text-sm">
                      {new Date(s.harvestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-[12px] text-[#666] text-sm">
                      {Number(s.farmSizeHectares ?? 0) > 0 ? `${Number(s.farmSizeHectares).toFixed(2)} ha` : '—'}
                    </td>
                    <td className="p-[12px] text-center font-bold text-accent-gold">{s.pointsEarned}</td>
                    <td className="p-[12px]">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_BADGE[s.status] ?? ''}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-[12px]">
                      {s.status === 'PENDING' && (
                        <form action={verifySubmission.bind(null, s.id)}>
                          <button
                            type="submit"
                            className="px-3 py-1.5 bg-success-green text-white rounded-lg text-xs font-bold uppercase hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            ✓ Verify
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
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
