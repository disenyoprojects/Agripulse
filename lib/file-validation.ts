// Magic-byte file-type detection. The browser-supplied MIME type is untrusted
// (trivially spoofed), so we sniff the actual leading bytes instead.

export type DetectedType = {
  mime: string
  kind: 'image' | 'pdf'
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  if (bytes.length < offset + signature.length) return false
  return signature.every((byte, i) => bytes[offset + i] === byte)
}

/**
 * Inspect the leading bytes of a file and return its canonical type, or null
 * if it doesn't match a known/allowed signature.
 */
export function detectFileType(bytes: Uint8Array): DetectedType | null {
  // JPEG — FF D8 FF
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) return { mime: 'image/jpeg', kind: 'image' }
  // PNG — 89 50 4E 47 0D 0A 1A 0A
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return { mime: 'image/png', kind: 'image' }
  // GIF — "GIF8"
  if (startsWith(bytes, [0x47, 0x49, 0x46, 0x38])) return { mime: 'image/gif', kind: 'image' }
  // WEBP — "RIFF" .... "WEBP"
  if (startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && startsWith(bytes, [0x57, 0x45, 0x42, 0x50], 8))
    return { mime: 'image/webp', kind: 'image' }
  // PDF — "%PDF-"
  if (startsWith(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d])) return { mime: 'application/pdf', kind: 'pdf' }
  return null
}

export type FileCheckResult =
  | { ok: true; mime: string; kind: 'image' | 'pdf' }
  | { ok: false; error: string }

/**
 * Validate that a file's real content matches one of the allowed kinds.
 * `allowed` restricts by detected kind (e.g. ['image'] for a photo-only field).
 */
export function assertAllowedFile(
  bytes: Uint8Array,
  allowed: ReadonlyArray<'image' | 'pdf'>
): FileCheckResult {
  const detected = detectFileType(bytes)
  if (!detected) {
    return { ok: false, error: 'Unsupported or unrecognized file type.' }
  }
  if (!allowed.includes(detected.kind)) {
    return { ok: false, error: `This field only accepts: ${allowed.join(', ')}.` }
  }
  return { ok: true, mime: detected.mime, kind: detected.kind }
}
