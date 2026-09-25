import { Briefcase, Building2, Check, Loader2, Save, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Field } from '@/components/auth/FormField'
import { FormError } from '@/components/auth/FormField'
import { Skeleton } from '@/components/ui/Skeleton'
import { establishmentsApi, professionalsApi } from '@/services/professionals'
import type { ProfessionalProfileInput } from '@/types/professional'
import type { PublicEstablishment } from '@/types/establishment'

const emptyForm: ProfessionalProfileInput = {
  title: '',
  bio: '',
  specialties: [],
  establishmentId: null,
}

function parseSpecialties(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ProfessionalProfilePage() {
  const [profile, setProfile] = useState<ProfessionalProfileInput | null>(null)
  const [exists, setExists] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [establishments, setEstablishments] = useState<PublicEstablishment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([professionalsApi.me(), establishmentsApi.list()])
      .then(([me, list]) => {
        if (cancelled) return
        setExists(me.profile !== null)
        setProfile(
          me.profile
            ? {
                title: me.profile.title,
                bio: me.profile.bio,
                specialties: me.profile.specialties,
                establishmentId: me.profile.establishment?.id ?? null,
              }
            : { ...emptyForm },
        )
        setEstablishments(list.establishments)
      })
      .catch(() => {
        if (cancelled) return
        setError('Le profil n\u2019a pas pu être chargé.')
      })
      .finally(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  function update<K extends keyof ProfessionalProfileInput>(field: K) {
    return (value: ProfessionalProfileInput[K]) => {
      setSaved(false)
      setProfile((current) => (current ? { ...current, [field]: value } : current))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile) return
    setError(null)
    setSaved(false)
    setSaving(true)
    try {
      const input = {
        ...profile,
        establishmentId: profile.establishmentId ?? null,
      }
      if (exists) {
        await professionalsApi.updateMe(input)
      } else {
        await professionalsApi.createMe(input)
        setExists(true)
      }
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible')
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) {
    return (
      <Container size="narrow" className="min-h-screen py-32">
        <div className="space-y-5">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-80" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Container>
    )
  }

  return (
    <main id="contenu" className="bg-ivory">
      <section className="relative overflow-hidden bg-noir">
        <div className="absolute inset-0 bg-gradient-to-br from-noir via-noir to-bordeaux/60" aria-hidden="true" />
        <Container className="relative z-10 px-5 pb-12 pt-32 sm:px-8 lg:px-12 lg:pt-40">
          <p className="mb-5 inline-flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.28em] text-gold-light">
            <Briefcase className="h-4 w-4" aria-hidden="true" />
            Espace professionnel
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] text-ivory sm:text-5xl">
            Votre <em className="italic text-gold-light">vitrine</em> sur NOVA.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/70 sm:text-base">
            Présentez votre titre, votre savoir-faire et le lieu où vous exercez. Cette fiche sera visible
            par les clients.
          </p>
        </Container>
      </section>

      <Container as="div" className="py-12 lg:py-16" size="narrow">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormError message={error} />

          <div className="overflow-hidden rounded-card border border-noir/10 bg-white/40 p-7">
            {profile ? (
              <div className="space-y-6">
                <Field
                  label="Titre professionnel"
                  name="title"
                  required
                  helper="Ex : Praticienne en massages, Sophrologue"
                  value={profile.title}
                  onChange={(event) => update('title')(event.target.value)}
                />
                <div>
                  <label htmlFor="bio" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/60">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    required
                    rows={5}
                    value={profile.bio}
                    onChange={(event) => update('bio')(event.target.value)}
                    placeholder="Racontez votre approche, vos formations, votre sensibilité."
                    className="w-full resize-y rounded-btn border border-noir/20 bg-ivory px-4 py-3 text-sm text-noir placeholder:text-ink/40 focus:border-gold focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-ink/50">{profile.bio.length} caractères</p>
                </div>
                <SpecialtiesEditor
                  specialties={profile.specialties}
                  onChange={(specialties) => update('specialties')(specialties)}
                />
                <div>
                  <label htmlFor="establishmentId" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/60">
                    Établissement de rattachement
                  </label>
                  <select
                    id="establishmentId"
                    name="establishmentId"
                    value={profile.establishmentId ?? ''}
                    onChange={(event) => update('establishmentId')(event.target.value || null)}
                    className="w-full cursor-pointer rounded-btn border border-noir/20 bg-ivory px-4 py-3 text-sm text-noir focus:border-gold focus:outline-none"
                  >
                    <option value="">Indépendant (sans établissement)</option>
                    {establishments.map((establishment) => (
                      <option key={establishment.id} value={establishment.id}>
                        {establishment.name} — {establishment.address.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <Skeleton className="h-40 w-full" />
            )}
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {saved ? (
              <p className="inline-flex items-center gap-2 text-sm text-gold">
                <Check className="h-4 w-4" aria-hidden="true" />
                Profil enregistré
              </p>
            ) : (
              <p className="text-sm text-ink/50">Vos modifications sont enregistrées au moment voulu.</p>
            )}
            <Button type="submit" variant="bordeaux" size="lg" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
              {saving ? 'Enregistrement…' : 'Enregistrer mon profil'}
            </Button>
          </div>
        </form>

        <div className="mt-12 grid gap-4 rounded-card border border-noir/10 bg-white/40 p-6 sm:grid-cols-3">
          {[
            { icon: Sparkles, label: 'Visibilité', text: 'Votre fiche apparaît dans le réseau et sur la fiche de votre établissement.' },
            { icon: Building2, label: 'Rattachement', text: 'Sélectionnez l\u2019établissement où vous exercez — il deviendra votre lieu de pratique.' },
            { icon: Check, label: 'Contrôle', text: 'Modifiez votre présentation à tout moment depuis cet espace.' },
          ].map(({ icon: Icon, label, text }) => (
            <div key={label}>
              <Icon className="h-5 w-5 text-gold" aria-hidden="true" />
              <h3 className="mt-3 font-serif text-lg text-noir">{label}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/60">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Badge tone="outline">Domaine réservé aux professionnels</Badge>
        </div>
      </Container>
    </main>
  )
}

function SpecialtiesEditor({
  specialties,
  onChange,
}: {
  specialties: string[]
  onChange: (specialties: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function add() {
    const items = parseSpecialties(draft)
    if (items.length === 0) return
    onChange([...specialties, ...items.filter((item) => !specialties.includes(item))].slice(0, 12))
    setDraft('')
  }

  return (
    <div>
      <label htmlFor="specialties" className="mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-ink/60">
        Spécialités
      </label>
      {specialties.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <span
              key={specialty}
              className="inline-flex items-center gap-1.5 rounded-full border border-noir/15 bg-ivory px-3 py-1 text-xs text-ink/80"
            >
              {specialty}
              <button
                type="button"
                aria-label={`Retirer ${specialty}`}
                onClick={() => onChange(specialties.filter((item) => item !== specialty))}
                className="text-ink/50 transition-colors hover:text-bordeaux"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex gap-2">
        <input
          id="specialties"
          name="specialties"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              add()
            }
          }}
          placeholder="Massage, Rituels, Pierres chaudes"
          className="w-full rounded-btn border border-noir/20 bg-ivory px-4 py-3 text-sm text-noir placeholder:text-ink/40 focus:border-gold focus:outline-none"
        />
        <Button type="button" variant="outline" onClick={add}>
          Ajouter
        </Button>
      </div>
      <p className="mt-2 text-xs text-ink/50">{specialties.length}/12 spécialités</p>
    </div>
  )
}