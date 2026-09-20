import { MapPin, CalendarDays } from 'lucide-react'
import type { FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { placeholder, visual } from '@/lib/placeholder'

const experienceOptions = [
  'Toutes les expériences',
  'Massage',
  'Spa & sauna',
  'Beauté & soins',
  'Yoga & méditation',
  'Bien-être',
]

export function SearchBar() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      id="recherche"
      onSubmit={handleSubmit}
      className="grid gap-3 border border-ivory/15 bg-white/10 p-3 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]"
      aria-label="Rechercher une expérience"
    >
      <label className="group flex items-center gap-3 bg-ivory/95 px-4 py-3">
        <MapPin className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <input
          type="text"
          name="ville"
          placeholder="Ville ou quartier"
          className="w-full bg-transparent text-sm text-noir placeholder:text-ink/40 focus:outline-none"
          autoComplete="off"
        />
      </label>

      <label className="flex items-center gap-3 bg-ivory/95 px-4 py-3">
        <span aria-hidden="true" className="shrink-0 font-serif text-base text-gold">✦</span>
        <select
          name="experience"
          defaultValue="Toutes les expériences"
          className="w-full cursor-pointer bg-transparent text-sm text-noir focus:outline-none"
        >
          {experienceOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-3 bg-ivory/95 px-4 py-3">
        <CalendarDays className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <input
          type="date"
          name="date"
          className="w-full cursor-pointer bg-transparent text-sm text-noir focus:outline-none"
        />
      </label>

      <Button type="submit" size="lg" className="justify-center sm:col-span-2 lg:col-span-1 lg:px-10">
        Trouver mon expérience
      </Button>
    </form>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-noir">
      <img
        src={placeholder({
          ...visual.hero,
          labelColor: '#d4af6a',
          accent: '#b98a3e',
          noteColor: '#b98a3e',
        })}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-noir via-transparent to-noir/40"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[76rem] px-5 pb-16 pt-36 sm:px-8 lg:px-12 lg:pb-20">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold-light">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Bien-être & beauté
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-6xl lg:text-7xl">
            Prenez le temps{' '}
            <em className="font-serif italic text-gold-light">de vous retrouver.</em>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg">
            Massages, spas, soins du visage, yoga et rituels d'exception — réservés auprès des
            meilleurs professionnels, près de chez vous.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="#categories" variant="light" size="lg">
              Découvrir les expériences
            </Button>
            <Button href="#professionnels" variant="ghost" size="lg" className="text-ivory hover:text-gold-light">
              Nos professionnels
            </Button>
          </div>
        </div>

        <div className="mt-14">
          <SearchBar />
        </div>
      </div>
    </section>
  )
}