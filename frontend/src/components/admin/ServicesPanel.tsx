import { Star } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { PanelShell } from '@/components/admin/PanelShell'
import { Button } from '@/components/ui/Button'
import { adminApi } from '@/services/admin'
import { useAsyncData } from '@/lib/useAsyncData'
import type { AdminService } from '@/types/admin'

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

export function ServicesPanel() {
  const { user } = useAuth()
  const key = user ? `admin:${user.id}:services` : ''
  const { value, error, loading, reload } = useAsyncData<AdminService[]>(key, () => adminApi.services())

  return (
    <PanelShell overline="Back-office" title="Services" loading={loading} error={error} onRetry={reload}>
      {value ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {value.map((service) => (
            <article
              key={service.id}
              className={`rounded-card border p-5 transition-colors ${
                service.active ? 'border-noir/10 bg-ivory-deep/60' : 'border-dashed border-noir/25 bg-ivory'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-xl text-noir">{service.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-ink/50 capitalize">{service.category}</p>
                  <p className="mt-2 text-sm text-ink/60">
                    {service.professional.firstName} {service.professional.lastName}
                    {service.establishment ? ` · ${service.establishment.name}, ${service.establishment.city}` : ''}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                    <Star className="h-3.5 w-3.5 fill-gold stroke-gold" aria-hidden="true" />
                    {service.rating.toFixed(1)} · {service.reviewsCount} avis
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-bordeaux">{formatPrice(service.price)}</p>
                  <Button
                    variant={service.active ? 'outline' : 'primary'}
                    size="sm"
                    className="mt-3"
                    onClick={() => {
                      void adminApi.setServiceActive(service.id, !service.active).then(reload)
                    }}
                  >
                    {service.active ? 'Ne plus publier' : 'Publier'}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </PanelShell>
  )
}