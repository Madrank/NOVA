import { BadgeCheck, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { placeholder } from '@/lib/placeholder'
import type { PublicProfessional } from '@/types/professional'

export function ProfessionalCard({ professional }: { professional: PublicProfessional }) {
  const { firstName, lastName, title, specialties, establishment } = professional

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-white/40 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgba(18,16,14,0.45)]">
      <Link to={`/professionnel/${professional.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={placeholder({
              from: '#2b2420',
              to: '#5e1f2a',
              label: `${firstName[0]}${lastName[0]}`,
              note: title,
              labelColor: '#f5f1ea',
              noteColor: '#d4af6a',
            })}
            alt={`${firstName} ${lastName} — ${title}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">{title}</p>
        <h2 className="mt-2 font-serif text-2xl leading-snug text-noir">
          <Link to={`/professionnel/${professional.slug}`} className="inline-flex items-center gap-2 transition-colors hover:text-gold">
            {firstName} {lastName}
            <BadgeCheck className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
          </Link>
        </h2>

        {establishment ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink/60">
            <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
            {establishment.name} · {establishment.city}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          {specialties.slice(0, 3).map((specialty) => (
            <span key={specialty} className="rounded-full border border-noir/15 px-3 py-1 text-xs text-ink/70">
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-6">
          <Button to={`/professionnel/${professional.slug}`} variant="outline" size="sm" className="w-full">
            Découvrir son univers
          </Button>
        </div>
      </div>
    </article>
  )
}