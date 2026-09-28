import { LayoutDashboard, CalendarDays, Users, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/auth/useAuth'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { OverviewPanel } from '@/components/admin/OverviewPanel'
import { UsersPanel } from '@/components/admin/UsersPanel'
import { BookingsPanel } from '@/components/admin/BookingsPanel'
import { ServicesPanel } from '@/components/admin/ServicesPanel'
import { cn } from '@/lib/cn'

type AdminTab = 'apercu' | 'utilisateurs' | 'reservations' | 'services'

const TABS: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'apercu', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
  { id: 'reservations', label: 'Réservations', icon: CalendarDays },
  { id: 'services', label: 'Services', icon: Sparkles },
]

export function AdminPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<AdminTab>('apercu')

  return (
    <Container as="main" className="py-14 sm:py-20">
      <SectionHeading
        overline="Back-office"
        title={
          <>
            Administration.
            <br />
            <span className="text-gold">Vue d'ensemble de la plateforme.</span>
          </>
        }
        description={`Connecté(e) en tant qu'administrateur${user ? ` — ${user.firstName} ${user.lastName}` : ''}.`}
      />

      <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Sections du back-office">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              'inline-flex items-center gap-2 rounded-btn px-5 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300',
              tab === id ? 'bg-noir text-ivory' : 'bg-ivory-deep/60 text-ink/60 hover:text-noir',
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {tab === 'apercu' ? <OverviewPanel /> : null}
        {tab === 'utilisateurs' ? <UsersPanel /> : null}
        {tab === 'reservations' ? <BookingsPanel /> : null}
        {tab === 'services' ? <ServicesPanel /> : null}
      </div>
    </Container>
  )
}