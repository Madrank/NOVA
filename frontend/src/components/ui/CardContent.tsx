import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 lg:p-8', className)} {...props} />
}