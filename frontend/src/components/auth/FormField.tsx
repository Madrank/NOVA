import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helper?: string
}

export function Field({ label, error, helper, id, className, ...props }: FieldProps) {
  const inputId = id ?? props.name
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-[0.75rem] font-medium uppercase tracking-[0.18em] text-ink/70">
        {label}
      </label>
      <input
        id={inputId}
        className={cn(
          'w-full rounded-btn border bg-ivory/60 px-4 py-3.5 text-sm text-noir placeholder:text-ink/35 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gold/50',
          error ? 'border-bordeaux/60 focus:ring-bordeaux/40' : 'border-noir/15',
          className,
        )}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <p className="text-xs text-bordeaux">{error}</p> : null}
      {helper && !error ? <p className="text-xs text-ink/50">{helper}</p> : null}
    </div>
  )
}

interface FieldErrorProps {
  message?: string | null
}

export function FormError({ message }: FieldErrorProps) {
  if (!message) {
    return null
  }
  return (
    <p role="alert" className="rounded-btn border border-bordeaux/30 bg-bordeaux/5 px-4 py-3 text-sm text-bordeaux">
      {message}
    </p>
  )
}