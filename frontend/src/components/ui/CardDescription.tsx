import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={cn('text-[0.9375rem] leading-relaxed text-ink/70', className)} {...props} />
}