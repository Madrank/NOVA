import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

const navLinks = [
  { label: 'Découvrir', href: '#categories' },
  { label: 'Expériences', href: '#signature' },
  { label: 'Professionnels', href: '#professionnels' },
  { label: 'À propos', href: '#concept' },
]

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
        <a
          href="#top"
          className={cn(
            'font-serif text-2xl tracking-[0.3em] transition-colors duration-300',
            solid ? 'text-noir' : 'text-ivory',
          )}
          aria-label="NOVA — retour en haut de page"
        >
          NOVA
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'text-[0.75rem] font-medium uppercase tracking-[0.22em] transition-colors duration-300',
                  solid ? 'text-ink/80 hover:text-gold' : 'text-ivory/85 hover:text-gold-light',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <Button
            href="#connection"
            variant={solid ? 'ghost' : 'ghost'}
            className={cn(!solid && 'text-ivory hover:text-gold-light')}
          >
            Connexion
          </Button>
          <Button href="#recherche" variant={solid ? 'primary' : 'light'}>
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
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index + 0.1, duration: 0.45 }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-4xl text-ivory transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3">
              <Button href="#connection" variant="ghost" className="text-ivory hover:text-gold-light">
                Connexion
              </Button>
              <Button href="#recherche" variant="light" onClick={() => setMenuOpen(false)}>
                Réserver une expérience
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}