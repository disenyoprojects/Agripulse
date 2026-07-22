import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { assertAllowedFile } from '@/lib/file-validation'

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

// GET — list attachment metadata (never the raw bytes) for a farmer.
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
    const attachments = await db.attachment.findMany({
      where: { farmerId: id },
      select: { id: true, fileName: true, mimeType: true, size: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, attachments })
  } catch (error) {
    console.error('List attachments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load attachments.' },
      { status: 500 }
    )
  }
}

// POST — upload a file (multipart/form-data, field name "file") for a farmer.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const farmer = await db.farmer.findUnique({ where: { id }, select: { id: true } })
    if (!farmer) {
      return NextResponse.json({ success: false, error: 'Farmer not found.' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File must be between 1 byte and 5 MB.' },
        { status: 400 }
      )
    }

    const bytes = new Uint8Array(await file.arrayBuffer())
    // Verify the real file content — the browser-declared type is untrusted.
    const check = assertAllowedFile(bytes, ['image', 'pdf'])
    if (!check.ok) {
      return NextResponse.json(
        { success: false, error: 'Only genuine image or PDF files are allowed.' },
        { status: 400 }
      )
    }

    const created = await db.attachment.create({
      data: {
        farmerId: id,
        fileName: file.name,
        mimeType: check.mime,
        size: file.size,
        data: Buffer.from(bytes),
      },
      select: { id: true, fileName: true, mimeType: true, size: true, createdAt: true },
    })

    return NextResponse.json({ success: true, attachment: created }, { status: 201 })
  } catch (error) {
    console.error('Upload attachment error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed. Please try again.' },
      { status: 500 }
    )
  }
}
