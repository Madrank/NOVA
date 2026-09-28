import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { HashLink } from '@/components/ui/HashLink'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { cn } from '@/lib/cn'

interface NavLink {
  label: string
  hash?: string
  to?: string
}

const navLinks: NavLink[] = [
  { label: 'Découvrir', hash: 'categories' },
  { label: 'Expériences', to: '/experiences' },
  { label: 'Professionnels', hash: 'professionnels' },
  { label: 'À propos', hash: 'concept' },
]

function SessionActions({
  solid,
  compact,
  onNavigate,
}: {
  solid: boolean
  compact?: boolean
  onNavigate?: () => void
}) {
  const { status, user, logout } = useAuth()

  if (status === 'authenticated' && user) {
    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    return (
      <div className={cn('flex items-center gap-3', compact && 'flex-col items-stretch gap-3')}>
        <NotificationBell key={status} solid={solid} onNavigate={onNavigate} />
        <Link
          to={user.role === 'professional' ? '/tableau-de-bord' : user.role === 'admin' ? '/admin' : '/compte'}
          onClick={onNavigate}
          className={cn(
            'inline-flex items-center gap-2 rounded-btn px-2 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300',
            solid ? 'text-ink/80 hover:text-gold' : 'text-ivory/85 hover:text-gold-light',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full font-serif text-sm',
              solid ? 'bg-noir text-ivory' : 'bg-ivory text-noir',
            )}
          >
            {initials}
          </span>
          {user.role === 'professional' ? 'Tableau de bord' : user.role === 'admin' ? 'Back-office' : 'Mon compte'}
        </Link>
        <Button
          onClick={() => {
            logout()
            onNavigate?.()
          }}
          variant={solid ? 'ghost' : 'ghost'}
          className={cn(!solid && 'text-ivory hover:text-gold-light')}
        >
          Déconnexion
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-4', compact && 'flex-col items-stretch gap-3')}>
      <Button
        to="/connexion"
        onClick={onNavigate}
        variant={solid ? 'ghost' : 'ghost'}
        className={cn(!solid && 'text-ivory hover:text-gold-light')}
      >
        Connexion
      </Button>
      {compact ? null : (
        <Button
          to="/inscription"
          onClick={onNavigate}
          variant="outline"
          className={cn(
            !solid && 'border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory hover:text-noir',
          )}
        >
          S'inscrire
        </Button>
      )}
    </div>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const solid = scrolled && !menuOpen

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: solid ? 'rgba(245, 241, 234, 0.92)' : 'rgba(18, 16, 14, 0)',
        color: solid ? '#1c1917' : '#f5f1ea',
      }}
      transition={{ duration: 0.35 }}
      className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
    >
      <nav aria-label="Navigation principale" className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <HashLink
          hash="top"
          className={cn(
            'font-serif text-2xl tracking-[0.3em] transition-colors duration-300',
            solid ? 'text-noir' : 'text-ivory',
          )}
          aria-label="NOVA — retour en haut de page"
        >
          NOVA
        </HashLink>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              {link.to ? (
                <Link
                  to={link.to}
                  className={cn(
                    'text-[0.75rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300',
                    solid ? 'text-ink/80 hover:text-gold' : 'text-ivory/85 hover:text-gold-light',
                  )}
                >
                  {link.label}
                </Link>
              ) : link.hash ? (
                <HashLink
                  hash={link.hash}
                  className={cn(
                    'text-[0.75rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300',
                    solid ? 'text-ink/80 hover:text-gold' : 'text-ivory/85 hover:text-gold-light',
                  )}
                >
                  {link.label}
                </HashLink>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <SessionActions solid={solid} />
          <Button to="/experiences" variant={solid ? 'primary' : 'light'}>
            Réserver
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          className={cn(
            'inline-flex p-2 transition-colors duration-300 lg:hidden',
            solid ? 'text-noir' : 'text-ivory',
          )}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 -z-10 flex flex-col bg-noir px-5 pb-10 pt-28 lg:hidden"
          >
            <ul className="space-y-6">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index + 0.1, duration: 0.45 }}
                >
                  {link.to ? (
                    <Link
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-4xl text-ivory transition-colors hover:text-gold-light"
                    >
                      {link.label}
                    </Link>
                  ) : link.hash ? (
                    <HashLink
                      hash={link.hash}
                      onClick={() => setMenuOpen(false)}
                      className="font-serif text-4xl text-ivory transition-colors hover:text-gold-light"
                    >
                      {link.label}
                    </HashLink>
                  ) : null}
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <SessionActions solid={false} compact onNavigate={() => setMenuOpen(false)} />
              <Button to="/experiences" variant="light" onClick={() => setMenuOpen(false)}>
                Réserver une expérience
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}