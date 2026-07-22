import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'

// GET — stream a single attachment's bytes back to the browser.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id, attachmentId } = await params
    const attachment = await db.attachment.findFirst({
      where: { id: attachmentId, farmerId: id },
    })

    if (!attachment) {
      return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 })
    }

    const body = new Uint8Array(attachment.data)
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': attachment.mimeType,
        'Content-Length': String(attachment.size),
        'Content-Disposition': `inline; filename="${encodeURIComponent(attachment.fileName)}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error('Download attachment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load file.' },
      { status: 500 }
    )
  }
}

// DELETE — remove a single attachment.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id, attachmentId } = await params
    const { count } = await db.attachment.deleteMany({
      where: { id: attachmentId, farmerId: id },
    })

    if (count === 0) {
      return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete attachment error:', error)
    return NextResponse.json(
      { success: false, error: 'Delete failed. Please try again.' },
      { status: 500 }
    )
  }
}
