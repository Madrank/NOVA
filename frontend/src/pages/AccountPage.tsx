import { Briefcase, CalendarHeart, LogOut, Phone, Star, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { placeholder } from '@/lib/placeholder'
import { bookingsApi } from '@/services/bookings'
import type { PublicBooking } from '@/types/booking'
import { cn } from '@/lib/cn'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

interface BookingsState {
  key: string
  bookings: PublicBooking[] | null
  error: boolean
}

const STATUS_LABELS: Record<PublicBooking['status'], { label: string; tone: 'outline' | 'gold' | 'bordeaux' }> = {
  confirmed: { label: 'Confirmée', tone: 'gold' },
  cancelled: { label: 'Annulée', tone: 'bordeaux' },
  completed: { label: 'Terminée', tone: 'outline' },
}

export function AccountPage() {
  const { user, logout } = useAuth()
  const [bookingsState, setBookingsState] = useState<BookingsState>({ key: '', bookings: null, error: false })
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)

  const key = user ? `me:${user.id}:${reload}` : ''
  const isPending = bookingsState.key !== key

  useEffect(() => {
    if (!key || !isPending) return
    let cancelled = false
    bookingsApi
      .mine()
      .then(({ bookings }) => {
        if (cancelled) return
        setBookingsState({ key, bookings, error: false })
      })
      .catch(() => {
        if (cancelled) return
        setBookingsState({ key, bookings: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [key, isPending])

  if (!user) {
    return null
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const isProfessional = user.role === 'professional'

  async function cancelBooking(id: string) {
    setCancellingId(id)
    setCancelError(null)
    try {
      await bookingsApi.cancel(id)
      setReload((value) => value + 1)
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Impossible d'annuler cette réservation.")
    } finally {
      setCancellingId(null)
    }
  }

  const bookings = bookingsState.bookings ?? []
  const upcoming = bookings.filter((item) => item.status === 'confirmed')
  const past = bookings.filter((item) => item.status === 'cancelled' || item.status === 'completed')

  return (
    <main id="contenu" className="min-h-screen bg-ivory">
      <Container size="narrow" className="py-32">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-gold">Mon espace</p>
        <h1 className="mt-3 font-serif text-4xl text-noir sm:text-5xl">
          Bonjour {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}
        </h1>

        <div className="mt-10 rounded-card border border-noir/10 bg-ivory-deep/50 p-8">
          <div className="flex items-center gap-5">
            <span
              aria-hidden
              className="flex h-16 w-16 items-center justify-center rounded-full bg-noir font-serif text-xl text-ivory"
            >
              {initials}
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-ink/60">
                {isProfessional ? 'Profil professionnel' : 'Profil client'}
              </p>
              <p className="mt-1 font-serif text-2xl text-noir">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gold">{roleLabel(user.role)}</p>
            </div>
          </div>

          <dl className="mt-8 space-y-4 border-t border-noir/10 pt-8 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/60">Adresse email</dt>
              <dd className="text-right text-noir">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-2 text-ink/60">
                <Phone className="h-4 w-4" />
                Téléphone
              </dt>
              <dd className="text-right text-noir">{user.phone ?? 'Non renseigné'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="flex items-center gap-2 text-ink/60">
                <UserRound className="h-4 w-4" />
                Membre depuis
              </dt>
              <dd className="text-right text-noir">
                {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(user.createdAt))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Button to="/experiences" variant="outline" size="lg">
            Découvrir les expériences
          </Button>
          <Button onClick={logout} variant="ghost" size="lg" className="justify-self-start gap-2">
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </div>

        {isProfessional ? (
          <div className="mt-14 border border-noir/10 rounded-card bg-noir p-8 text-ivory">
            <p className="flex items-center gap-3 font-serif text-2xl">
              <Briefcase className="h-6 w-6 text-gold-light" />
              Votre espace professionnel
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70">
              Gérez la fiche visible des clients et ouvrez vos créneaux de réservation.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <Link
                to="/profil-professionnel"
                className="inline-block text-sm uppercase tracking-[0.2em] text-gold-light hover:text-ivory"
              >
                Ma vitrine →
              </Link>
              <Link
                to="/disponibilites"
                className="inline-block text-sm uppercase tracking-[0.2em] text-gold-light hover:text-ivory"
              >
                Mes disponibilités →
              </Link>
            </div>
          </div>
        ) : null}

        <BookingsSection
          heading="Vos réservations à venir"
          emptyHeading="Aucune réservation pour l'instant"
          emptyText="Parcourez le catalogue et réservez votre prochaine parenthèse en quelques secondes."
          emptyCta="/experiences"
          bookingsCount={upcoming.length}
          error={bookingsState.error}
          isPending={isPending}
          bookings={upcoming}
          cancellingId={cancellingId}
          cancelError={cancelError}
          onCancel={cancelBooking}
        />

        {past.length > 0 ? (
          <BookingsSection
            heading="Historique"
            emptyHeading=""
            emptyText=""
            bookingsCount={past.length}
            error={false}
            isPending={false}
            bookings={past}
            cancellingId={null}
            cancelError={null}
            archive
          />
        ) : null}
      </Container>
    </main>
  )
}

interface BookingsSectionProps {
  heading: string
  emptyHeading: string
  emptyText: string
  emptyCta?: string
  bookingsCount: number
  error: boolean
  isPending: boolean
  bookings: PublicBooking[]
  cancellingId: string | null
  cancelError: string | null
  onCancel?: (id: string) => void
  archive?: boolean
}

function BookingsSection({
  heading,
  emptyHeading,
  emptyText,
  emptyCta = '/experiences',
  bookingsCount,
  error,
  isPending,
  bookings,
  cancellingId,
  cancelError,
  onCancel,
  archive = false,
}: BookingsSectionProps) {
  return (
    <section className={cn('mt-14', archive ? 'mt-10' : '')} aria-label={heading}>
      <p className="flex items-center gap-3 font-serif text-2xl">
        <CalendarHeart className={cn('h-6 w-6', archive ? 'text-gold' : 'text-gold-light')} />
        {heading}
      </p>

      {error ? (
        <div className="mt-6 rounded-card border border-noir/10 bg-white/40 p-7">
          <p className="font-serif text-xl text-noir">Impossible de charger vos réservations.</p>
          <p className="mt-1 text-sm text-ink/70">Rafraîchissez la page pour réessayer.</p>
        </div>
      ) : isPending ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-card bg-ivory-deep/70" />
          ))}
        </div>
      ) : bookingsCount === 0 ? (
        <div className="mt-6 rounded-card border border-noir/10 bg-white/40 p-7">
          <p className="font-serif text-xl text-noir">{emptyHeading}</p>
          <p className="mt-1 text-sm text-ink/70">{emptyText}</p>
          <Button to={emptyCta} variant="outline" size="sm" className="mt-5">
            Explorer le catalogue
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              cancelling={cancellingId === booking.id}
              disabled={cancellingId !== null}
              onCancel={onCancel ? () => onCancel(booking.id) : undefined}
            />
          ))}
        </ul>
      )}

      {cancelError ? (
        <p className="mt-4 text-sm text-bordeaux" role="alert">
          {cancelError}
        </p>
      ) : null}
    </section>
  )
}

