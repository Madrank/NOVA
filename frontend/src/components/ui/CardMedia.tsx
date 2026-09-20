import type { ImgHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CardMediaProps extends ImgHTMLAttributes<HTMLImageElement> {
  aspect?: string
}

export function CardMedia({ className, aspect = 'aspect-[4/3]', alt = '', ...props }: CardMediaProps) {
  return (
    <div className={cn('overflow-hidden', aspect, className)}>
      <img
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        alt={alt}
        {...props}
      />
    </div>
  )
}