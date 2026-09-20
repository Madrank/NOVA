import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CardContent } from '@/components/ui/CardContent'
import { CardDescription } from '@/components/ui/CardDescription'
import { CardMedia } from '@/components/ui/CardMedia'
import { CardTitle } from '@/components/ui/CardTitle'
import { Container } from '@/components/ui/Container'

const palette = [
  { name: 'ivory', value: '#f5f1ea' },
  { name: 'ivory-deep', value: '#ede6db' },
  { name: 'warm-beige', value: '#e4dccb' },
  { name: 'noir', value: '#12100e' },
  { name: 'ink', value: '#1c1917' },
  { name: 'gold', value: '#b98a3e' },
  { name: 'gold-light', value: '#d4af6a' },
  { name: 'bordeaux', value: '#5e1f2a' },
  { name: 'success', value: '#3e6b4f' },
  { name: 'warning', value: '#9a6b2f' },
  { name: 'danger', value: '#8c2f39' },
] as const

const mediaUri =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0" y1="0" x2="1" y2="1"%3E%3Cstop offset="0" stop-color="%23e4dccb"/%3E%3Cstop offset="1" stop-color="%23b98a3e"/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="600" fill="url(%23g)"/%3E%3Ctext x="400" y="330" font-family="Georgia, serif" font-size="72" fill="%2312100e" text-anchor="middle" opacity="0.85" letter-spacing="4"%3ENOVA%3C/text%3E%3C/svg%3E'

function SectionLabel({ children }: { children: string }) {
  return (
    <Badge className="mb-5">
      <span className="h-px w-6 bg-gold" aria-hidden="true" />
      {children}
    </Badge>
  )
}

export function DesignSystemPreview() {
  return (
    <div className="min-h-screen bg-ivory">
      <header className="border-b border-noir/10">
        <Container className="flex items-center justify-between py-5">
          <span className="font-serif text-2xl tracking-[0.12em] text-noir">NOVA</span>
          <Badge tone="noir">Design system · v0</Badge>
        </Container>
      </header>

      <Container as="main" className="space-y-24 py-16 lg:py-24">
        <section>
          <SectionLabel>Palette</SectionLabel>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {palette.map((c) => (
              <div key={c.name} className="rounded-card border border-noir/10 bg-white/40">
                <div className="h-24 rounded-t-card" style={{ backgroundColor: c.value }} />
                <div className="px-3 py-2.5">
                  <p className="font-serif text-sm text-noir">{c.name}</p>
                  <p className="text-xs text-ink/60">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionLabel>Typography</SectionLabel>
          <div className="space-y-3 border-l border-gold pl-6">
            <p className="font-serif text-6xl lg:text-7xl">Prenez le temps de vous retrouver.</p>
            <p className="font-serif text-3xl text-noir">Une expérience pensée pour vous.</p>
            <p className="max-w-xl text-base leading-relaxed text-ink/75">
              Chez NOVA, chaque détail compte : l'architecture de la page, la respiration du
              contenu et la clarté du parcours de réservation. Le corps de texte utilise Inter.
            </p>
            <p className="text-[0.6875rem] uppercase tracking-[0.28em] text-gold">Étiquette · Badge</p>
          </div>
        </section>

        <section>
          <SectionLabel>Buttons</SectionLabel>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Réserver</Button>
            <Button variant="light">Découvrir</Button>
            <Button variant="outline">En savoir plus</Button>
            <Button variant="ghost">Contact</Button>
            <Button variant="bordeaux">Bordeaux</Button>
            <Button size="sm" variant="primary">
              Small
            </Button>
            <Button size="lg" variant="outline">
              Large
            </Button>
            <Button disabled variant="primary">
              Désactivé
            </Button>
          </div>
        </section>

        <section>
          <SectionLabel>Badges</SectionLabel>
          <div className="flex flex-wrap items-center gap-6">
            <Badge tone="gold">Massage</Badge>
            <Badge tone="noir">Spa</Badge>
            <Badge tone="bordeaux">Soin du visage</Badge>
            <Badge tone="outline">Yoga</Badge>
          </div>
        </section>

        <section>
          <SectionLabel>Cards</SectionLabel>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardMedia src={mediaUri} />
              <CardContent>
                <Badge className="mb-3">Massage · 60 min</Badge>
                <CardTitle>Bain de bois et pierres chaudes</CardTitle>
                <CardDescription className="mt-2">
                  Une parenthèse enveloppante, mêlant chaleur du bois et profondeur du toucher.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardMedia src={mediaUri} aspect="aspect-[3/4]" />
              <CardContent>
                <Badge className="mb-3" tone="noir">
                  Spa · En duo
                </Badge>
                <CardTitle>Escape thermale à deux</CardTitle>
                <CardDescription className="mt-2">
                  Rituel privatif dans un écrin minéral, à partager ou à s'offrir.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Badge className="mb-3" tone="bordeaux">
                  Soin du visage
                </Badge>
                <CardTitle>Éclat immédiat</CardTitle>
                <CardDescription className="mt-2">
                  Diagnostic minutieux, gestes précis, résultats visibles dès la sortie du soin.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </Container>
    </div>
  )
}