import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <main className="bg-[#FAF6F0] min-h-screen flex flex-col">
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-8 pt-8 pb-10 flex-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5a6b4d] hover:text-[#2D5016] transition-colors"
        >
          ← Bumalik sa Dashboard
        </Link>

        <header className="mt-5 mb-7">
          <h1
            className="font-heading text-[1.7rem] text-[#243016] flex items-center gap-3"
            style={{ letterSpacing: '-0.01em' }}
          >
            <span
              aria-hidden="true"
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl text-[1.4rem]"
              style={{ background: 'rgba(93,158,135,0.14)', border: '1px solid rgba(93,158,135,0.24)' }}
            >
              ⚙️
            </span>
            Account Settings
          </h1>
          <p className="text-sm text-[#6b7360] mt-2 pl-[3.75rem]">
            Naka-sign in bilang <strong className="text-[#3a4a2c]">{session.user.email}</strong>
          </p>
        </header>

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

      <footer className="text-center py-6 text-[#8a917e] text-[0.85rem]">
        © 2026 AgriPulse System | DisenyoDigitals
      </footer>
    </main>
  )
}
