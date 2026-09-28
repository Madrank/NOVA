import { CalendarDays, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/auth/useAuth'
import { PanelShell } from '@/components/admin/PanelShell'
import { adminApi } from '@/services/admin'
import { useAsyncData } from '@/lib/useAsyncData'
import type { AdminBooking } from '@/types/admin'

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'cancelled', label: 'Annulées' },
  { value: 'completed', label: 'Terminées' },
]

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function BookingsPanel() {
  const { user } = useAuth()
  const [status, setStatus] = useState('all')
  const key = user ? `admin:${user.id}:bookings:${status}` : ''
  const { value, error, loading, reload } = useAsyncData<AdminBooking[]>(key, () =>
    adminApi.bookings(status === 'all' ? undefined : status),
  )

  return (
    <PanelShell
      overline="Back-office"
      title="Réservations"
      loading={loading}
      error={error}
      onRetry={reload}
      actions={
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-btn border border-noir/20 bg-ivory px-3 py-2.5 text-xs uppercase tracking-[0.18em] text-noir focus:outline-2 focus:outline-gold"
          aria-label="Filtrer par statut"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      }
    >
      {value ? (
        <div className="overflow-x-auto rounded-card border border-noir/10 bg-ivory-deep/60">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-noir/10 text-[0.6875rem] uppercase tracking-[0.24em] text-ink/50">
                <th className="px-6 py-4 font-medium">Prestation</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium">Praticien</th>
                <th className="px-6 py-4 font-medium">Début</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 text-right font-medium">Prix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noir/10">
              {value.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-ink/60">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                value.map((booking) => (
                  <tr key={booking.id} className="text-ink/70">
                    <td className="px-6 py-4 font-medium text-noir">{booking.service.name}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5">
                        <UserRound className="h-4 w-4 stroke-gold" aria-hidden="true" />
                        {booking.client.firstName} {booking.client.lastName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.professional.firstName} {booking.professional.lastName}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4 stroke-gold" aria-hidden="true" />
                        {formatDate(booking.startsAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${
                          booking.status === 'cancelled'
                            ? 'bg-bordeaux/10 text-bordeaux'
                            : booking.status === 'pending'
                              ? 'bg-gold/15 text-gold'
                              : 'bg-ink/5 text-ink/70'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-serif text-noir">{formatPrice(booking.price)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </PanelShell>
  )
}