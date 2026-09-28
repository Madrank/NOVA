import { Search, ShieldAlert, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/auth/useAuth'
import { PanelShell } from '@/components/admin/PanelShell'
import { Button } from '@/components/ui/Button'
import { adminApi } from '@/services/admin'
import { useAsyncData } from '@/lib/useAsyncData'
import type { AdminRole, AdminUser } from '@/types/admin'

const ROLE_LABELS: Record<AdminRole, string> = {
  client: 'Client',
  professional: 'Professionnel',
  admin: 'Admin',
}

export function UsersPanel() {
  const { user } = useAuth()
  const [role, setRole] = useState('all')
  const [query, setQuery] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const key = user ? `admin:${user.id}:users:${role}:${appliedQuery}` : ''
  const { value, error, loading, reload } = useAsyncData<AdminUser[]>(key, () => adminApi.users({ role, q: appliedQuery || undefined }))

  function submitSearch(event: FormEvent) {
    event.preventDefault()
    setAppliedQuery(query.trim())
  }

  return (
    <PanelShell
      overline="Back-office"
      title="Utilisateurs"
      loading={loading}
      error={error}
      onRetry={reload}
      actions={
        <>
          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-btn border border-noir/20 bg-ivory px-3 py-2.5 text-xs uppercase tracking-[0.18em] text-noir focus:outline-2 focus:outline-gold"
            aria-label="Filtrer par rôle"
          >
            <option value="all">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="professional">Professionnels</option>
            <option value="admin">Admins</option>
          </select>
        </>
      }
    >
      <form onSubmit={submitSearch} className="mb-6 flex max-w-md items-center gap-3">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-ink/40" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, prénom ou email…"
            className="w-full rounded-btn border border-noir/20 bg-ivory py-3 pl-10 pr-4 text-sm text-noir placeholder:text-ink/40 focus:outline-2 focus:outline-gold"
          />
        </label>
        <Button type="submit" variant="light" className="px-5">
          Rechercher
        </Button>
      </form>

      {value ? (
        <div className="overflow-x-auto rounded-card border border-noir/10 bg-ivory-deep/60">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-noir/10 text-[0.6875rem] uppercase tracking-[0.24em] text-ink/50">
                <th className="px-6 py-4 font-medium">Utilisateur</th>
                <th className="px-6 py-4 font-medium">Rôle</th>
                <th className="px-6 py-4 font-medium">Inscrit le</th>
                <th className="px-6 py-4 text-right font-medium">Modifier le rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-noir/10">
              {value.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-6 text-center text-ink/60">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                value.map((account) => {
                  const isAdmin = account.role === 'admin'
                  return (
                    <tr key={account.id} className="text-ink/70">
                      <td className="px-6 py-4">
                        <p className="flex items-center gap-2 font-medium text-noir">
                          <UserRound className="h-4 w-4 stroke-gold" aria-hidden="true" />
                          {account.firstName} {account.lastName}
                        </p>
                        <p className="mt-0.5 text-xs text-ink/50">{account.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize">{ROLE_LABELS[account.role]}</span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(
                          new Date(account.createdAt),
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 text-xs text-ink/40">
                            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                            Protégé
                          </span>
                        ) : (
                          <select
                            value={account.role}
                            onChange={(event) => {
                              const next = event.target.value as 'client' | 'professional'
                              void adminApi.changeRole(account.id, next).then(reload)
                            }}
                            className="rounded-btn border border-noir/20 bg-ivory px-3 py-2 text-xs capitalize tracking-[0.12em] text-noir focus:outline-2 focus:outline-gold"
                            aria-label={`Changer le rôle de ${account.email}`}
                          >
                            <option value="client">Client</option>
                            <option value="professional">Professionnel</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </PanelShell>
  )
}