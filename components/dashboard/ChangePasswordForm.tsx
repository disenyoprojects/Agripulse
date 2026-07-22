'use client'

import { useState, useTransition } from 'react'
import { changePassword } from '@/app/dashboard/settings/actions'

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function ChangePasswordForm() {
  const [fields, setFields] = useState(EMPTY)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [pending, startTransition] = useTransition()

  function set(field: keyof typeof EMPTY, value: string) {
    setFields((prev) => ({ ...prev, [field]: value }))
    setError('')
    setSuccess(false)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setSuccess(false)
    startTransition(async () => {
      const result = await changePassword(fields)
      if (result.success) {
        setSuccess(true)
        setFields(EMPTY)
      } else {
        setError(result.error ?? 'May nangyaring mali.')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field
        id="currentPassword"
        label="Kasalukuyang Password"
        value={fields.currentPassword}
        onChange={(v) => set('currentPassword', v)}
        autoComplete="current-password"
      />
      <Field
        id="newPassword"
        label="Bagong Password"
        value={fields.newPassword}
        onChange={(v) => set('newPassword', v)}
        autoComplete="new-password"
        hint="Hindi bababa sa 8 karakter"
      />
      <Field
        id="confirmPassword"
        label="Ulitin ang Bagong Password"
        value={fields.confirmPassword}
        onChange={(v) => set('confirmPassword', v)}
        autoComplete="new-password"
      />

      {error && (
        <p
          className="text-sm rounded-xl px-3.5 py-2.5"
          role="alert"
          style={{ color: '#8a3527', background: '#fdecec', border: '1px solid rgba(211,47,47,0.18)' }}
        >
          {error}
        </p>
      )}
      {success && (
        <p
          className="text-sm rounded-xl px-3.5 py-2.5"
          role="status"
          style={{ color: '#1e6b24', background: '#ebf5ec', border: '1px solid rgba(46,125,50,0.18)' }}
        >
          ✓ Na-update ang iyong password.
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary w-full mt-1">
        {pending ? 'Ini-save…' : 'I-update ang Password'}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  autoComplete,
  hint,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  autoComplete: string
  hint?: string
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.75rem] font-bold text-[#2e4321] uppercase tracking-wider mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type="password"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field-input w-full"
        placeholder="••••••••"
        autoComplete={autoComplete}
      />
      {hint && <p className="text-[0.72rem] text-[#8a917e] mt-1">{hint}</p>}
    </div>
  )
}
