import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

const stats = [
  { value: '+120', label: 'établissements partenaires' },
  { value: '4,9/5', label: 'note moyenne des expériences' },
  { value: '< 1 min', label: 'pour réserver' },
]

export function Concept() {
  return (
    <section id="concept" className="scroll-mt-24 bg-noir py-24 text-ivory lg:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <Reveal>
              <Badge className="mb-6 text-gold-light">
                <span className="h-px w-7 bg-gold" aria-hidden="true" />
                Le concept
              </Badge>
              <h2 className="font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
                « Le temps, enfin. La réservation en quelques gestes, le soin durant une heure,{' '}
                <em className="italic text-gold-light">la sensation des jours.</em> »
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1}>
              <p className="text-base leading-relaxed text-ivory/70">
                NOVA est né d'une conviction : le bien-être ne devrait jamais être une
                formalité. Nous avons réuni des professionnels exigeants, une réservation
                limpide et des lieux pensés pour l'apaisement — pour que votre seule
                décision reste celle du moment qu'il vous faut.
              </p>
              <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-ivory/15 pt-10 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="order-2 mt-2 block text-xs uppercase tracking-[0.2em] text-ivory/50">
                      {stat.label}
                    </dt>
                    <dd className="font-serif text-3xl text-gold-light">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}