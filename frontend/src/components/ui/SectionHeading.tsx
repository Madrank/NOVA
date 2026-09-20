import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Badge } from '@/components/ui/Badge'

interface SectionHeadingProps {
  overline: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  overline,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      <Badge className="mb-5">
        <span className="h-px w-7 bg-gold" aria-hidden="true" />
        {overline}
      </Badge>
      <h2 className="font-serif text-4xl leading-[1.1] text-noir sm:text-5xl lg:text-[3.5rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-6 text-base leading-relaxed text-ink/70 sm:text-lg">{description}</p>
      ) : null}
    </div>
  )
}