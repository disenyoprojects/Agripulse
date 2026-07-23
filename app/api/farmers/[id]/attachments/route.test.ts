import { describe, it, expect, beforeEach, vi } from 'vitest'

const { authMock, dbMock, uploadMock, assertMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  dbMock: {
    farmer: { findUnique: vi.fn() },
    attachment: { create: vi.fn() },
  },
  uploadMock: vi.fn(),
  assertMock: vi.fn(),
}))

vi.mock('@/auth', () => ({ auth: authMock }))
vi.mock('@/lib/db', () => ({ db: dbMock }))
vi.mock('@/lib/storage/blob', () => ({ uploadAttachment: uploadMock }))
vi.mock('@/lib/file-validation', () => ({ assertAllowedFile: assertMock }))

import { POST } from './route'

const FARMER = 'farmer-1'

function post(file: File | null, farmerId = FARMER) {
  const fd = new FormData()
  if (file) fd.set('file', file)
  return POST(new Request('http://localhost/api/farmers/x/attachments', { method: 'POST', body: fd }), {
    params: Promise.resolve({ id: farmerId }),
  })
}

const goodFile = () => new File([new Uint8Array([1, 2, 3, 4])], 'crop.png', { type: 'image/png' })

describe('POST /api/farmers/[id]/attachments', () => {
  beforeEach(() => {
    authMock.mockReset()
    dbMock.farmer.findUnique.mockReset()
    dbMock.attachment.create.mockReset()
    uploadMock.mockReset()
    assertMock.mockReset()

    authMock.mockResolvedValue({ user: { email: 'admin@x' } })
    dbMock.farmer.findUnique.mockResolvedValue({ id: FARMER })
    assertMock.mockReturnValue({ ok: true, mime: 'image/png', kind: 'image' })
    uploadMock.mockResolvedValue({ url: 'https://store.private.blob.vercel-storage.com/farmers/farmer-1/crop.png' })
    dbMock.attachment.create.mockResolvedValue({
      id: 'att-1',
      fileName: 'crop.png',
      mimeType: 'image/png',
      size: 4,
      createdAt: new Date(),
    })
  })

  it('returns 401 when not authenticated, without uploading', async () => {
    authMock.mockResolvedValue(null)
    const res = await post(goodFile())
    expect(res.status).toBe(401)
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('returns 404 when the farmer does not exist', async () => {
    dbMock.farmer.findUnique.mockResolvedValue(null)
    const res = await post(goodFile())
    expect(res.status).toBe(404)
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('returns 400 when no file is provided', async () => {
    const res = await post(null)
    expect(res.status).toBe(400)
  })

  it('returns 400 for an empty file', async () => {
    const res = await post(new File([], 'empty.png', { type: 'image/png' }))
    expect(res.status).toBe(400)
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the bytes are not a genuine image/pdf', async () => {
    assertMock.mockReturnValue({ ok: false, error: 'bad' })
    const res = await post(goodFile())
    expect(res.status).toBe(400)
    expect(uploadMock).not.toHaveBeenCalled()
  })

  it('uploads to Blob and stores only the URL (no raw bytes) on success', async () => {
    const res = await post(goodFile())
    expect(res.status).toBe(201)

    expect(uploadMock).toHaveBeenCalledOnce()
    expect(dbMock.attachment.create).toHaveBeenCalledOnce()
    const data = dbMock.attachment.create.mock.calls[0][0].data
    expect(data.blobUrl).toBe('https://store.private.blob.vercel-storage.com/farmers/farmer-1/crop.png')
    expect(data).not.toHaveProperty('data')
  })
})
