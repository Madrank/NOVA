import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { RequireAuth, RequireRole } from '@/auth/guards'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { AccountPage } from '@/pages/AccountPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { EstablishmentDetailPage } from '@/pages/EstablishmentDetailPage'
import { EstablishmentsPage } from '@/pages/EstablishmentsPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfessionalDetailPage } from '@/pages/ProfessionalDetailPage'
import { ProfessionalProfilePage } from '@/pages/ProfessionalProfilePage'
import { ProfessionalsPage } from '@/pages/ProfessionalsPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'

function ScrollToTop() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    window.scrollTo(0, 0)
    html.style.scrollBehavior = previous
  }, [pathname, search])

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
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App