import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/cn'
import { placeholder, visual } from '@/lib/placeholder'

const categories = [
  {
    name: 'Massage',
    note: 'Rituels & pierres',
    src: placeholder(visual.massage),
    className: 'lg:col-span-7',
  },
  {
    name: 'Spa',
    note: 'Thermal & sauna',
    src: placeholder(visual.spa),
    className: 'lg:col-span-5',
  },
  {
    name: 'Beauté',
    note: 'Soins du visage',
    src: placeholder(visual.beaute),
    className: 'lg:col-span-5',
  },
  {
    name: 'Yoga',
    note: 'Méditation',
    src: placeholder(visual.yoga),
    className: 'lg:col-span-4',
  },
  {
    name: 'Bien-être',
    note: 'Équilibre',
    src: placeholder(visual.bienetre),
    className: 'lg:col-span-3',
  },
]

export function Experiences() {
  return (
    <section id="categories" className="scroll-mt-24 bg-ivory py-24 lg:py-36">
      <Container>
        <Reveal>
          <SectionHeading
            overline="Les expériences"
            title={
              <>
                Une parenthèse au quotidien,
                <br />
                <em className="italic text-gold">choisie avec soin.</em>
              </>
            }
            description="Cinq univers pour se ressourcer. Explorez, comparez, et réservez en quelques instants."
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={0.05 * index} className={cn('block', category.className)}>
              <a
                href="#signature"
                className="group relative block aspect-[3/2] w-full overflow-hidden rounded-card bg-ivory-deep"
              >
                <img
                  src={category.src}
                  alt=""
                  width={1600}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-noir/60 via-noir/10 to-transparent"
                  aria-hidden="true"
                />
                <ArrowUpRight
                  className="absolute right-5 top-5 h-5 w-5 text-ivory opacity-0 transition-all duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-gold-light">
                    {category.note}
                  </p>
                  <p className="mt-1 font-serif text-3xl text-ivory lg:text-4xl">{category.name}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}