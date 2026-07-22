import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

// GET — stream a submission's crop photo (admin only).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const submission = await db.submission.findUnique({
      where: { id },
      select: { photoData: true, photoMime: true },
    })

    if (!submission?.photoData || !submission.photoMime) {
      return NextResponse.json({ success: false, error: 'No photo.' }, { status: 404 })
    }

    const body = new Uint8Array(submission.photoData)
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': submission.photoMime,
        'Content-Length': String(body.byteLength),
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Submission photo error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load photo.' }, { status: 500 })
  }
}
