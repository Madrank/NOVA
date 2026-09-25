import { SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EstablishmentCard } from '@/components/establishments/EstablishmentCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'
import { establishmentsApi } from '@/services/professionals'
import type { PublicEstablishment } from '@/types/establishment'

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-card bg-ivory-deep/60">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EstablishmentsPage() {
  const [establishments, setEstablishments] = useState<PublicEstablishment[] | null>(null)
  const [error, setError] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let cancelled = false
    establishmentsApi
      .list()
      .then(({ establishments: data }) => {
        if (cancelled) return
        setEstablishments(data)
        setError(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [reload])

  return (
    <main id="contenu" className="bg-ivory">
      <section className="relative overflow-hidden bg-noir">
        <div className="absolute inset-0 bg-gradient-to-br from-noir via-noir to-bordeaux/60" aria-hidden="true" />
        <div className="relative z-10 mx-auto w-full max-w-[76rem] px-5 pb-14 pt-32 sm:px-8 lg:px-12 lg:pt-40">
          <p className="mb-5 inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold-light">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Nos adresses
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            Des lieux <em className="italic text-gold-light">choisis</em> avec attention.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/70 sm:text-base">
            Cabanes suspendues, thermes, maisons confidentielles — découvrez les établissements qui composent
            le réseau NOVA.
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          {error ? (
            <div className="py-20 text-center" role="alert">
              <p className="font-serif text-3xl text-noir">Un léger contretemps.</p>
              <p className="mt-3 text-sm text-ink/70">
                Les établissements n'ont pas pu être chargés. Réessayez dans un instant.
              </p>
              <div className="mt-7">
                <Button variant="outline" onClick={() => setReload((value) => value + 1)}>
                  Réessayer
                </Button>
              </div>
            </div>
          ) : establishments === null ? (
            <SkeletonGrid />
          ) : establishments.length === 0 ? (
            <div className="py-20 text-center">
              <SearchX className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
              <p className="mt-5 font-serif text-3xl text-noir">Aucune adresse pour le moment.</p>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
                De nouveaux établissements rejoignent NOVA très bientôt.
              </p>
            </div>
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {establishments.map((establishment) => (
                <li key={establishment.id}>
                  <EstablishmentCard establishment={establishment} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </main>
  )
}