interface BookingCardProps {
  booking: PublicBooking
  cancelling: boolean
  disabled: boolean
  onCancel?: () => void
}

function BookingCard({ booking, cancelling, disabled, onCancel }: BookingCardProps) {
  const statusMeta = STATUS_LABELS[booking.status]
  const city = booking.establishment?.city ?? ''
  return (
    <li className="flex flex-col gap-5 rounded-card border border-noir/10 bg-white/40 p-5 sm:flex-row sm:items-center">
      <img
        src={placeholder({
          from: booking.service.imageFrom ?? '#2a2018',
          to: booking.service.imageTo ?? '#5e1f2a',
          label: booking.service.name,
          note: `${booking.service.durationMinutes} min · ${city}`,
          labelColor: '#f5f1ea',
          noteColor: '#d4af6a',
        })}
        alt=""
        className="h-24 w-full rounded-card object-cover sm:h-20 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/experiences/${booking.service.slug}`}
            className="font-serif text-xl text-noir transition-colors hover:text-gold"
          >
            {booking.service.name}
          </Link>
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
        </div>
        <p className="mt-1 text-sm text-ink/70">
          {new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(booking.startsAt))} à{' '}
          {new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(booking.startsAt))}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink/50">
          <span>{booking.professional.firstName} {booking.professional.lastName}</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 text-gold" aria-hidden="true" />
            {formatPrice(booking.price)}
          </span>
          {booking.establishment ? <span className="capitalize">{city}</span> : null}
        </p>
      </div>
      {onCancel ? (
        <Button
          size="sm"
          variant="outline"
          disabled={disabled || cancelling}
          onClick={onCancel}
          className="shrink-0 justify-self-start text-bordeaux hover:border-bordeaux hover:text-bordeaux sm:justify-self-end"
        >
          {cancelling ? 'Annulation…' : 'Annuler'}
        </Button>
      ) : null}
    </li>
  )
}

function roleLabel(role: string): string {
  switch (role) {
    case 'admin':
      return 'Administrateur'
    case 'professional':
      return 'Professionnel'
    default:
      return 'Client'
  }
}