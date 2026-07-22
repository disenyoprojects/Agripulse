import { describe, it, expect } from 'vitest'
import { detectFileType, assertAllowedFile } from './file-validation'

const JPEG = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])
const PNG = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const GIF = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37])
const WEBP = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
])
const TEXT = new Uint8Array([0x68, 0x65, 0x6c, 0x6c, 0x6f]) // "hello"

describe('detectFileType', () => {
  it('detects each supported signature', () => {
    expect(detectFileType(JPEG)).toEqual({ mime: 'image/jpeg', kind: 'image' })
    expect(detectFileType(PNG)).toEqual({ mime: 'image/png', kind: 'image' })
    expect(detectFileType(GIF)).toEqual({ mime: 'image/gif', kind: 'image' })
    expect(detectFileType(WEBP)).toEqual({ mime: 'image/webp', kind: 'image' })
    expect(detectFileType(PDF)).toEqual({ mime: 'application/pdf', kind: 'pdf' })
  })

  it('returns null for unknown / spoofed content', () => {
    expect(detectFileType(TEXT)).toBeNull()
    expect(detectFileType(new Uint8Array([]))).toBeNull()
  })
})

describe('assertAllowedFile', () => {
  it('accepts a real image when images are allowed', () => {
    expect(assertAllowedFile(PNG, ['image'])).toEqual({ ok: true, mime: 'image/png', kind: 'image' })
  })

  it('rejects a PDF when only images are allowed (photo field)', () => {
    const result = assertAllowedFile(PDF, ['image'])
    expect(result.ok).toBe(false)
  })

  it('accepts a PDF when pdf is allowed (attachments)', () => {
    expect(assertAllowedFile(PDF, ['image', 'pdf']).ok).toBe(true)
  })

  it('rejects a text file masquerading as an image', () => {
    expect(assertAllowedFile(TEXT, ['image', 'pdf']).ok).toBe(false)
  })
})
