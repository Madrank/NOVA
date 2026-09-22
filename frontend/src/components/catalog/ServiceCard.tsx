import { ArrowRight, Clock3, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { getCategory, getEstablishment } from '@/data/services'
import { placeholder } from '@/lib/placeholder'
import type { Service } from '@/types/service'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const category = getCategory(service.category)
  const establishment = getEstablishment(service.establishmentSlug)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-ivory-deep/60 transition-transform duration-500 ease-out">
      <Link
        to={`/experiences/${service.slug}`}
        aria-label={`Voir ${service.name}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={placeholder({
            from: service.imageFrom,
            to: service.imageTo,
            label: category?.name ?? 'NOVA',
            note: `${service.durationMinutes} min`,
            labelColor: '#f5f1ea',
            noteColor: '#d4af6a',
          })}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-noir/45 to-transparent"
          aria-hidden="true"
        />
        {service.duo ? (
          <Badge tone="noir" className="absolute left-4 top-4 rounded-btn bg-noir/75 px-3 py-1.5 text-ivory">
            En duo
          </Badge>
        ) : null}
        {service.giftable ? (
          <Badge className="absolute right-4 top-4 rounded-btn bg-ivory/85 px-3 py-1.5 text-bordeaux">
            Offrable
          </Badge>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <div className="flex items-center justify-between gap-3">
          <Badge tone="gold">{category?.name}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-ink/70">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
            {service.rating.toLocaleString('fr-FR')}
            <span className="text-ink/40">({service.reviewsCount})</span>
          </span>
        </div>

        <h3 className="mt-4 font-serif text-2xl text-noir">
          <Link
            to={`/experiences/${service.slug}`}
            className="transition-colors duration-300 hover:text-gold"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{service.summary}</p>

        <div className="mt-5 flex items-center gap-4 text-xs text-ink/60">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {establishment?.city}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {service.durationMinutes} min
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-6">
          <p className="font-serif text-2xl text-noir">
            {formatPrice(service.price)}
            <span className="ml-1 text-xs font-sans text-ink/50">TTC</span>
          </p>
          <Link
            to={`/experiences/${service.slug}`}
            className="inline-flex items-center gap-2 text-[0.75rem] font-medium uppercase tracking-[0.2em] text-noir transition-colors duration-300 hover:text-gold"
          >
            Découvrir
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}