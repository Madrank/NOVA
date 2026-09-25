import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

interface AuthShellProps {
  kicker: string
  title: string
  description?: string
  children: ReactNode
}

export function AuthShell({ kicker, title, description, children }: AuthShellProps) {
  return (
    <main id="contenu" className="min-h-screen bg-ivory">
      <Container size="narrow" className="flex min-h-screen flex-col justify-center py-32">
        <Link
          to="/"
          className="self-start font-serif text-xl tracking-[0.3em] text-noir transition-colors hover:text-gold"
          aria-label="NOVA — retour à l'accueil"
        >
          NOVA
        </Link>
        <div className="mt-12">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold">{kicker}</p>
          <h1 className="mt-3 font-serif text-4xl text-noir sm:text-5xl">{title}</h1>
          {description ? <p className="mt-4 max-w-md text-ink/70">{description}</p> : null}
          <div className="mt-10">{children}</div>
        </div>
      </Container>
    </main>
  )
}