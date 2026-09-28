import {
  ArrowRight,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Euro,
  Hourglass,
  MapPin,
  Star,
  UserRound,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { dashboardApi } from '@/services/dashboard'
import type { ProDashboard } from '@/types/dashboard'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function dateOf(iso: string): { day: string; time: string } {
  const date = new Date(iso)
  return {
    day: new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date),
    time: new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(date),
  }
}

function shortDateOf(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso))
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function dayNumber(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function isToday(iso: string): boolean {
  const current = new Date()
  const target = new Date(iso)
  return (
    current.getFullYear() === target.getFullYear() &&
    current.getMonth() === target.getMonth() &&
    current.getDate() === target.getDate()
  )
}

interface LoadState {
  key: string
  value: ProDashboard | null
  error: boolean
}

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: typeof CalendarDays
}

function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-card border border-noir/10 bg-ivory-deep/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink/50">{label}</p>
        <Icon className="h-5 w-5 stroke-gold" aria-hidden="true" />
      </div>
      <p className="mt-4 font-serif text-4xl text-noir">{value}</p>
      {hint ? <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/50">{hint}</p> : null}
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [state, setState] = useState<LoadState>({ key: '', value: null, error: false })

  const key = user ? `dash:${user.id}` : ''
  const isPending = state.key !== key

  useEffect(() => {
    if (!key) return
    let cancelled = false
    dashboardApi
      .mine()
      .then((value) => {
        if (!cancelled) setState({ key, value, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ key, value: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [key])

  async function refresh() {
    if (!key) return
    setState({ key: '', value: null, error: false })
    const value = await dashboardApi.mine()
    setState({ key, value, error: false })
    void dayNumber(new Date())
  }

  const dashboard = state.value
  const loading = isPending || (!state.error && !dashboard)

  return (
    <Container as="main" className="py-14 sm:py-20">
      <SectionHeading
        overline="Espace professionnel"
        title={
          <>
            Bonjour, {user?.firstName ?? 'cher(e) praticien(ne)'}.
            <br />
            <span className="text-gold">Voici votre activité en un coup d'œil.</span>
          </>
        }
        description="Votre tableau de bord réunit vos rendez-vous, les créneaux en attente de paiement et la santé de votre activité."
      />

      {loading ? (
        <p className="mt-12 flex items-center gap-3 text-sm text-ink/60" role="status">
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-gold" aria-hidden="true" />
          Chargement de votre tableau de bord…
        </p>
      ) : state.error ? (
        <div className="mt-12 rounded-card border border-bordeaux/20 bg-bordeaux/5 p-8">
          <p className="font-serif text-2xl text-noir">Impossible de charger votre tableau de bord</p>
          <p className="mt-2 text-sm text-ink/60">
            Vous n'avez peut-être pas encore créé votre fiche professionnelle. L'espace se complète dès que vous publiez
            vos disponibilités.
          </p>
          <Button variant="bordeaux" className="mt-6" onClick={() => void refresh()}>
            Réessayer
          </Button>
        </div>
      ) : dashboard ? (
        <div className="mt-12 space-y-10">
          <section className="grid grid-cols-2 gap-4 lg:grid-cols-3" aria-label="Statistiques">
            <StatCard label="À venir" value={String(dashboard.upcoming)} hint="rendez-vous confirmés" icon={CalendarDays} />
            <StatCard label="Aujourd'hui" value={String(dashboard.today)} hint="aujourd'hui" icon={CalendarClock} />
            <StatCard
              label="En attente de paiement"
              value={String(dashboard.pendingCount)}
              hint={dashboard.pendingCount > 0 ? 'créneaux réservés en attente' : 'aucun créneau réservé'}
              icon={Hourglass}
            />
            <StatCard label="Rendez-vous terminés" value={String(dashboard.completed)} icon={CheckCircle2} />
            <StatCard label="Chiffre d'affaires confirmé" value={formatPrice(dashboard.confirmedRevenue)} icon={Euro} />
            <StatCard
              label="Note moyenne"
              value={dashboard.averageRating > 0 ? dashboard.averageRating.toFixed(2) : '—'}
              icon={Star}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {dashboard.nextAppointment ? (
                <article className="rounded-card border border-noir/10 bg-ivory-deep/60 p-6 sm:p-8">
                  <Badge className="mb-4">
                    <span className="h-px w-7 bg-gold" aria-hidden="true" />
                    Prochain rendez-vous
                  </Badge>
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                      <h3 className="font-serif text-3xl text-noir">{dashboard.nextAppointment.service.name}</h3>
                      <p className="mt-2 flex items-center gap-2 text-sm text-ink/60 capitalize">
                        <Clock3 className="h-4 w-4 stroke-gold" aria-hidden="true" />
                        {dateOf(dashboard.nextAppointment.startsAt).day} · {dateOf(dashboard.nextAppointment.startsAt).time}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                        <UserRound className="h-4 w-4 stroke-gold" aria-hidden="true" />
                        {dashboard.nextAppointment.client.firstName} {dashboard.nextAppointment.client.lastName}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-ink/60">
                        <MapPin className="h-4 w-4 stroke-gold" aria-hidden="true" />
                        {dashboard.nextAppointment.establishment?.name ?? 'Sur place'} ·{' '}
                        {dashboard.nextAppointment.establishment?.city ?? ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-3xl text-bordeaux">{formatPrice(dashboard.nextAppointment.price)}</p>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="flex h-full flex-col items-start justify-center rounded-card border border-dashed border-noir/20 p-8">
                  <p className="font-serif text-2xl text-noir">Aucun rendez-vous à venir</p>
                  <p className="mt-2 text-sm text-ink/60">
                    Vos créneaux sont disponibles. Publiez vos disponibilités pour recevoir des réservations.
                  </p>
                  <Button to="/disponibilites" className="mt-6">
                    Créer mes disponibilités
                  </Button>
                </div>
              )}
            </div>

            <aside className="rounded-card border border-noir/10 bg-ivory-deep/60 p-6">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink/50">Raccourcis</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/disponibilites"
                    className="group flex items-center justify-between rounded-btn border border-noir/10 bg-ivory px-4 py-3 text-sm text-noir transition-colors hover:border-noir"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarPlus className="h-4 w-4 stroke-gold" aria-hidden="true" />
                      Gérer mes disponibilités
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profil-professionnel"
                    className="group flex items-center justify-between rounded-btn border border-noir/10 bg-ivory px-4 py-3 text-sm text-noir transition-colors hover:border-noir"
                  >
                    <span className="flex items-center gap-2">
                      <UserRound className="h-4 w-4 stroke-gold" aria-hidden="true" />
                      Modifier ma fiche professionnelle
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/experiences"
                    className="group flex items-center justify-between rounded-btn border border-noir/10 bg-ivory px-4 py-3 text-sm text-noir transition-colors hover:border-noir"
                  >
                    <span className="flex items-center gap-2">
                      <CalendarCheck2 className="h-4 w-4 stroke-gold" aria-hidden="true" />
                      Explorer le catalogue
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </aside>
          </section>

          <section aria-label="Mon agenda">
            <Badge className="mb-4">
              <span className="h-px w-7 bg-gold" aria-hidden="true" />
              Aujourd'hui
            </Badge>
            <div className="rounded-card border border-noir/10 bg-ivory-deep/60 p-6 sm:p-8">
              {dashboard.appointments.length === 0 ? (
                <p className="text-sm text-ink/60">
                  Votre agenda est vide. Publiez des disponibilités pour recevoir des réservations.
                </p>
              ) : (
                <ul className="divide-y divide-noir/10">
                  {dashboard.appointments.map((appointment) => {
                    const today = isToday(appointment.startsAt)
                    return (
                      <li
                        key={appointment.id}
                        className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium text-noir">
                            {today ? "Aujourd'hui : " : ''}
                            {appointment.service.name}
                          </p>
                          <p className="mt-0.5 text-sm text-ink/60 capitalize">
                            {shortDateOf(appointment.startsAt)} · {dateOf(appointment.startsAt).time} ·{' '}
                            {appointment.client.firstName} {appointment.client.lastName}
                          </p>
                        </div>
                        <p className="font-serif text-lg text-bordeaux">{formatPrice(appointment.price)}</p>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </Container>
  )
}