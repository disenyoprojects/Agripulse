import { describe, it, expect, beforeEach, vi } from 'vitest'

const { authMock, dbMock, signMock, delMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  dbMock: {
    attachment: { findFirst: vi.fn(), deleteMany: vi.fn() },
  },
  signMock: vi.fn(),
  delMock: vi.fn(),
}))

vi.mock('@/auth', () => ({ auth: authMock }))
vi.mock('@/lib/db', () => ({ db: dbMock }))
vi.mock('@/lib/storage/blob', () => ({
  signedDownloadUrl: signMock,
  deleteAttachment: delMock,
}))

import { GET, DELETE } from './route'

const params = Promise.resolve({ id: 'farmer-1', attachmentId: 'att-1' })
const req = () => new Request('http://localhost/api/farmers/x/attachments/y')

describe('GET /api/farmers/[id]/attachments/[attachmentId]', () => {
  beforeEach(() => {
    authMock.mockReset()
    dbMock.attachment.findFirst.mockReset()
    signMock.mockReset()
    authMock.mockResolvedValue({ user: { email: 'admin@x' } })
    dbMock.attachment.findFirst.mockResolvedValue({ blobUrl: 'https://store.private.blob.vercel-storage.com/f/a.png' })
    signMock.mockResolvedValue('https://store.private.blob.vercel-storage.com/f/a.png?signed=abc')
  })

  it('returns 401 when not authenticated', async () => {
    authMock.mockResolvedValue(null)
    const res = await GET(req(), { params })
    expect(res.status).toBe(401)
    expect(signMock).not.toHaveBeenCalled()
  })

  it('returns 404 when the attachment does not exist for this farmer', async () => {
    dbMock.attachment.findFirst.mockResolvedValue(null)
    const res = await GET(req(), { params })
    expect(res.status).toBe(404)
  })

  it('redirects (307) to the signed download URL', async () => {
    const res = await GET(req(), { params })
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe(
      'https://store.private.blob.vercel-storage.com/f/a.png?signed=abc'
    )
  })
})

describe('DELETE /api/farmers/[id]/attachments/[attachmentId]', () => {
  beforeEach(() => {
    authMock.mockReset()
    dbMock.attachment.findFirst.mockReset()
    dbMock.attachment.deleteMany.mockReset()
    delMock.mockReset()
    authMock.mockResolvedValue({ user: { email: 'admin@x' } })
    dbMock.attachment.findFirst.mockResolvedValue({ blobUrl: 'https://store.private.blob.vercel-storage.com/f/a.png' })
    dbMock.attachment.deleteMany.mockResolvedValue({ count: 1 })
    delMock.mockResolvedValue(undefined)
  })

  it('returns 401 when not authenticated', async () => {
    authMock.mockResolvedValue(null)
    const res = await DELETE(req(), { params })
    expect(res.status).toBe(401)
    expect(delMock).not.toHaveBeenCalled()
  })

  it('returns 404 when the attachment does not exist', async () => {
    dbMock.attachment.findFirst.mockResolvedValue(null)
    const res = await DELETE(req(), { params })
    expect(res.status).toBe(404)
    expect(delMock).not.toHaveBeenCalled()
  })

  it('deletes the blob and the row on success', async () => {
    const res = await DELETE(req(), { params })
    expect(res.status).toBe(200)
    expect(delMock).toHaveBeenCalledOnce()
    expect(dbMock.attachment.deleteMany).toHaveBeenCalledOnce()
  })

  it('still removes the row when the blob is already gone', async () => {
    delMock.mockRejectedValue(new Error('blob 404'))
    const res = await DELETE(req(), { params })
    expect(res.status).toBe(200)
    expect(dbMock.attachment.deleteMany).toHaveBeenCalledOnce()
  })
})
