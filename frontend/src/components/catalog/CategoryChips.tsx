import { categories } from '@/data/services'
import { cn } from '@/lib/cn'

interface CategoryChipsProps {
  active: string
  onChange: (category: string) => void
}

export function CategoryChips({ active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Filtrer par catégorie">
      <button
        type="button"
        onClick={() => onChange('')}
        className={cn(
          'rounded-btn border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-300',
          active === ''
            ? 'border-noir bg-noir text-ivory'
            : 'border-noir/20 bg-transparent text-ink/70 hover:border-noir/50 hover:text-noir',
        )}
        aria-pressed={active === ''}
      >
        Tout
      </button>
      {categories.map((category) => {
        const isActive = active === category.slug
        return (
          <button
            key={category.slug}
            type="button"
            onClick={() => onChange(isActive ? '' : category.slug)}
            className={cn(
              'rounded-btn border px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-300',
              isActive
                ? 'border-noir bg-noir text-ivory'
                : 'border-noir/20 bg-transparent text-ink/70 hover:border-noir/50 hover:text-noir',
            )}
            aria-pressed={isActive}
          >
            {category.name}
          </button>
        )
      })}
    </div>
  )
}