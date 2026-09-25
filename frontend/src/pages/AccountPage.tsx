import { Briefcase, CalendarHeart, LogOut, Phone, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function AccountPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const isProfessional = user.role === 'professional'

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
              Gérez la fiche visible des clients : titre, bio, spécialités et lieu de pratique.
            </p>
            <Link
              to="/profil-professionnel"
              className="mt-6 inline-block text-sm uppercase tracking-[0.2em] text-gold-light hover:text-ivory"
            >
              Accéder à ma vitrine →
            </Link>
          </div>
        ) : null}

        <div className="mt-14 border border-noir/10 rounded-card bg-noir p-8 text-ivory">
          <p className="flex items-center gap-3 font-serif text-2xl">
            <CalendarHeart className="h-6 w-6 text-gold-light" />
            Vos réservations arrivent bientôt
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/70">
            La gestion de vos réservations est prévue lors de la mise en place du système de booking (prochaine
            grande étape).
          </p>
          <Link to="/experiences" className="mt-6 inline-block text-sm uppercase tracking-[0.2em] text-gold-light hover:text-ivory">
            Explorer le catalogue →
          </Link>
        </div>
      </Container>
    </main>
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