import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'light' | 'outline' | 'ghost' | 'bordeaux'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-noir text-ivory hover:bg-gold hover:text-noir',
  light: 'bg-ivory text-noir hover:bg-gold-light hover:text-noir',
  outline:
    'border border-noir/30 bg-transparent text-noir hover:border-noir hover:bg-noir hover:text-ivory',
  ghost: 'bg-transparent text-noir hover:text-gold',
  bordeaux: 'bg-bordeaux text-ivory hover:bg-noir hover:text-ivory',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2.5 text-[0.6875rem]',
  md: 'px-6 py-3.5 text-[0.75rem]',
  lg: 'px-8 py-4 text-[0.8125rem]',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-btn font-sans font-medium uppercase tracking-[0.18em] transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50'

interface ButtonBaseProps {
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonProps = ButtonBaseProps &
  ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>) | ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className)

  if ('href' in props) {
    return <a className={classes} {...props} />
  }

  return <button className={classes} {...props} />
}