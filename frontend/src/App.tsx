import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { CatalogPage } from '@/pages/CatalogPage'
import { LandingPage } from '@/pages/LandingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App