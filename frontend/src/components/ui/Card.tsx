import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('group overflow-hidden rounded-card bg-ivory-deep/60', className)}
      {...props}
    />
  )
}