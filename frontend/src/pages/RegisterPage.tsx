import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { Briefcase, UserRound } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import { AuthShell } from '@/components/auth/AuthShell'
import { Field, FormError } from '@/components/auth/FormField'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

type AccountKind = 'client' | 'professional'

const kindOptions: Array<{ value: AccountKind; label: string; description: string }> = [
  { value: 'client', label: 'Client', description: 'Réserver des expériences' },
  { value: 'professional', label: 'Professionnel', description: 'Créer votre espace praticien' },
]

export function RegisterPage() {
  const { status, register } = useAuth()
  const navigate = useNavigate()
  const [kind, setKind] = useState<AccountKind>('client')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (status === 'authenticated') {
    return <Navigate to="/compte" replace />
  }

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        role: kind,
      })
      navigate(kind === 'professional' ? '/profil-professionnel' : '/compte', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Inscription impossible')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Nouveau ici ?"
      title="Créer un compte"
      description="Rejoignez NOVA pour réserver vos expériences — ou présenter votre savoir-faire."
    >
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div role="radiogroup" aria-label="Type de compte" className="grid grid-cols-2 gap-4">
          {kindOptions.map((option) => {
            const selectedValue = kind === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selectedValue}
                onClick={() => setKind(option.value)}
                className={cn(
                  'rounded-card border px-5 py-4 text-left transition-colors duration-300',
                  selectedValue ? 'border-noir bg-noir text-ivory' : 'border-noir/15 bg-ivory/60 text-ink hover:border-noir/40',
                )}
              >
                <span className="flex items-center gap-2 font-serif text-lg">
                  {option.value === 'professional' ? <Briefcase className="h-4 w-4" /> : <UserRound className="h-4 w-4" />}
                  {option.label}
                </span>
                <span className={cn('mt-1 block text-xs', selectedValue ? 'text-ivory/70' : 'text-ink/60')}>
                  {option.description}
                </span>
              </button>
            )
          })}
        </div>

        <div className="space-y-6">
          <FormError message={error} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Prénom"
              name="firstName"
              autoComplete="given-name"
              required
              value={form.firstName}
              onChange={update('firstName')}
            />
            <Field
              label="Nom"
              name="lastName"
              autoComplete="family-name"
              required
              value={form.lastName}
              onChange={update('lastName')}
            />
          </div>
          <Field
            label="Adresse email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={update('email')}
          />
          <Field
            label="Téléphone (optionnel)"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={update('phone')}
          />
          <Field
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            helper="8 caractères minimum"
            value={form.password}
            onChange={update('password')}
          />
          <Button type="submit" variant="bordeaux" size="lg" className="w-full" disabled={submitting}>
            {submitting ? 'Création…' : 'Créer mon compte'}
          </Button>
          <p className="text-sm text-ink/70">
            Déjà client ?{' '}
            <Link to="/connexion" className="text-gold underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}