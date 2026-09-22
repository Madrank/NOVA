import { RotateCcw, SearchX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CategoryChips } from '@/components/catalog/CategoryChips'
import { FiltersPanel } from '@/components/catalog/FiltersPanel'
import { ServiceCard } from '@/components/catalog/ServiceCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'
import { SearchBar } from '@/components/search/SearchBar'
import { searchServices } from '@/services/discovery'
import type { SearchFilters, SearchResult, ServiceDuration, SortKey } from '@/types/service'

const sortOptions: Array<{ value: SortKey; label: string }> = [
  { value: 'recommended', label: 'Recommandés' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
]

function parseFilters(params: URLSearchParams): SearchFilters {
  const maxPrice = params.get('budget')
  const maxDuration = params.get('duree')
  const sort = params.get('tri')

  return {
    city: params.get('ville') ?? undefined,
    category: params.get('categorie') ?? undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    maxDuration: maxDuration ? (Number(maxDuration) as ServiceDuration) : undefined,
    sort: (sort ?? undefined) as SortKey | undefined,
  }
}

function filtersToParams(filters: SearchFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.city) params.set('ville', filters.city)
  if (filters.category) params.set('categorie', filters.category)
  if (filters.maxPrice) params.set('budget', String(filters.maxPrice))
  if (filters.maxDuration) params.set('duree', String(filters.maxDuration))
  if (filters.sort) params.set('tri', filters.sort)
  return params
}

function filtersKey(filters: SearchFilters): string {
  return filtersToParams(filters).toString()
}

function SkeletonGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-card bg-ivory-deep/60">
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])
  const key = useMemo(() => filtersKey(filters), [filters])

  const [loaded, setLoaded] = useState<{ key: string; data: SearchResult; error: boolean } | null>(null)
  const [reload, setReload] = useState(0)

  const isPending = loaded?.key !== key
  const error = loaded?.key === key && loaded.error
  const data = loaded?.key === key ? loaded.data : null

  useEffect(() => {
    let cancelled = false

    searchServices(filters)
      .then((result) => {
        if (cancelled) return
        setLoaded({ key, data: result, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setLoaded({ key, data: { items: [], total: 0 }, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [key, filters, reload])

  function update(patch: Partial<SearchFilters>) {
    setSearchParams(filtersToParams({ ...filters, ...patch }))
  }

  function reset() {
    setSearchParams(new URLSearchParams())
  }

  function retry() {
    setLoaded(null)
    setReload((value) => value + 1)
  }

  const activeSort = filters.sort ?? 'recommended'

  return (
    <main id="contenu" className="bg-ivory">
      <section className="relative overflow-hidden bg-noir">
        <div
          className="absolute inset-0 bg-gradient-to-br from-noir via-noir to-bordeaux/60"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto w-full max-w-[76rem] px-5 pb-14 pt-32 sm:px-8 lg:px-12 lg:pt-40">
          <p className="mb-5 inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold-light">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Le catalogue
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-6xl">
            Nos expériences, <em className="italic text-gold-light">votre temps.</em>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/70 sm:text-base">
            Filtrez par ville, budget et durée. Chaque fiche affiche les disponibilités réelles
            de l'établissement.
          </p>
          <div className="mt-8">
            <SearchBar
              initialValues={{ city: filters.city, category: filters.category }}
            />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <CategoryChips active={filters.category ?? ''} onChange={(category) => update({ category: category || undefined })} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[280px_1fr]">
            <FiltersPanel filters={filters} onChange={update} />

            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-ink/70">
                  {!isPending && data ? (
                    <>
                      <span className="font-serif text-2xl text-noir">{data.total}</span>
                      {data.total > 1 ? ' expériences' : ' expérience'}
                    </>
                  ) : (
                    'Recherche en cours…'
                  )}
                </p>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-ink/60">
                  Trier
                  <select
                    value={activeSort}
                    onChange={(event) => update({ sort: event.target.value as SortKey })}
                    className="cursor-pointer border-b border-noir/20 bg-transparent py-1 text-xs text-noir focus:border-gold focus:outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {isPending ? (
                <SkeletonGrid />
              ) : error ? (
                <div className="py-20 text-center" role="alert">
                  <p className="font-serif text-3xl text-noir">Un léger contretemps.</p>
                  <p className="mt-3 text-sm text-ink/70">
                    Les expériences n'ont pas pu être chargées. Réessayez dans un instant.
                  </p>
                  <div className="mt-7">
                    <Button variant="outline" onClick={retry}>
                      Réessayer
                    </Button>
                  </div>
                </div>
              ) : data && data.items.length === 0 ? (
                <div className="py-20 text-center">
                  <SearchX className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
                  <p className="mt-5 font-serif text-3xl text-noir">Aucune expérience trouvée.</p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
                    Essayez d'élargir les critères : autre ville, autre budget ou une autre durée.
                  </p>
                  <div className="mt-7">
                    <Button variant="outline" onClick={reset}>
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </div>
              ) : data ? (
                <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {data.items.map((service) => (
                    <li key={service.slug}>
                      <ServiceCard service={service} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}