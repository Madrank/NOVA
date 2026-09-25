import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

function AuthGuardFallback() {
  return (
    <Container size="narrow" className="min-h-screen py-32">
      <div className="space-y-5">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </Container>
  )
}

interface RequireAuthProps {
  children: ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return <AuthGuardFallback />
  }

  if (status === 'anonymous') {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />
  }

  return children
}

interface RequireRoleProps {
  roles: readonly string[]
  children: ReactNode
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { status, user } = useAuth()

  if (status === 'loading') {
    return <AuthGuardFallback />
  }

  if (!user || !roles.includes(user.role)) {
    return (
      <Container size="narrow" className="flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <p className="font-serif text-3xl text-noir">Accès réservé</p>
        <p className="mt-3 text-ink/70">Cette section n'est pas accessible avec votre profil.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-gold hover:text-noir"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour à l'accueil
        </Link>
      </Container>
    )
  }

  return children
}