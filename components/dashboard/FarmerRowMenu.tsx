'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { approveFarmer, rejectFarmer, deleteFarmer } from '@/app/dashboard/farmers/actions'

type FarmerStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

type AttachmentMeta = {
  id: string
  fileName: string
  mimeType: string
  size: number
  createdAt: string
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FarmerRowMenu({
  farmerId,
  farmerName,
  status,
}: {
  farmerId: string
  farmerName: string
  status: FarmerStatus
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null)
  const [filesOpen, setFilesOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  function openMenu() {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) setCoords({ top: rect.bottom + 6, right: window.innerWidth - rect.right })
    setOpen(true)
  }

  function runAction(action: (id: string) => Promise<void>) {
    setOpen(false)
    startTransition(async () => {
      await action(farmerId)
      router.refresh()
    })
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        aria-label="Row actions"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={pending}
        className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[#6b7360] hover:bg-[#efeade] transition-colors"
        style={{ border: '1px solid #e6e2d6', background: 'white', cursor: pending ? 'wait' : 'pointer' }}
      >
        <span aria-hidden="true" className="text-lg leading-none tracking-tighter">⋮</span>
      </button>

      {open && coords && (
        <>
          {/* Click-away backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            role="menu"
            className="fixed z-50 min-w-[190px] rounded-xl p-1.5 bg-white"
            style={{
              top: coords.top,
              right: coords.right,
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid #e6e2d6',
            }}
          >
            <Link
              href={`/dashboard/farmers/${farmerId}`}
              role="menuitem"
              className="menu-item flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#3d4636] no-underline"
              onClick={() => setOpen(false)}
            >
              <span aria-hidden="true">👁️</span> View portfolio
            </Link>

            <button
              role="menuitem"
              className="menu-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#3d4636] text-left"
              onClick={() => {
                setOpen(false)
                setFilesOpen(true)
              }}
            >
              <span aria-hidden="true">📎</span> Manage files
            </button>

            {status !== 'APPROVED' && (
              <button
                role="menuitem"
                className="menu-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-left"
                style={{ color: '#1e6b24' }}
                onClick={() => runAction(approveFarmer)}
              >
                <span aria-hidden="true">✓</span> Approve farmer
              </button>
            )}

            {status !== 'REJECTED' && (
              <button
                role="menuitem"
                className="menu-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-left"
                style={{ color: '#b52a2a' }}
                onClick={() => runAction(rejectFarmer)}
              >
                <span aria-hidden="true">✕</span> Reject farmer
              </button>
            )}

            <div className="my-1 border-t border-[#eeeae0]" />
            <button
              role="menuitem"
              className="menu-item w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-left"
              style={{ color: '#b52a2a' }}
              onClick={() => {
                setOpen(false)
                setConfirmDelete(true)
              }}
            >
              <span aria-hidden="true">🗑️</span> Delete farmer
            </button>
          </div>
        </>
      )}

      {filesOpen && (
        <FilesModal
          farmerId={farmerId}
          farmerName={farmerName}
          onClose={() => setFilesOpen(false)}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(8,12,6,0.55)' }}
          onClick={() => !pending && setConfirmDelete(false)}
        >
          <div
            className="w-full max-w-[400px] rounded-2xl bg-white p-6"
            style={{ boxShadow: 'var(--shadow-lg)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading text-[1.2rem] text-[#243016]" style={{ letterSpacing: '-0.01em' }}>
              Delete {farmerName}?
            </h3>
            <p className="text-sm text-[#5a5f52] mt-2">
              This permanently removes the farmer <strong>and all their submissions, points, and
              attached files</strong>. This cannot be undone.
            </p>
            <div className="flex gap-2.5 justify-end mt-6">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setConfirmDelete(false)}
                disabled={pending}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm"
                style={{ background: '#D32F2F', color: 'white', border: '1px solid #b52a2a' }}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteFarmer(farmerId)
                    setConfirmDelete(false)
                    router.refresh()
                  })
                }
              >
                {pending ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.menu-item:hover { background: #f4f1e8; }`}</style>
    </>
  )
}

function FilesModal({
  farmerId,
  farmerName,
  onClose,
}: {
  farmerId: string
  farmerName: string
  onClose: () => void
}) {
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function loadAttachments() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/farmers/${farmerId}/attachments`)
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Failed to load files.')
      setAttachments(data.attachments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAttachments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmerId])

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch(`/api/farmers/${farmerId}/attachments`, { method: 'POST', body })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Upload failed.')
      await loadAttachments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleDelete(attachmentId: string) {
    setError('')
    try {
      const res = await fetch(`/api/farmers/${farmerId}/attachments/${attachmentId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Delete failed.')
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(8,12,6,0.55)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] max-h-[85vh] flex flex-col rounded-2xl bg-white overflow-hidden"
        style={{ boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b border-[#eeeae0] flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-[1.2rem] text-[#243016]" style={{ letterSpacing: '-0.01em' }}>
              Files — {farmerName}
            </h3>
            <p className="text-[0.8rem] text-[#8a917e] mt-0.5">Images or PDF, up to 5&nbsp;MB each</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[#6b7360] hover:bg-[#efeade]"
            style={{ border: '1px solid #e6e2d6' }}
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          <label
            className="btn btn-sm btn-secondary inline-flex items-center gap-2"
            style={{ cursor: uploading ? 'wait' : 'pointer' }}
          >
            <span aria-hidden="true">⬆️</span>
            {uploading ? 'Uploading…' : 'Upload file'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {error && (
            <div
              className="mt-3 text-sm rounded-lg px-3 py-2"
              style={{ background: '#FDECEC', color: '#b52a2a', border: '1px solid rgba(211,47,47,0.18)' }}
            >
              {error}
            </div>
          )}

          <div className="mt-4">
            {loading ? (
              <p className="text-sm text-[#8a917e] py-4">Loading files…</p>
            ) : attachments.length === 0 ? (
              <p className="text-sm text-[#8a917e] py-4">No files attached yet.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {attachments.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                    style={{ border: '1px solid #eeeae0', background: '#faf8f2' }}
                  >
                    <span aria-hidden="true" className="text-xl shrink-0">
                      {a.mimeType === 'application/pdf' ? '📄' : '🖼️'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#3d4636] truncate">{a.fileName}</p>
                      <p className="text-[0.72rem] text-[#8a917e]">
                        {formatSize(a.size)} · {new Date(a.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <a
                      href={`/api/farmers/${farmerId}/attachments/${a.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-secondary shrink-0"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(a.id)}
                      aria-label={`Delete ${a.fileName}`}
                      className="w-8 h-8 rounded-lg inline-flex items-center justify-center shrink-0"
                      style={{ border: '1px solid rgba(211,47,47,0.2)', color: '#b52a2a', background: 'white' }}
                    >
                      🗑️
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
