import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/dashboard/AdminSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <AdminSidebar email={session.user.email ?? ''} />
      {/* Shift content right of the fixed desktop sidebar; clear the mobile top bar */}
      <div className="lg:pl-[240px] pt-14 lg:pt-0">{children}</div>
    </div>
  )
}
