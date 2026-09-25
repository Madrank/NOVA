import { MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { placeholder } from '@/lib/placeholder'
import type { PublicEstablishment } from '@/types/establishment'

export function EstablishmentCard({ establishment }: { establishment: PublicEstablishment }) {
  const { slug, name, tagline, address } = establishment

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-white/40 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-22px_rgba(18,16,14,0.45)]">
      <Link to={`/etablissement/${slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={placeholder({
              from: '#24201c',
              to: '#b98a3e',
              label: name,
              note: address.city,
              labelColor: '#f5f1ea',
              noteColor: '#d4af6a',
            })}
            alt={`${name} — ${address.city}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-serif text-2xl leading-snug text-noir">
          <Link to={`/etablissement/${slug}`} className="transition-colors hover:text-gold">
            {name}
          </Link>
        </h2>

        {tagline ? (
          <p className="mt-2 text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">{tagline}</p>
        ) : null}

        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-ink/60">
          <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
          {address.street} · {address.postalCode} {address.city}
        </p>

        <div className="mt-auto pt-6">
          <Button to={`/etablissement/${slug}`} variant="outline" size="sm" className="w-full">
            Visiter
          </Button>
        </div>
      </div>
    </article>
  )
}