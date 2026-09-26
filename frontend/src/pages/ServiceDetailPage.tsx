import { ArrowLeft, BadgeCheck, Check, ChevronRight, Clock3, Gift, MapPin, Sparkles, Star, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { ServiceCard } from '@/components/catalog/ServiceCard'
import { getCategory, getEstablishment, services as mockServices } from '@/data/services'
import { placeholder } from '@/lib/placeholder'
import { bookingsApi } from '@/services/bookings'
import { servicesApi } from '@/services/services'
import type { PublicBooking, BookingSlot } from '@/types/booking'
import type { PublicService } from '@/types/service'
import { cn } from '@/lib/cn'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function groupSlotsByDay(slots: BookingSlot[]): Array<{ day: string; slots: BookingSlot[] }> {
  const grouped = new Map<string, BookingSlot[]>()
  for (const slot of slots) {
    const key = dayKey(new Date(slot.startsAt))
    const list = grouped.get(key) ?? []
    list.push(slot)
    grouped.set(key, list)
  }
  return [...grouped.entries()]
    .map(([day, daySlots]) => ({ day, slots: daySlots }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .slice(0, 7)
}

function timeOf(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

function dateLabel(day: string): string {
  const [year, month, date] = day.split('-').map(Number)
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(year, month - 1, date))
}

interface BookingPanelProps {
  service: PublicService
  returned: boolean
}

interface SlotsState {
  key: string
  slots: BookingSlot[] | null
  error: boolean
}

function BookingPanel({ service, returned }: BookingPanelProps) {
  const { status } = useAuth()
  const navigate = useNavigate()
  const [slotsState, setSlotsState] = useState<SlotsState>({ key: '', slots: null, error: false })
  const [selectedDay, setSelectedDay] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null)
  const [booking, setBooking] = useState<PublicBooking | null>(null)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [reload, setReload] = useState(0)

  const slotsKey = `${service.slug}:${reload}:${returned}`
  const isPending = slotsState.key !== slotsKey

  useEffect(() => {
    if (!isPending) return
    let cancelled = false
    servicesApi
      .availability(service.slug)
      .then(({ slots }) => {
        if (cancelled) return
        setSlotsState({ key: slotsKey, slots, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setSlotsState({ key: slotsKey, slots: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [service.slug, slotsKey, isPending])

  const days = slotsState.slots ? groupSlotsByDay(slotsState.slots) : []
  const activeSlots = days.find((group) => group.day === selectedDay)?.slots ?? []

  async function confirm() {
    if (!selectedSlot) return
    if (status !== 'authenticated') {
      navigate('/connexion', { state: { from: window.location.pathname } })
      return
    }
    setConfirming(true)
    setBookingError(null)
    try {
      const { booking: created } = await bookingsApi.create({
        serviceSlug: service.slug,
        availabilityId: selectedSlot.id,
      })
      setBooking(created)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Réservation impossible'
      setBookingError(message)
      if (isSlotConflict(err)) setReload((value) => value + 1)
    } finally {
      setConfirming(false)
    }
  }

  if (booking) {
    return (
      <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Check className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-serif text-2xl text-noir">C'est réservé.</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              {service.name} — {dateLabel(dayKey(new Date(booking.startsAt)))} à {timeOf(booking.startsAt)}.
              <br />
              {formatPrice(booking.price)} · annulable depuis votre compte.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button to="/compte" size="sm" variant="outline">
                Mes réservations
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">Choisissez votre créneau</p>

      {isPending ? (
        <div className="space-y-3 py-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-card bg-ivory-deep/70" />
          ))}
        </div>
      ) : slotsState.error ? (
        <div className="py-10 text-center">
          <p className="font-serif text-xl text-noir">Un léger contretemps.</p>
          <p className="mt-2 text-sm text-ink/70">Les disponibilités n'ont pas pu être chargées.</p>
          <Button variant="outline" size="sm" className="mt-5" onClick={() => setReload((value) => value + 1)}>
            Réessayer
          </Button>
        </div>
      ) : !slotsState.slots || slotsState.slots.length === 0 ? (
        <div className="py-10 text-center">
          <p className="font-serif text-xl text-noir">Aucune disponibilité.</p>
          <p className="mt-2 text-sm text-ink/70">Revenez bientôt, de nouveaux créneaux sont ajoutés régulièrement.</p>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {days.map((group) => {
              const short = new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).format(
                new Date(group.day + 'T12:00:00'),
              )
              return (
                <button
                  key={group.day}
                  type="button"
                  onClick={() => {
                    setSelectedDay(group.day)
                    setSelectedSlot(null)
                  }}
                  className={cn(
                    'rounded-btn border px-2 py-2.5 text-xs capitalize transition-colors duration-300',
                    selectedDay === group.day
                      ? 'border-noir bg-noir text-ivory'
                      : 'border-noir/15 bg-ivory/60 text-ink/70 hover:border-noir/40',
                  )}
                >
                  {short}
                </button>
              )
            })}
          </div>

          {selectedDay ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{dateLabel(selectedDay)}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {activeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      'rounded-btn border px-2 py-2.5 text-xs transition-colors duration-300',
                      selectedSlot?.id === slot.id
                        ? 'border-gold bg-gold text-noir'
                        : 'border-noir/15 bg-ivory/60 text-ink/70 hover:border-gold',
                    )}
                  >
                    {timeOf(slot.startsAt)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {bookingError ? (
            <p className="mt-5 text-sm text-bordeaux" role="alert">
              {bookingError}
            </p>
          ) : null}

          <Button size="lg" className="mt-7 w-full" disabled={!selectedSlot || confirming} onClick={confirm}>
            {confirming ? 'Réservation en cours…' : status === 'authenticated' ? 'Confirmer la réservation' : 'Se connecter pour réserver'}
          </Button>
          <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
            Créneau confirmé instantanément. Annulation gratuite depuis votre compte.
          </p>
        </>
      )}
    </div>
  )
}

function isSlotConflict(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    ((err as { code: string }).code === 'BOOKING_CONFLICT' || (err as { code: string }).code === 'SLOT_UNAVAILABLE')
  )
}

interface ServiceLoadState {
  key: string
  value: PublicService | 'missing' | null
}

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [serviceLoad, setServiceLoad] = useState<ServiceLoadState>({ key: '', value: null })

  const apiKey = slug ?? ''
  const isPending = serviceLoad.key !== apiKey

  useEffect(() => {
    if (!isPending) return
    let cancelled = false
    servicesApi
      .detail(apiKey)
      .then(({ service }) => {
        if (cancelled) return
        setServiceLoad({ key: apiKey, value: service })
      })
      .catch(() => {
        if (cancelled) return
        setServiceLoad({ key: apiKey, value: 'missing' })
      })
    return () => {
      cancelled = true
    }
  }, [apiKey, isPending])

  if (isPending) {
    return (
      <main id="contenu" className="min-h-screen bg-ivory">
        <Container as="div" className="py-10 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="aspect-[16/10] w-full animate-pulse rounded-card bg-ivory-deep/70" />
              <div className="mt-10 space-y-3">
                <div className="h-5 w-24 animate-pulse rounded-full bg-ivory-deep/70" />
                <div className="h-12 w-3/4 animate-pulse rounded-card bg-ivory-deep/70" />
                <div className="h-4 w-2/3 animate-pulse rounded-card bg-ivory-deep/70" />
                <div className="h-4 w-1/2 animate-pulse rounded-card bg-ivory-deep/70" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-80 animate-pulse rounded-card bg-ivory-deep/70" />
            </div>
          </div>
        </Container>
      </main>
    )
  }

  const value = serviceLoad.value
  const bookable = value !== null && value !== 'missing'

  return (
    <ComposedServiceView
      slug={slug ?? ''}
      mockOnly={!bookable}
      apiService={bookable ? (value as PublicService) : undefined}
    />
  )
}

interface ComposedServiceViewProps {
  slug: string
  mockOnly: boolean
  apiService?: PublicService
}

function ComposedServiceView({ slug, mockOnly, apiService }: ComposedServiceViewProps) {
  const mock = mockServices.find((item) => item.slug === slug)
  const mockEstablishment = getEstablishment(mock?.establishmentSlug ?? '')
  const service = mock
  const establishmentName = apiService?.establishment?.name ?? mockEstablishment?.name
  const establishmentCity = apiService?.establishment?.city ?? mockEstablishment?.city
  const professionalName =
    apiService?.professional ? `${apiService.professional.firstName} ${apiService.professional.lastName}` : service?.professionalName
  const category = getCategory(apiService?.category ?? service?.category ?? '')
  const rating = apiService?.rating ?? service?.rating ?? 0
  const reviewsCount = apiService?.reviewsCount ?? service?.reviewsCount ?? 0
  const name = apiService?.name ?? service?.name ?? ''
  const summary = apiService?.summary ?? service?.summary ?? ''
  const description = apiService?.description ?? service?.description ?? ''
  const price = apiService?.price ?? service?.price ?? 0
  const durationMinutes = apiService?.durationMinutes ?? service?.durationMinutes ?? 0
  const duo = apiService?.duo ?? service?.duo ?? false
  const giftable = apiService?.giftable ?? service?.giftable ?? false
  const imageFrom = apiService?.imageFrom ?? service?.imageFrom ?? '#2a2018'
  const imageTo = apiService?.imageTo ?? service?.imageTo ?? '#5e1f2a'

  const related = mockServices
    .filter((item) => item.category === (service?.category ?? ''))
    .filter((item) => item.slug !== slug)
    .slice(0, 3)

  if (!service) {
    return <Navigate to="/introuvable" replace />
  }

  return (
    <main id="contenu" className="bg-ivory">
      <nav aria-label="Fil d'Ariane" className="border-b border-noir/10">
        <Container className="flex items-center gap-2 py-4 text-xs text-ink/60">
          <Link to="/experiences" className="transition-colors hover:text-gold">
            Expériences
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-noir">{name}</span>
        </Container>
      </nav>

      <Container as="div" className="py-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <img
                src={placeholder({
                  from: imageFrom,
                  to: imageTo,
                  label: category?.name ?? 'NOVA',
                  note: `${durationMinutes} min · ${establishmentCity ?? ''}`,
                  labelColor: '#f5f1ea',
                  noteColor: '#d4af6a',
                })}
                alt={`${name} — ${category?.name ?? ''} chez ${establishmentName}`}
                className="aspect-[16/10] w-full rounded-card object-cover"
              />
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-10 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="gold">{category?.name}</Badge>
                  {duo ? <Badge tone="bordeaux">En duo</Badge> : null}
                  {giftable ? <Badge tone="outline">Offrable</Badge> : null}
                </div>
                <h1 className="mt-5 font-serif text-4xl leading-[1.08] text-noir sm:text-5xl">{name}</h1>
                <p className="mt-4 text-lg leading-relaxed text-ink/70">{summary}</p>
                <p className="mt-6 text-base leading-relaxed text-ink/75">{description}</p>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="mt-12" aria-label="Le lieu et la praticienne">
                <div className="grid gap-4 rounded-card border border-noir/10 bg-white/40 p-7 sm:grid-cols-2">
                  <div>
                    <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
                      L'établissement
                    </h2>
                    <p className="mt-2 font-serif text-2xl text-noir">{establishmentName}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/60">
                      <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                      {establishmentCity}
                    </p>
                    {mockOnly && service ? (
                      <Link
                        to={`/etablissement/${service.establishmentSlug}`}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-gold hover:text-noir"
                      >
                        Voir l'établissement <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                  <div>
                    <h2 className="text-[0.6875rem] font-medium uppercase tracking-[0.24em] text-gold">
                      La praticienne
                    </h2>
                    <p className="mt-2 inline-flex items-center gap-2 font-serif text-2xl text-noir">
                      {professionalName}
                      <BadgeCheck className="h-5 w-5 text-gold" aria-hidden="true" />
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink/60">
                      <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                      {rating.toLocaleString('fr-FR')} · {reviewsCount} avis
                    </p>
                  </div>
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="mt-12" aria-label="Bon à savoir">
                <h2 className="font-serif text-2xl text-noir">Bon à savoir</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    'Créneau confirmé en temps réel, sans conflit possible',
                    'Annulation gratuite depuis votre compte',
                    'Serviettes et infusion comprises',
                    'Accessible dès une première réservation',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink/75">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="lg:sticky lg:top-28">
              <div className="space-y-6">
                <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-ink/50">À partir de</p>
                      <p className="mt-1 font-serif text-5xl text-noir">{formatPrice(price)}</p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm text-ink/70">
                      <Clock3 className="h-4 w-4 text-gold" aria-hidden="true" />
                      {durationMinutes} min
                    </span>
                  </div>

                  <div className="mt-7 space-y-2.5 border-t border-noir/10 pt-6 text-sm text-ink/70">
                    <p className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-gold" aria-hidden="true" />
                        Format
                      </span>
                      <span className="text-noir">{duo ? 'Duo' : 'Individuel'}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <Gift className="h-4 w-4 text-gold" aria-hidden="true" />
                        Coffret cadeau
                      </span>
                      <span className="text-noir">{giftable ? 'Disponible' : 'Sur demande'}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                        Lieu
                      </span>
                      <span className="text-noir">{establishmentCity}</span>
                    </p>
                  </div>
                </div>

                {mockOnly ? (
                  <div className="rounded-card border border-noir/10 bg-white/40 p-7 lg:p-8">
                    <Button size="lg" className="w-full" disabled>
                      Choisir une date
                    </Button>
                    <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
                      La réservation devient disponible sur cette expérience.
                    </p>
                  </div>
                ) : (
                  <BookingPanel service={apiService as PublicService} returned />
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <section className="bg-ivory-deep/60 py-16 lg:py-24" aria-label="Expériences similaires">
          <Container>
            <Reveal>
              <h2 className="font-serif text-3xl text-noir sm:text-4xl">
                Dans le même <em className="italic text-gold">univers</em>
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item.slug} service={item} />
              ))}
            </div>
            <div className="mt-10">
              <Button to="/experiences" variant="ghost" className="text-ink hover:text-gold">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Retour au catalogue
              </Button>
            </div>
          </Container>
        </section>
      ) : null}
    </main>
  )
}