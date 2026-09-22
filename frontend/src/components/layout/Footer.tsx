import { Link } from 'react-router-dom'
import { categories } from '@/data/services'
import { Container } from '@/components/ui/Container'

const explore = [
  ...categories.map((category) => ({
    label: category.name,
    to: `/experiences?categorie=${category.slug}`,
  })),
  { label: 'Coffrets cadeaux', to: '/experiences' },
]

const company = [
  { label: 'À propos', href: '#concept' },
  { label: 'Professionnels', href: '#professionnels' },
  { label: 'Devenir partenaire', href: '#professionnels' },
  { label: 'Contact', href: '#connection' },
]

const socials = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: '#',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="bg-noir text-ivory">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-3xl tracking-[0.3em]">NOVA</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ivory/60">
              Plateforme de réservation dédiée au bien-être et à la beauté. Des expériences
              d'exception, choisies avec soin, à vivre à deux ou pour soi.
            </p>
            <div className="mt-7 flex items-center gap-4">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ivory/20 text-ivory/70 transition-colors duration-300 hover:border-gold hover:text-gold-light"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 lg:col-start-6">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold">
              Explorer
            </p>
            <ul className="mt-5 space-y-3">
              {explore.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm text-ivory/70 transition-colors duration-300 hover:text-gold-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold">
              NOVA
            </p>
            <ul className="mt-5 space-y-3">
              {company.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-ivory/70 transition-colors duration-300 hover:text-gold-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-ivory/40">© {new Date().getFullYear()} NOVA. Tous droits réservés.</p>
          <div className="flex items-center gap-6 text-xs text-ivory/40">
            <a href="#" className="transition-colors hover:text-gold-light">Mentions légales</a>
            <a href="#" className="transition-colors hover:text-gold-light">Confidentialité</a>
            <a href="#" className="transition-colors hover:text-gold-light">CGU</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}