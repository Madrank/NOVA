import { CalendarDays, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { categories, cityList } from '@/data/services'
import { cn } from '@/lib/cn'

export interface SearchBarValues {
  city: string
  category: string
  date: string
}

interface SearchBarProps {
  initialValues?: Partial<SearchBarValues>
  className?: string
}

function toQuery(values: SearchBarValues): string {
  const params = new URLSearchParams()
  if (values.city) params.set('ville', values.city)
  if (values.category) params.set('categorie', values.category)
  if (values.date) params.set('date', values.date)
  const qs = params.toString()
  return qs ? `/experiences?${qs}` : '/experiences'
}

export function SearchBar({ initialValues, className }: SearchBarProps) {
  const navigate = useNavigate()
  const [city, setCity] = useState(initialValues?.city ?? '')
  const [category, setCategory] = useState(initialValues?.category ?? '')
  const [date, setDate] = useState(initialValues?.date ?? '')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(toQuery({ city, category, date }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Rechercher une expérience"
      className={cn(
        'grid gap-3 border border-ivory/15 bg-white/10 p-3 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]',
        className,
      )}
    >
      <label className="flex items-center gap-3 bg-ivory px-4 py-3">
        <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Ville ou quartier"
          list="nova-cities"
          className="w-full bg-transparent text-sm text-noir placeholder:text-ink/40 focus:outline-none"
          autoComplete="off"
        />
        <datalist id="nova-cities">
          {cityList().map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </label>

      <label className="flex items-center gap-3 bg-ivory px-4 py-3">
        <span aria-hidden="true" className="shrink-0 font-serif text-base text-gold">✦</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full cursor-pointer bg-transparent text-sm text-noir focus:outline-none"
        >
          <option value="">Toutes les expériences</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-3 bg-ivory px-4 py-3">
        <CalendarDays className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <input
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full cursor-pointer bg-transparent text-sm text-noir focus:outline-none"
        />
      </label>

      <Button type="submit" size="lg" className="justify-center sm:col-span-2 lg:col-span-1 lg:px-10">
        Trouver mon expérience
      </Button>
    </form>
  )
}