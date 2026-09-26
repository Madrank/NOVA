import { CalendarDays, CalendarPlus, Check, ChevronDown, Clock3, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Reveal'
import { professionalsApi } from '@/services/professionals'
import { servicesApi } from '@/services/services'
import { availabilityApi } from '@/services/availability'
import { cn } from '@/lib/cn'
import type { AvailabilityRangeInput, ProfessionalAppointment, PublicManageSlot } from '@/types/availability'
import type { PublicService } from '@/types/service'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function nextDays(count: number): Array<{ key: string; label: string }> {
  const days: Array<{ key: string; label: string }> = []
  const today = new Date()
  for (let index = 1; index <= count; index += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    days.push({
      key: dayKey(date),
      label: new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric' }).format(date),
    })
  }
  return days
}

function timeOf(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

function dateLabel(day: string): string {
  const [year, month, date] = day.split('-').map(Number)
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(year, month - 1, date))
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

interface LoadState<T> {
  key: string
  value: T | null
  error: boolean
}

const DAYS = 7

export function AvailabilityPage() {
  const { user } = useAuth()
  const [profileState, setProfileState] = useState<LoadState<{ id: string } | null>>({ key: '', value: null, error: false })
  const [servicesState, setServicesState] = useState<LoadState<PublicService[]>>({ key: '', value: null, error: false })
  const [slotsState, setSlotsState] = useState<LoadState<PublicManageSlot[]>>({ key: '', value: null, error: false })
  const [appointmentsState, setAppointmentsState] = useState<LoadState<ProfessionalAppointment[]>>({
    key: '',
    value: null,
    error: false,
  })

  const profileKey = user ? `profile:${user.id}` : ''
  const isProfilePending = profileState.key !== profileKey

  useEffect(() => {
    if (!user || !isProfilePending) return
    let cancelled = false
    professionalsApi
      .me()
      .then(({ profile }) => {
        if (cancelled) return
        setProfileState({ key: profileKey, value: profile ? { id: profile.id } : null, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setProfileState({ key: profileKey, value: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [user, profileKey, isProfilePending])

  const professionalId = profileState.value?.id
  const servicesKey = professionalId ? `services:${professionalId}` : ''
  const isServicesPending = servicesState.key !== servicesKey

  useEffect(() => {
    if (!servicesKey || !isServicesPending) return
    let cancelled = false
    servicesApi
      .list()
      .then(({ services }) => {
        if (cancelled) return
        const owned = services.filter((service) => service.professional?.id === professionalId)
        setServicesState({ key: servicesKey, value: owned, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setServicesState({ key: servicesKey, value: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [servicesKey, isServicesPending, professionalId])

  const [slotsReload, setSlotsReload] = useState(0)
  const slotsKey = professionalId ? `slots:${professionalId}:${slotsReload}` : ''
  const isSlotsPending = slotsState.key !== slotsKey

  useEffect(() => {
    if (!slotsKey || !isSlotsPending) return
    let cancelled = false
    availabilityApi
      .mine()
      .then(({ slots }) => {
        if (cancelled) return
        setSlotsState({ key: slotsKey, value: slots, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setSlotsState({ key: slotsKey, value: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [slotsKey, isSlotsPending])

  const appointmentsKey = professionalId ? `apps:${professionalId}:0` : ''
  const isAppointmentsPending = appointmentsState.key !== appointmentsKey

  useEffect(() => {
    if (!appointmentsKey || !isAppointmentsPending) return
    let cancelled = false
    availabilityApi
      .appointments()
      .then(({ bookings }) => {
        if (cancelled) return
        setAppointmentsState({ key: appointmentsKey, value: bookings, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setAppointmentsState({ key: appointmentsKey, value: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [appointmentsKey, isAppointmentsPending])

  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set())
  const [ranges, setRanges] = useState<AvailabilityRangeInput[]>([{ from: '09:00', to: '12:00' }])
  const [submitting, setSubmitting] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removeError, setRemoveError] = useState<string | null>(null)

  const services = servicesState.value ?? []
  const slots = slotsState.value ?? []
  const appointments = appointmentsState.value ?? []
  const cities = services.map((service) => service.establishment?.city ?? '').filter(Boolean)

  const effectiveServiceId = services.some((service) => service.id === selectedServiceId)
    ? selectedServiceId
    : (services[0]?.id ?? '')

  function toggleDay(day: string) {
    setSelectedDays((previous) => {
      const next = new Set(previous)
      if (next.has(day)) {
        next.delete(day)
      } else {
        next.add(day)
      }
      return next
    })
  }

  function updateRange(index: number, field: 'from' | 'to', value: string) {
    setRanges((previous) => previous.map((range, rangeIndex) => (rangeIndex === index ? { ...range, [field]: value } : range)))
  }

  async function createSlots(event: FormEvent) {
    event.preventDefault()
    if (!effectiveServiceId || selectedDays.size === 0 || ranges.length === 0) {
      setCreateError('Choisissez au moins une prestation, un jour et une plage horaire.')
      return
    }
    setSubmitting(true)
    setCreateError(null)
    setFlash(null)
    try {
      const { created } = await availabilityApi.create({
        serviceIds: [effectiveServiceId],
        days: [...selectedDays].sort(),
        ranges,
      })
      if (created > 0) {
        setFlash(`${created} créneau${created > 1 ? 'x' : ''} ouvert${created > 1 ? 's' : ''}.`)
        setSlotsReload((value) => value + 1)
      } else {
        setCreateError('Ces créneaux existent déjà : choisissez d’autres jours ou horaires.')
      }
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Impossible d’ouvrir ces créneaux.')
    } finally {
      setSubmitting(false)
    }
  }

  async function removeSlot(slotId: string) {
    setRemovingId(slotId)
    setRemoveError(null)
    try {
      await availabilityApi.remove(slotId)
      setSlotsReload((value) => value + 1)
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Impossible de supprimer ce créneau.')
    } finally {
      setRemovingId(null)
    }
  }

  const visibleSlots = (() => {
    const grouped = new Map<string, PublicManageSlot[]>()
    for (const slot of slots) {
      const key = dayKey(new Date(slot.startsAt))
      const list = grouped.get(key) ?? []
      list.push(slot)
      grouped.set(key, list)
    }
    return [...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  })()

  const ready = !isProfilePending && profileState.value !== null

  return (
    <main id="contenu" className="min-h-screen bg-ivory">
      <Container size="narrow" className="py-32">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold">Espace professionnel</p>
        <h1 className="mt-3 font-serif text-4xl text-noir sm:text-5xl">Mes disponibilités</h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
          Ouvrez vos créneaux par jour et plage horaire : chaque combinaison devient un créneau réservable sur votre
          prestation.
        </p>

        {!ready ? (
          <div className="mt-12 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-card bg-ivory-deep/70" />
            ))}
          </div>
        ) : !profileState.value ? (
          <div className="mt-12 rounded-card border border-noir/10 bg-white/40 p-8">
            <p className="font-serif text-2xl text-noir">Créez d’abord votre fiche.</p>
            <p className="mt-2 text-sm text-ink/70">
              Sans fiche professionnelle, vous ne pouvez pas encore ouvrir des créneaux.
            </p>
            <Button to="/profil-professionnel" variant="outline" className="mt-6">
              Accéder à ma vitrine
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-12 rounded-card border border-noir/10 bg-white/40 p-8">
            <p className="font-serif text-2xl text-noir">Aucune prestation à votre nom.</p>
            <p className="mt-2 text-sm text-ink/70">Les créneaux se rattachent à une prestation.</p>
          </div>
        ) : (
          <>
            <Reveal>
              <form onSubmit={createSlots} className="mt-12 rounded-card border border-noir/10 bg-ivory-deep/50 p-8">
                <p className="flex items-center gap-3 font-serif text-2xl text-noir">
                  <CalendarPlus className="h-6 w-6 text-gold" aria-hidden="true" />
                  Ouvrir des créneaux
                </p>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="prestation" className="text-xs font-medium uppercase tracking-[0.18em] text-ink/60">
                      Prestation
                    </label>
                    <div className="relative mt-2">
                      <select
                        id="prestation"
                        value={effectiveServiceId}
                        onChange={(event) => setSelectedServiceId(event.target.value)}
                        className="h-12 w-full appearance-none rounded-btn border border-noir/15 bg-ivory px-4 pr-10 text-noir outline-none transition-colors focus:border-gold"
                      >
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} — {service.durationMinutes} min — {formatPrice(service.price)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" aria-hidden="true" />
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink/60">Jours proposés</span>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {nextDays(DAYS).map((day) => (
                        <button
                          key={day.key}
                          type="button"
                          aria-pressed={selectedDays.has(day.key)}
                          onClick={() => toggleDay(day.key)}
                          className={cn(
                            'rounded-btn border px-2 py-2.5 text-xs capitalize transition-colors duration-300',
                            selectedDays.has(day.key)
                              ? 'border-noir bg-noir text-ivory'
                              : 'border-noir/15 bg-ivory/60 text-ink/70 hover:border-noir/40',
                          )}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink/60">Plages horaires</span>
                  <div className="mt-2 space-y-2">
                    {ranges.map((range, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="time"
                          value={range.from}
                          onChange={(event) => updateRange(index, 'from', event.target.value)}
                          className="h-12 rounded-btn border border-noir/15 bg-ivory px-4 text-noir outline-none transition-colors focus:border-gold"
                          aria-label={`Début de la plage ${index + 1}`}
                        />
                        <span className="text-ink/50">à</span>
                        <input
                          type="time"
                          value={range.to}
                          onChange={(event) => updateRange(index, 'to', event.target.value)}
                          className="h-12 rounded-btn border border-noir/15 bg-ivory px-4 text-noir outline-none transition-colors focus:border-gold"
                          aria-label={`Fin de la plage ${index + 1}`}
                        />
                        {ranges.length > 1 ? (
                          <button
                            type="button"
                            onClick={() => setRanges((previous) => previous.filter((_, rangeIndex) => rangeIndex !== index))}
                            className="rounded-btn p-2 text-ink/50 transition-colors hover:text-bordeaux"
                            aria-label="Retirer cette plage"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  {ranges.length < 3 ? (
                    <button
                      type="button"
                      onClick={() => setRanges((previous) => [...previous, { from: '14:00', to: '18:00' }])}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-gold hover:text-noir"
                    >
                      <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                      Ajouter une plage
                    </button>
                  ) : null}
                </div>

                {createError ? (
                  <p className="mt-5 text-sm text-bordeaux" role="alert">
                    {createError}
                  </p>
                ) : null}
                {flash ? (
                  <p className="mt-5 text-sm text-gold" role="status">
                    <Check className="mr-1 inline h-4 w-4" aria-hidden="true" />
                    {flash}
                  </p>
                ) : null}

                <Button type="submit" size="lg" className="mt-7" disabled={submitting}>
                  {submitting ? 'Ouverture…' : 'Ouvrir ces créneaux'}
                </Button>
              </form>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="mt-14" aria-label="Créneaux ouverts">
                <p className="flex items-center gap-3 font-serif text-2xl text-noir">
                  <CalendarDays className="h-6 w-6 text-gold" aria-hidden="true" />
                  Créneaux ouverts
                </p>
                {removeError ? (
                  <p className="mt-4 text-sm text-bordeaux" role="alert">
                    {removeError}
                  </p>
                ) : null}
                {isSlotsPending ? (
                  <div className="mt-6 space-y-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-20 animate-pulse rounded-card bg-ivory-deep/70" />
                    ))}
                  </div>
                ) : visibleSlots.length === 0 ? (
                  <div className="mt-6 rounded-card border border-noir/10 bg-white/40 p-7">
                    <p className="text-sm text-ink/70">Aucun créneau ouvert pour l'instant.</p>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-6">
                    {visibleSlots.map(([day, daySlots]) => (
                      <li key={day}>
                        <p className="text-xs uppercase tracking-[0.2em] text-ink/50 capitalize">{dateLabel(day)}</p>
                        <div className="mt-2 grid gap-2">
                          {daySlots.map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between gap-4 rounded-card border border-noir/10 bg-white/40 p-4"
                            >
                              <div className="min-w-0">
                                <p className="font-serif text-lg text-noir">
                                  {timeOf(slot.startsAt)} — {timeOf(slot.endsAt)}
                                </p>
                                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/60">
                                  <span>{slot.serviceName}</span>
                                  <span className="inline-flex items-center gap-1">
                                    <Clock3 className="h-3 w-3 text-gold" aria-hidden="true" />
                                    {slot.durationMinutes} min
                                  </span>
                                </p>
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                {slot.isBooked ? <Badge tone="bordeaux">Réservé</Badge> : <Badge tone="outline">Libre</Badge>}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  disabled={slot.isBooked || removingId !== null}
                                  onClick={() => removeSlot(slot.id)}
                                  className="text-ink/70 hover:border-bordeaux hover:text-bordeaux"
                                >
                                  {removingId === slot.id ? '…' : <Trash2 className="h-4 w-4" aria-hidden="true" />}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <section className="mt-14" aria-label="Mes rendez-vous">
                <p className="flex items-center gap-3 font-serif text-2xl text-noir">
                  <CalendarDays className="h-6 w-6 text-gold" aria-hidden="true" />
                  Mes rendez-vous
                </p>
                {appointmentsState.error ? (
                  <p className="mt-6 rounded-card border border-noir/10 bg-white/40 p-7 text-sm text-bordeaux">
                    Impossible de charger vos rendez-vous.
                  </p>
                ) : isAppointmentsPending ? (
                  <div className="mt-6 space-y-3">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="h-24 animate-pulse rounded-card bg-ivory-deep/70" />
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="mt-6 rounded-card border border-noir/10 bg-white/40 p-7">
                    <p className="text-sm text-ink/70">Aucun rendez-vous à venir.</p>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-3">
                    {appointments.map((appointment) => (
                      <li
                        key={appointment.id}
                        className="flex flex-col gap-2 rounded-card border border-noir/10 bg-white/40 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-serif text-lg text-noir">
                            {appointment.service.name}
                            <span className="ml-3 text-sm font-sans text-ink/60">
                              {appointment.client.firstName} {appointment.client.lastName}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs text-ink/60">
                            {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(
                              new Date(appointment.startsAt),
                            )}{' '}
                            à {timeOf(appointment.startsAt)} · {appointment.service.durationMinutes} min ·{' '}
                            {formatPrice(appointment.price)}
                          </p>
                        </div>
                        {appointment.establishment ? (
                          <Badge tone="gold" className="self-start sm:self-auto">
                            {appointment.establishment.city}
                          </Badge>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>

            <p className="mt-10 text-xs text-ink/50">
              <Link to="/compte" className="text-gold hover:text-noir">
                Retour à mon espace
              </Link>
              {cities.length > 0 ? <span className="ml-3">· {new Set(cities).size} lieu(x) de pratique</span> : null}
            </p>
          </>
        )}
      </Container>
    </main>
  )
}