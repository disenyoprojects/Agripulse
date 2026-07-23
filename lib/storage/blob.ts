import { put, del, issueSignedToken, presignUrl } from '@vercel/blob'

/**
 * Thin wrapper over the file-storage vendor (Vercel Blob, private store).
 *
 * All three operations authenticate with `BLOB_READ_WRITE_TOKEN` from the
 * environment (the SDK reads it automatically). Keeping the vendor behind this
 * module means a later swap (e.g. Cloudflare R2) is a one-file change.
 */

const DEFAULT_DOWNLOAD_EXPIRY_SECONDS = 60

/** Upload bytes to the private store; returns the stored blob URL to persist. */
export async function uploadAttachment(
  pathname: string,
  bytes: Uint8Array,
  contentType: string
): Promise<{ url: string }> {
  const { url } = await put(pathname, Buffer.from(bytes), {
    access: 'private',
    addRandomSuffix: true,
    contentType,
  })
  return { url }
}

/**
 * Mint a short-lived signed GET URL the browser can fetch directly. The caller
 * is responsible for gating access (auth) before calling this — the signed URL
 * itself is unauthenticated but expires quickly.
 */
export async function signedDownloadUrl(
  blobUrl: string,
  expirySeconds: number = DEFAULT_DOWNLOAD_EXPIRY_SECONDS
): Promise<string> {
  const pathname = pathnameFromUrl(blobUrl)
  const validUntil = Date.now() + expirySeconds * 1000
  const token = await issueSignedToken({ pathname, operations: ['get'], validUntil })
  const { presignedUrl } = await presignUrl(token, {
    operation: 'get',
    access: 'private',
    pathname,
    validUntil,
  })
  return presignedUrl
}

/** Delete a blob by its stored URL. */
export async function deleteAttachment(blobUrl: string): Promise<void> {
  await del(blobUrl)
}

function pathnameFromUrl(blobUrl: string): string {
  return new URL(blobUrl).pathname.replace(/^\/+/, '')
}
