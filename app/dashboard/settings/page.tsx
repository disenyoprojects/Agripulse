import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <main className="bg-[#FAF6F0] min-h-screen">
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
            <h1 className="font-heading text-[1.8rem] flex items-center gap-3" style={{ letterSpacing: '-0.01em' }}>
              <span aria-hidden="true">⚙️</span> Account Settings
            </h1>
            <p className="opacity-85 text-[0.9rem] mt-1">
              {session.user.email}
            </p>
          </div>
          <div className="flex gap-2.5">
            <Link href="/dashboard" className="btn btn-sm btn-on-dark">← Dashboard</Link>
          </div>
        </div>
      </div>

      <div className="max-w-[520px] mx-auto px-[5%] py-8">
        <div className="card p-7">
          <h2 className="font-heading text-[1.25rem] text-[#243016] mb-1" style={{ letterSpacing: '-0.01em' }}>
            Palitan ang Password
          </h2>
          <p className="text-sm text-[#6b7360] mb-6">
            Ilagay ang iyong kasalukuyang password at ang bago mong password.
          </p>
          <ChangePasswordForm />
        </div>
      </div>

      <footer className="text-center py-8 text-[#8a917e] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
