import { BadgeCheck, ChevronRight, MapPin, Undo2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { placeholder } from '@/lib/placeholder'
import { professionalsApi } from '@/services/professionals'
import type { PublicProfessional } from '@/types/professional'

export function ProfessionalDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const key = slug ?? ''
  const [loaded, setLoaded] = useState<{
    key: string
    professional: PublicProfessional | null
    error: boolean
  }>({ key: '', professional: null, error: false })

  const error = loaded.key === key && loaded.error
  const professional = loaded.key === key ? loaded.professional : null

  useEffect(() => {
    let cancelled = false
    professionalsApi
      .detail(key)
      .then(({ professional: data }) => {
        if (cancelled) return
        setLoaded({ key, professional: data, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setLoaded({ key, professional: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [key])

  if (error) {
    return <Navigate to="/introuvable" replace />
  }

  if (!professional) {
    return (
      <main id="contenu" className="min-h-screen bg-ivory py-32">
        <Container size="narrow">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-7 h-10 w-72" />
          <Skeleton className="mt-9 aspect-[16/10] w-full" />
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Container>
      </main>
    )
  }

  const { firstName, lastName, title, bio, specialties, establishment } = professional

  return (
    <main id="contenu" className="bg-ivory">
      <nav aria-label="Fil d'Ariane" className="border-b border-noir/10">
        <Container className="flex items-center gap-2 py-4 text-xs text-ink/60">
          <Link to="/professionnels" className="transition-colors hover:text-gold">
            Professionnels
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-noir">
            {firstName} {lastName}
          </span>
        </Container>
      </nav>

      <Container as="div" className="py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
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
                className="aspect-[16/10] w-full rounded-card object-cover"
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-10 max-w-2xl">
                <p className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">{title}</p>
                <h1 className="mt-3 inline-flex items-center gap-3 font-serif text-4xl leading-[1.08] text-noir sm:text-5xl">
                  {firstName} {lastName}
                  <BadgeCheck className="h-8 w-8 shrink-0 text-gold" aria-hidden="true" />
                </h1>

                <div className="mt-5 flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <span key={specialty} className="rounded-full border border-noir/15 px-3 py-1 text-xs text-ink/70">
                      {specialty}
                    </span>
                  ))}
                </div>

                <p className="mt-6 text-base leading-relaxed text-ink/75">{bio}</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
                <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
                  Lieu de pratique
                </h2>
                {establishment ? (
                  <Link to={`/etablissement/${establishment.slug}`} className="group mt-4 block">
                    <p className="font-serif text-2xl text-noir transition-colors group-hover:text-gold">
                      {establishment.name}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/60">
                      <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                      {establishment.city}
                    </p>
                  </Link>
                ) : (
                  <p className="mt-4 text-sm text-ink/60">Praticien indépendant — contact disponible bientôt.</p>
                )}

                <div className="mt-7 border-t border-noir/10 pt-6">
                  <Button size="lg" className="w-full" disabled>
                    Réserver un soin
                  </Button>
                  <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
                    La réservation auprès des praticiens arrive avec le module de réservation.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-10">
          <Button to="/professionnels" variant="ghost" className="text-ink hover:text-gold">
            <Undo2 className="h-4 w-4" aria-hidden="true" />
            Tous les professionnels
          </Button>
        </div>
      </Container>
    </main>
  )
}