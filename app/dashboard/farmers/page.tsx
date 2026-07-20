import { getAllFarmersWithStats } from '@/lib/repositories/farmer.repository'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FarmerPortfoliosPage() {
  const farmers = await getAllFarmersWithStats()

  return (
    <main className="bg-[#FAF6F0] min-h-screen pt-20">
      <div className="bg-gradient-to-br from-primary-green to-earth-medium-2 text-white px-[5%] py-[30px] shadow-lg">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center flex-wrap gap-5">
          <div>
            <h1 className="font-heading text-[2rem] mb-1">👥 Farmer Portfolios</h1>
            <p className="opacity-90 text-[0.95rem]">Verify submissions and manage farmer records</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 bg-accent-gold text-primary-green rounded-lg font-bold text-sm uppercase"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-[5%] py-[30px]">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-[30px]">
          <div className="bg-white p-6 rounded-2xl border-[3px] border-earth-light-2 text-center">
            <p className="font-heading text-3xl text-primary-green">{farmers.length}</p>
            <p className="text-sm text-[#666] mt-1">Total Farmers</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-[3px] border-earth-light-2 text-center">
            <p className="font-heading text-3xl text-primary-green">
              {farmers.reduce((s, f) => s + f.totalSubmissions, 0)}
            </p>
            <p className="text-sm text-[#666] mt-1">Total Submissions</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-[3px] border-[#FFF3E0] text-center">
            <p className="font-heading text-3xl text-warning-orange">
              {farmers.reduce((s, f) => s + f.pending, 0)}
            </p>
            <p className="text-sm text-[#666] mt-1">Pending Verification</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border-[3px] border-[#E8F5E9] text-center">
            <p className="font-heading text-3xl text-success-green">
              {farmers.reduce((s, f) => s + f.verified, 0)}
            </p>
            <p className="text-sm text-[#666] mt-1">Verified</p>
          </div>
        </div>

        {/* Farmers table */}
        <div className="bg-white rounded-2xl border-[3px] border-earth-light-2 overflow-x-auto">
          {farmers.length === 0 ? (
            <p className="p-[30px] text-[#666]">No farmers yet — submissions will appear here.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {['Farmer', 'Barangay', 'Municipality', 'Submissions', 'Pending', 'Verified', 'Points', ''].map((h) => (
                    <th
                      key={h}
                      className="bg-primary-green text-white p-[15px] text-left font-bold text-sm uppercase tracking-[0.5px] first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {farmers.map((f) => (
                  <tr key={f.id} className="border-b border-[#E0E0E0] hover:bg-[#F5F5F5] transition-colors">
                    <td className="p-[15px] font-semibold text-primary-green">{f.fullName}</td>
                    <td className="p-[15px] text-[#666]">{f.barangay || '—'}</td>
                    <td className="p-[15px] text-[#666]">{f.municipality}</td>
                    <td className="p-[15px] text-[#666] text-center">{f.totalSubmissions}</td>
                    <td className="p-[15px] text-center">
                      {f.pending > 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFF3E0] text-warning-orange">
                          {f.pending}
                        </span>
                      ) : (
                        <span className="text-[#999]">0</span>
                      )}
                    </td>
                    <td className="p-[15px] text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-[#E8F5E9] text-success-green">
                        {f.verified}
                      </span>
                    </td>
                    <td className="p-[15px] text-center font-semibold text-accent-gold">{f.totalPoints}</td>
                    <td className="p-[15px]">
                      <Link
                        href={`/dashboard/farmers/${f.id}`}
                        className="px-4 py-1.5 bg-primary-green text-white rounded-lg text-xs font-bold uppercase hover:bg-earth-medium-2 transition-colors"
                      >
                        View →
                      </Link>
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
