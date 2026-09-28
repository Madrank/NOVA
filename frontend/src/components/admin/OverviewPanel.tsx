import { CalendarDays, Euro, Star, UserRound, Users } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { PanelShell } from '@/components/admin/PanelShell'
import { adminApi } from '@/services/admin'
import { useAsyncData } from '@/lib/useAsyncData'
import type { AdminOverview } from '@/types/admin'

interface KpiProps {
  label: string
  value: string
  hint?: string
  icon: typeof Users
}

function Kpi({ label, value, hint, icon: Icon }: KpiProps) {
  return (
    <div className="rounded-card border border-noir/10 bg-ivory-deep/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink/50">{label}</p>
        <Icon className="h-5 w-5 stroke-gold" aria-hidden="true" />
      </div>
      <p className="mt-3 font-serif text-3xl text-noir">{value}</p>
      {hint ? <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/50">{hint}</p> : null}
    </div>
  )
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(
    new Date(iso),
  )
}

export function OverviewPanel() {
  const { user } = useAuth()
  const key = user ? `admin:${user.id}` : ''
  const { value, error, loading, reload } = useAsyncData<AdminOverview>(key, () => adminApi.overview())

  return (
    <PanelShell overline="Back-office" title="Vue d'ensemble" loading={loading} error={error} onRetry={reload}>
      {value ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi
              label="Utilisateurs"
              value={String(value.users.total)}
              hint={`${value.users.clients} clients · ${value.users.professionals} pros`}
              icon={Users}
            />
            <Kpi
              label="Réservations"
              value={String(value.bookings.total)}
              hint={`${value.bookings.confirmed} confirmées · ${value.bookings.pending} en attente`}
              icon={CalendarDays}
            />
            <Kpi
              label="Chiffre d'affaires"
              value={formatPrice(value.revenueCents / 100)}
              hint="confirmé + terminé"
              icon={Euro}
            />
            <Kpi
              label="Catalogue"
              value={`${value.content.servicesActive}/${value.content.servicesTotal}`}
              hint={`${value.content.establishments} établissements`}
              icon={Star}
            />
          </div>

          <div className="rounded-card border border-noir/10 bg-ivory-deep/60">
            <div className="border-b border-noir/10 px-6 py-4">
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-ink/50">
                Dernières réservations
              </p>
            </div>
            {value.recentBookings.length === 0 ? (
              <p className="p-6 text-sm text-ink/60">Aucune réservation pour le moment.</p>
            ) : (
              <ul className="divide-y divide-noir/10">
                {value.recentBookings.map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-noir">{booking.service.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/60">
                        <UserRound className="h-3.5 w-3.5 stroke-gold" aria-hidden="true" />
                        {booking.client.firstName} {booking.client.lastName} · {booking.professional.firstName}{' '}
                        {booking.professional.lastName}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-ink/60">
                      <span className="flex items-center gap-1.5 capitalize">
                        <CalendarDays className="h-3.5 w-3.5 stroke-gold" aria-hidden="true" />
                        {formatDate(booking.startsAt)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 font-medium uppercase tracking-[0.14em] ${
                          booking.status === 'cancelled'
                            ? 'bg-bordeaux/10 text-bordeaux'
                            : booking.status === 'pending'
                              ? 'bg-gold/15 text-gold'
                              : 'bg-ink/5 text-ink/70'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span className="font-serif">{formatPrice(booking.price)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </PanelShell>
  )
}