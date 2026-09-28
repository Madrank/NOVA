import type { AnchorHTMLAttributes, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface HashLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  hash: string
  children?: ReactNode
}

export function HashLink({ hash, children, onClick, className, ...props }: HashLinkProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const target = hash.startsWith('#') ? hash : `#${hash}`

  function handleClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented) return
    event.preventDefault()
    if (location.pathname === '/') {
      const element = document.getElementById(target.slice(1))
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.replaceState(null, '', target)
    } else {
      navigate(`/${target}`)
    }
  }

  return (
    <a href={target} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}