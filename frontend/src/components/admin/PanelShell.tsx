import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface PanelShellProps {
  overline: string
  title: string
  loading: boolean
  error: boolean
  onRetry: () => void
  actions?: ReactNode
  children: ReactNode
}

export function PanelShell({ overline, title, loading, error, onRetry, actions, children }: PanelShellProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge>
            <span className="h-px w-7 bg-gold" aria-hidden="true" />
            {overline}
          </Badge>
          <h2 className="mt-3 font-serif text-2xl text-noir sm:text-3xl">{title}</h2>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>

      {loading ? (
        <p className="mt-6 flex items-center gap-3 text-sm text-ink/60" role="status">
          <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-gold" aria-hidden="true" />
          Chargement…
        </p>
      ) : error ? (
        <div
          role="alert"
          className="mt-6 rounded-card border border-bordeaux/20 bg-bordeaux/5 p-8 text-center"
        >
          <p className="font-serif text-2xl text-noir">Une erreur est survenue</p>
          <Button variant="bordeaux" className="mt-5" onClick={onRetry}>
            Réessayer
          </Button>
        </div>
      ) : (
        <div className="mt-6">{children}</div>
      )}
    </section>
  )
}