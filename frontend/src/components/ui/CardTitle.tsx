import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cn('font-serif text-2xl leading-snug text-noir', className)} {...props} />
}