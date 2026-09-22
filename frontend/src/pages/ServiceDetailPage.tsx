import { ArrowLeft, BadgeCheck, ChevronRight, Clock3, Gift, MapPin, Sparkles, Star, Users } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ServiceCard } from '@/components/catalog/ServiceCard'
import { getCategory, getEstablishment, services } from '@/data/services'
import { placeholder } from '@/lib/placeholder'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const service = services.find((item) => item.slug === slug)

  if (!service) {
    return <Navigate to="/introuvable" replace />
  }

  const category = getCategory(service.category)
  const establishment = getEstablishment(service.establishmentSlug)
  const related = services
    .filter((item) => item.category === service.category && item.slug !== service.slug)
    .slice(0, 3)

  return (
    <main id="contenu" className="bg-ivory">
      <nav aria-label="Fil d'Ariane" className="border-b border-noir/10">
        <Container className="flex items-center gap-2 py-4 text-xs text-ink/60">
          <Link to="/experiences" className="transition-colors hover:text-gold">
            Expériences
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-noir">{service.name}</span>
        </Container>
      </nav>

      <Container as="div" className="py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <img
                src={placeholder({
                  from: service.imageFrom,
                  to: service.imageTo,
                  label: category?.name ?? 'NOVA',
                  note: `${service.durationMinutes} min · ${establishment?.city}`,
                  labelColor: '#f5f1ea',
                  noteColor: '#d4af6a',
                })}
                alt={`${service.name} — ${category?.name ?? ''} chez ${establishment?.name}`}
                className="aspect-[16/10] w-full rounded-card object-cover"
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="gold">{category?.name}</Badge>
                  {service.duo ? <Badge tone="bordeaux">En duo</Badge> : null}
                  {service.giftable ? <Badge tone="outline">Offrable</Badge> : null}
                </div>
                <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-noir sm:text-5xl">
                  {service.name}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-ink/70">{service.summary}</p>
                <p className="mt-6 text-base leading-relaxed text-ink/75">{service.description}</p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="mt-12" aria-label="Le lieu et la praticienne">
                <div className="grid gap-4 rounded-card border border-noir/10 bg-white/40 p-7 sm:grid-cols-2">
                  <div>
                    <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
                      L'établissement
                    </h2>
                    <p className="mt-2 font-serif text-2xl text-noir">{establishment?.name}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/60">
                      <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                      {establishment?.district} · {establishment?.city}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
                      La praticienne
                    </h2>
                    <p className="mt-2 inline-flex items-center gap-2 font-serif text-2xl text-noir">
                      {service.professionalName}
                      <BadgeCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/60">
                      <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                      {service.rating.toLocaleString('fr-FR')} · {service.reviewsCount} avis
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="mt-12" aria-label="Bon à savoir">
                <h2 className="font-serif text-2xl text-noir">Bon à savoir</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    'Créneau confirmé en temps réel par l’établissement',
                    'Annulation gratuite jusqu’à 24 h avant',
                    'Serviettes et infusion comprises',
                    'Accessible dès une première réservation',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink/75">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-ink/50">À partir de</p>
                    <p className="mt-1 font-serif text-5xl text-noir">{formatPrice(service.price)}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink/70">
                    <Clock3 className="h-4 w-4 text-gold" aria-hidden="true" />
                    {service.durationMinutes} min
                  </span>
                </div>

                <div className="mt-7 space-y-2.5 border-t border-noir/10 pt-6 text-sm text-ink/70">
                  <p className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <Users className="h-4 w-4 text-gold" aria-hidden="true" />
                      Format
                    </span>
                    <span className="text-noir">{service.duo ? 'Duo' : 'Individuel'}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <Gift className="h-4 w-4 text-gold" aria-hidden="true" />
                      Coffret cadeau
                    </span>
                    <span className="text-noir">{service.giftable ? 'Disponible' : 'Sur demande'}</span>
                  </p>
                  <p className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                      Lieu
                    </span>
                    <span className="text-noir">{establishment?.city}</span>
                  </p>
                </div>

                <Button size="lg" className="mt-8 w-full" disabled>
                  Choisir une date
                </Button>
                <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
                  Le choix du créneau et le paiement arrivent avec le module de réservation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <section className="bg-ivory-deep/60 py-16 lg:py-24" aria-label="Expériences similaires">
          <Container>
            <Reveal>
              <h2 className="font-serif text-3xl text-noir sm:text-4xl">
                Dans le même <em className="italic text-gold">univers</em>
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.slug} service={item} />
              ))}
            </div>
            <div className="mt-10">
              <Button to="/experiences" variant="ghost" className="text-ink hover:text-gold">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Retour au catalogue
              </Button>
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  )
}