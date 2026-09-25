import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { AuthShell } from '@/components/auth/AuthShell'
import { Field, FormError } from '@/components/auth/FormField'
import { Button } from '@/components/ui/Button'

export function RegisterPage() {
  const { status, register } = useAuth()
  const navigate = useNavigate()
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
      })
      navigate('/compte', { replace: true })
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
      description="Rejoignez NOVA pour réserver vos expériences de bien-être en quelques secondes."
    >
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
      </form>
    </AuthShell>
  )
}