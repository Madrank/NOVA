import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

export function CtaBanner() {
  return (
    <section id="reserver" className="scroll-mt-24 bg-bordeaux py-20 text-ivory lg:py-28">
      <Container className="text-center">
        <Reveal>
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold-light">
            Réservez maintenant
          </p>
          <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-[1.1] sm:text-5xl">
            Prenez le temps. <em className="italic text-gold-light">Nous nous occupons du reste.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ivory/75">
            Dispositifs, disponibilités, confirmation : la réservation de votre prochaine
            expérience commence en quelques gestes.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Button href="#recherche" variant="light" size="lg">
              Réserver une expérience
            </Button>
            <Button href="#signature" variant="ghost" size="lg" className="text-ivory hover:text-gold-light">
              Voir les coffrets cadeaux
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}