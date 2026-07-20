import { auth } from '@/auth'
import { db } from '@/lib/db'

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await db.submission.update({
      where: { id },
      data: { status: 'VERIFIED', pointsEarned: 10 },
    })
    return Response.json({ success: true })
  } catch (error) {
    console.error('Verification failed:', error)
    return Response.json({ success: false, error: 'Failed to verify submission' }, { status: 500 })
  }
}
