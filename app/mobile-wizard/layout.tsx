import { auth } from '@/auth'
import AdminReturnBar from '@/components/shared/AdminReturnBar'

/**
 * The Farmer Portal is public (farmers) but is also reached from the admin
 * sidebar's "Farmer Form" link. When an authenticated LGU admin is viewing it,
 * surface a way back to the dashboard; farmers (no session) see nothing extra.
 */
export default async function MobileWizardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <>
      {session?.user && <AdminReturnBar />}
      {children}
    </>
  )
}
