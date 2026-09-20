import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LandingPage } from '@/pages/LandingPage'

function App() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only z-[60] rounded-btn bg-noir px-4 py-2 text-sm text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Aller au contenu
      </a>
      <Header />
      <div id="contenu">
        <LandingPage />
      </div>
      <Footer />
    </>
  )
}

export default App