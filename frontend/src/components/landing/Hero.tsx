import { Button } from '@/components/ui/Button'
import { SearchBar } from '@/components/search/SearchBar'
import { placeholder, visual } from '@/lib/placeholder'

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