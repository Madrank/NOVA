import { Quote } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'

const testimonials = [
  {
    quote:
      "Un moment suspendu, du premier appel à la sortie du soin. On ne réserve pas une prestation, on réserve une parenthèse.",
    name: 'Julie M.',
    detail: 'Massage entre deux mondes · Paris',
  },
  {
    quote:
      "Le rituel en duo fut d'une douceur rare. Tout était prévu, rien n'était surchargé : l'écrin, les gestes, le thé servi au réveil.",
    name: 'Karim & Sofia',
    detail: 'Escape thermale · Lyon',
  },
  {
    quote:
      'La recherche, la disponibilité, le paiement : trois gestes. Puis une heure à ne plus penser à rien. On recommande sans réserve.',
    name: 'Élodie R.',
    detail: 'Soin du visage signature · Nice',
  },
]

export function Testimonials() {
  return (
    <section className="bg-ivory py-24 lg:py-36">
      <Container>
        <Reveal>
          <Badge className="mb-5">
            <span className="h-px w-7 bg-gold" aria-hidden="true" />
            Ils ont pris le temps
          </Badge>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={0.07 * index}>
              <figure className="flex h-full flex-col rounded-card border border-noir/10 bg-white/40 p-8 lg:p-9">
                <Quote
                  className="h-7 w-7 text-gold"
                  aria-hidden="true"
                />
                <blockquote className="mt-5 flex-1 font-serif text-xl leading-relaxed text-noir">
                  {testimonial.quote}
                </blockquote>
                <figcaption className="mt-7 border-t border-noir/10 pt-5">
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-ink">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-xs text-ink/50">{testimonial.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}