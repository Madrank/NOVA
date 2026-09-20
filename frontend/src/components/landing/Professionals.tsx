import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const professionals = [
  { name: 'Clara Moreau', specialty: 'Spa & rituels', city: 'Paris', initials: 'CM' },
  { name: 'Elena Vasquez', specialty: 'Massage signature', city: 'Lyon', initials: 'EV' },
  { name: 'Nathan Berthier', specialty: 'Yoga & méditation', city: 'Bordeaux', initials: 'NB' },
  { name: 'Ambre Lefèvre', specialty: 'Soins du visage', city: 'Nice', initials: 'AL' },
]

export function Professionals() {
  return (
    <section id="professionnels" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            overline="Les professionnels"
            title={
              <>
                Des praticiens d'exception,{' '}
                <em className="italic text-gold">partout en France.</em>
              </>
            }
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {professionals.map((pro, index) => (
            <Reveal key={pro.name} delay={0.06 * index}>
              <article className="group flex h-full flex-col rounded-card border border-noir/10 bg-white/40 p-7 transition-colors duration-300 hover:border-gold/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-noir font-serif text-lg tracking-wider text-gold-light">
                  {pro.initials}
                </div>
                <h3 className="mt-6 font-serif text-2xl text-noir">{pro.name}</h3>
                <p className="mt-1 text-sm text-ink/60">{pro.specialty}</p>
                <p className="mt-5 flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-gold">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {pro.city}
                </p>
                <a
                  href="#recherche"
                  className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-noir transition-colors duration-300 group-hover:text-gold"
                >
                  Réserver avec {pro.name.split(' ')[0]}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-12 text-center">
            <Button href="#recherche" variant="ghost" className="text-ink hover:text-gold">
              Tous les professionnels
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}