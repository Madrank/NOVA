import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProfessionalCard } from '@/components/professionals/ProfessionalCard'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { placeholder } from '@/lib/placeholder'
import { establishmentsApi } from '@/services/professionals'
import type { EstablishmentDetail } from '@/types/establishment'

export function EstablishmentDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const key = slug ?? ''
  const [loaded, setLoaded] = useState<{ key: string; data: EstablishmentDetail | null; error: boolean }>({
    key: '',
    data: null,
    error: false,
  })

  const error = loaded.key === key && loaded.error
  const data = loaded.key === key ? loaded.data : null

  useEffect(() => {
    let cancelled = false
    establishmentsApi
      .detail(key)
      .then((result) => {
        if (cancelled) return
        setLoaded({ key, data: result, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setLoaded({ key, data: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [key])

  if (error) {
    return <Navigate to="/introuvable" replace />
  }

  if (!data) {
    return (
      <main id="contenu" className="min-h-screen bg-ivory py-32">
        <Container size="narrow">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-7 h-10 w-72" />
          <Skeleton className="mt-9 aspect-[16/10] w-full" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Container>
      </main>
    )
  }

  const { establishment, professionals } = data

  return (
    <main id="contenu" className="bg-ivory">
      <nav aria-label="Fil d'Ariane" className="border-b border-noir/10">
        <Container className="flex items-center gap-2 py-4 text-xs text-ink/60">
          <Link to="/etablissements" className="transition-colors hover:text-gold">
            Établissements
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-noir">{establishment.name}</span>
        </Container>
      </nav>

      <Container as="div" className="py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <img
                src={placeholder({
                  from: '#24201c',
                  to: '#b98a3e',
                  label: establishment.name,
                  note: establishment.address.city,
                  labelColor: '#f5f1ea',
                  noteColor: '#d4af6a',
                })}
                alt={establishment.name}
                className="aspect-[16/10] w-full rounded-card object-cover"
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-10 max-w-2xl">
                {establishment.tagline ? (
                  <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
                    {establishment.tagline}
                  </p>
                ) : null}
                <h1 className="mt-3 font-serif text-4xl leading-[1.08] text-noir sm:text-5xl">
                  {establishment.name}
                </h1>
                <p className="mt-6 text-base leading-relaxed text-ink/75">{establishment.description}</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
                <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">Accès & contact</h2>
                <address className="mt-4 space-y-3 not-italic text-sm text-ink/70">
                  <p className="inline-flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      {establishment.address.street}
                      <br />
                      {establishment.address.postalCode} {establishment.address.city}
                    </span>
                  </p>
                  {establishment.phone ? (
                    <Link
                      to={`tel:${establishment.phone}`}
                      className="inline-flex items-center gap-2.5 transition-colors hover:text-gold"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                      {establishment.phone}
                    </Link>
                  ) : null}
                  {establishment.email ? (
                    <Link
                      to={`mailto:${establishment.email}`}
                      className="inline-flex items-center gap-2.5 transition-colors hover:text-gold"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                      {establishment.email}
                    </Link>
                  ) : null}
                </address>
              </div>
            </Reveal>
          </div>
        </div>

        <section className="mt-16" aria-label="Praticiens sur place">
          <Reveal>
            <h2 className="font-serif text-3xl text-noir sm:text-4xl">
              Les praticiens <em className="italic text-gold">sur place</em>
            </h2>
          </Reveal>
          {professionals.length > 0 ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {professionals.map((professional) => (
                <li key={professional.id}>
                  <ProfessionalCard professional={professional} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-sm text-ink/60">
              Les praticiens de cet établissement arrivent bientôt sur NOVA.
            </p>
          )}
        </section>
      </Container>
    </main>
  )
}