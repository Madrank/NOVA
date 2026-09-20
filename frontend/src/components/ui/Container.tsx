import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ContainerSize = 'default' | 'wide' | 'narrow'

const sizeClasses: Record<ContainerSize, string> = {
  default: 'max-w-[76rem]',
  wide: 'max-w-[88rem]',
  narrow: 'max-w-[52rem]',
}

interface ContainerProps {
  children: ReactNode
  as?: 'div' | 'section' | 'header' | 'footer' | 'main'
  size?: ContainerSize
  className?: string
}

export function Container({
  children,
  as: Tag = 'div',
  size = 'default',
  className,
}: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', sizeClasses[size], className)}>
      {children}
    </Tag>
  )
}