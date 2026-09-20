import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { placeholder, visual } from '@/lib/placeholder'

const signatureItems = [
  {
    title: 'Soins signature',
    description: 'Des protocoles exclusifs, construits avec chaque partenaire.',
  },
  {
    title: 'Rituels en duo',
    description: "Des expériences à partager, pensées pour deux.",
  },
  {
    title: 'Coffrets cadeaux',
    description: "Offrir une parenthèse, c'est offrir du temps.",
  },
]

export function Showcase() {
  const media = placeholder(visual.signature)

  return (
    <section id="signature" className="scroll-mt-24 bg-ivory-deep py-24 lg:py-36">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <div className="relative">
              <div
                className="absolute -left-4 -top-4 h-full w-full rounded-card border border-gold/40"
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                <img
                  src={media}
                  alt="Expériences signature NOVA"
                  width={1600}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal>
              <Badge className="mb-5">
                <span className="h-px w-7 bg-gold" aria-hidden="true" />
                Signature
              </Badge>
              <h2 className="font-serif text-4xl leading-[1.1] text-noir sm:text-5xl">
                Des expériences d'exception,{' '}
                <em className="italic text-gold">réservées à peu d'élus.</em>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink/70">
                Chaque établissement de NOVA est sélectionné pour la justesse de son geste,
                la qualité de son écrin et l'attention portée au détail.
              </p>
            </Reveal>

            <ul className="mt-10 space-y-7">
              {signatureItems.map((item, index) => (
                <Reveal key={item.title} delay={0.08 * index}>
                  <li className="flex items-start gap-4">
                    <span
                      className="mt-2 h-px w-10 shrink-0 bg-gold"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="font-serif text-xl text-noir">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">
                        {item.description}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <div className="mt-10">
                <Button href="#recherche" variant="outline" size="lg">
                  Découvrir les expériences
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}