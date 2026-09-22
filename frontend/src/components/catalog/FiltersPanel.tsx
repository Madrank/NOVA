import { SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { cityList } from '@/data/services'
import { priceBounds } from '@/services/discovery'
import { cn } from '@/lib/cn'
import type { SearchFilters, ServiceDuration } from '@/types/service'

const durationOptions: Array<{ value: ServiceDuration | 0; label: string }> = [
  { value: 0, label: 'Toutes durées' },
  { value: 30, label: '30 min max' },
  { value: 60, label: '1 h max' },
  { value: 90, label: '1 h 30 max' },
]

const budgetOptions = [
  { value: 0, label: 'Tous les budgets' },
  { value: 60, label: 'Moins de 60 €' },
  { value: 90, label: 'Moins de 90 €' },
  { value: 120, label: 'Moins de 120 €' },
  { value: 180, label: 'Moins de 180 €' },
]

interface FiltersPanelProps {
  filters: SearchFilters
  onChange: (patch: Partial<SearchFilters>) => void
}

export function FiltersPanel({ filters, onChange }: FiltersPanelProps) {
  const [open, setOpen] = useState(false)
  const activeCount =
    (filters.city ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.maxDuration ? 1 : 0)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mb-5 inline-flex items-center gap-2 rounded-btn border border-noir/20 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-noir transition-colors duration-300 hover:border-noir/50 lg:hidden"
        aria-expanded={open}
        aria-controls="filtres"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filtres
        {activeCount > 0 ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[0.6875rem] text-noir">
            {activeCount}
          </span>
        ) : null}
      </button>

      <aside
        id="filtres"
        className={cn('mb-0 lg:block', open ? 'block' : 'hidden')}
        aria-label="Filtres de recherche"
      >
        <div className="space-y-7 rounded-card border border-noir/10 bg-white/40 p-6 lg:sticky lg:top-28">
          <label className="block">
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
              Ville
            </span>
            <select
              value={filters.city ?? ''}
              onChange={(event) => onChange({ city: event.target.value || undefined })}
              className="mt-2 w-full cursor-pointer border-b border-noir/20 bg-transparent py-2 text-sm text-noir focus:border-gold focus:outline-none"
            >
              <option value="">Toutes les villes</option>
              {cityList().map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
              Budget
            </span>
            <select
              value={filters.maxPrice ?? 0}
              onChange={(event) =>
                onChange({ maxPrice: Number(event.target.value) || undefined })
              }
              className="mt-2 w-full cursor-pointer border-b border-noir/20 bg-transparent py-2 text-sm text-noir focus:border-gold focus:outline-none"
            >
              {budgetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
              Durée
            </span>
            <select
              value={filters.maxDuration ?? 0}
              onChange={(event) =>
                onChange({
                  maxDuration: Number(event.target.value) || undefined,
                } as { maxDuration?: ServiceDuration })
              }
              className="mt-2 w-full cursor-pointer border-b border-noir/20 bg-transparent py-2 text-sm text-noir focus:border-gold focus:outline-none"
            >
              {durationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-ink/50">
            {priceBounds.min} € à {priceBounds.max} € · disponibilités réelles disponibles
            à chaque fiche
          </p>
        </div>
      </aside>
    </>
  )
}