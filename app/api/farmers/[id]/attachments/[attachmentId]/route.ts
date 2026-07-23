import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { signedDownloadUrl, deleteAttachment } from '@/lib/storage/blob'

// GET — redirect to a short-lived signed URL for the file in Blob storage.
// The session check gates access; the browser then fetches the file directly
// (no bytes flow through this function, so the ~4.5MB response limit no longer
// applies), and the signed URL expires quickly.
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
      select: { blobUrl: true },
    })

    if (!attachment) {
      return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 })
    }

    const url = await signedDownloadUrl(attachment.blobUrl)
    return NextResponse.redirect(url, 307)
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
    const attachment = await db.attachment.findFirst({
      where: { id: attachmentId, farmerId: id },
      select: { blobUrl: true },
    })

    if (!attachment) {
      return NextResponse.json({ success: false, error: 'Not found.' }, { status: 404 })
    }

    // Remove the blob first, but don't fail the request if it's already gone —
    // the DB row is the source of truth for what the admin sees.
    try {
      await deleteAttachment(attachment.blobUrl)
    } catch (blobError) {
      console.error('Blob delete failed (continuing to remove the record):', blobError)
    }

    await db.attachment.deleteMany({ where: { id: attachmentId, farmerId: id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete attachment error:', error)
    return NextResponse.json(
      { success: false, error: 'Delete failed. Please try again.' },
      { status: 500 }
    )
  }
}
