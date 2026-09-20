import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'gold' | 'noir' | 'bordeaux' | 'outline'

const toneClasses: Record<Tone, string> = {
  gold: 'text-gold',
  noir: 'text-noir',
  bordeaux: 'text-bordeaux',
  outline: 'border-b border-noir/30 text-noir',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

export function Badge({ className, tone = 'gold', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.28em]',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}