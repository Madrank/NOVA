import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { RequireAuth, RequireRole } from '@/auth/guards'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { CatalogPage } from '@/pages/CatalogPage'
import { EstablishmentDetailPage } from '@/pages/EstablishmentDetailPage'
import { EstablishmentsPage } from '@/pages/EstablishmentsPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfessionalDetailPage } from '@/pages/ProfessionalDetailPage'
import { ProfessionalsPage } from '@/pages/ProfessionalsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

const AccountPage = lazy(() => import('@/pages/AccountPage').then((m) => ({ default: m.AccountPage })))
const ProfessionalProfilePage = lazy(() =>
  import('@/pages/ProfessionalProfilePage').then((m) => ({ default: m.ProfessionalProfilePage })),
)
const AvailabilityPage = lazy(() =>
  import('@/pages/AvailabilityPage').then((m) => ({ default: m.AvailabilityPage })),
)
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))

function PageLoader() {
  return (
    <main className="flex min-h-svh items-center justify-center" role="status" aria-label="Chargement de la page">
      <span className="inline-flex items-center gap-3 text-sm text-ink/60">
        <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-gold" aria-hidden="true" />
        Chargement…
      </span>
    </main>
  )
}

function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    if (hash) {
      const id = hash.slice(1)
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView()
      }, 80)
      html.style.scrollBehavior = previous
      return () => {
        window.clearTimeout(timer)
        html.style.scrollBehavior = previous
      }
    }
    window.scrollTo(0, 0)
    html.style.scrollBehavior = previous
  }, [pathname, search, hash])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <a
          href="#contenu"
          className="sr-only z-[60] rounded-btn bg-noir px-4 py-2 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Aller au contenu
        </a>
        <Header />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/experiences" element={<CatalogPage />} />
          <Route path="/experiences/:slug" element={<ServiceDetailPage />} />
          <Route path="/professionnels" element={<ProfessionalsPage />} />
          <Route path="/professionnel/:slug" element={<ProfessionalDetailPage />} />
          <Route path="/etablissements" element={<EstablishmentsPage />} />
          <Route path="/etablissement/:slug" element={<EstablishmentDetailPage />} />
          <Route path="/connexion" element={<LoginPage />} />
          <Route path="/inscription" element={<RegisterPage />} />
          <Route
            path="/compte"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profil-professionnel"
            element={
              <RequireRole roles={['professional']}>
                <ProfessionalProfilePage />
              </RequireRole>
            }
          />
          <Route
            path="/disponibilites"
            element={
              <RequireRole roles={['professional']}>
                <AvailabilityPage />
              </RequireRole>
            }
          />
          <Route
            path="/tableau-de-bord"
            element={
              <RequireRole roles={['professional']}>
                <DashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireRole roles={['admin']}>
                <AdminPage />
              </RequireRole>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App