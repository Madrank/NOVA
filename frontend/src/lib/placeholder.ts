export interface PlaceholderOptions {
  from: string
  to: string
  label: string
  note?: string
  angle?: number
  labelColor?: string
  noteColor?: string
  accent?: string
}

/** Génère une image SVG éditoriale (data URI) en attendant la vraie photographie. */
export function placeholder({
  from,
  to,
  label,
  note,
  angle = 140,
  labelColor = '#12100e',
  noteColor = '#d4af6a',
  accent,
}: PlaceholderOptions): string {
  const gradient = `<linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1600" y2="1200"${angle ? ` gradientTransform="rotate(${angle} 800 600)"` : ""}><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`
  const ring = accent
    ? `<circle cx="1360" cy="360" r="240" fill="none" stroke="${accent}" stroke-opacity="0.3" stroke-width="1.5"/>`
    : ''
  const underline = `<rect x="760" y="660" width="80" height="1" fill="${noteColor}" opacity="0.7"/>`
  const noteText = note
    ? `<text x="800" y="712" font-family="Georgia, serif" font-size="20" letter-spacing="6" fill="${noteColor}" opacity="0.7" text-anchor="middle">${note}</text>`
    : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200"><defs>${gradient}</defs><rect width="1600" height="1200" fill="url(#g)"/>${ring}<text x="800" y="620" font-family="Georgia, 'Times New Roman', serif" font-size="120" letter-spacing="10" fill="${labelColor}" opacity="0.72" text-anchor="middle">${label}</text>${underline}${noteText}</svg>`

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export const visual = {
  hero: { from: '#12100e', to: '#2a2018', label: 'NOVA', note: 'BIEN-ÊTRE & BEAUTÉ' },
  massage: { from: '#e4dccb', to: '#b98a3e', label: 'Massage', note: 'RITUELS & PIERRES' },
  spa: { from: '#12100e', to: '#5e1f2a', label: 'Spa', note: 'THERMAL & SAUNA' },
  beaute: { from: '#ede6db', to: '#d4af6a', label: 'Beauté', note: 'SOINS DU VISAGE' },
  yoga: { from: '#5e1f2a', to: '#b98a3e', label: 'Yoga', note: 'MÉDITATION' },
  bienetre: { from: '#2a2018', to: '#5e1f2a', label: 'Bien-être', note: 'ÉQUILIBRE' },
  signature: { from: '#1c1917', to: '#8a6a2f', label: 'Signature', note: 'EXPÉRIENCES PRIVÉES' },
  duo: { from: '#5e1f2a', to: '#12100e', label: 'Duo', note: 'À PARTAGER' },
} as const