'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteFarmer } from '@/app/dashboard/farmers/actions'

export default function DeleteFarmerButton({
  farmerId,
  farmerName,
}: {
  farmerId: string
  farmerName: string
}) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [pending, startTransition] = useTransition()

  return (
    <>
      <button
        className="btn btn-sm"
        style={{ background: 'rgba(211,47,47,0.14)', color: '#ffd7d0', border: '1px solid rgba(211,47,47,0.4)' }}
        onClick={() => setConfirm(true)}
      >
        🗑️ Delete
      </button>

      {confirm && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: 'rgba(8,12,6,0.55)' }}
          onClick={() => !pending && setConfirm(false)}
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
              <button className="btn btn-sm btn-secondary" onClick={() => setConfirm(false)} disabled={pending}>
                Cancel
              </button>
              <button
                className="btn btn-sm"
                style={{ background: '#D32F2F', color: 'white', border: '1px solid #b52a2a' }}
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteFarmer(farmerId)
                    router.push('/dashboard/farmers')
                  })
                }
              >
                {pending ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
