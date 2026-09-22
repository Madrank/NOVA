import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function NotFoundPage() {
  return (
    <main id="contenu" className="flex min-h-svh items-center justify-center bg-noir text-ivory">
      <Container className="py-32 text-center">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold-light">
          Erreur 404
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">
          Cette page s'est égarée.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/70">
          Le chemin demandé n'existe pas ou a été déplacé. Revenez au commencement : tout
          commence par une expérience.
        </p>
        <div className="mt-9">
          <Button to="/" variant="light" size="lg">
            Retour à l'accueil
          </Button>
        </div>
      </Container>
    </main>
  )
}