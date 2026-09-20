import { Concept } from '@/components/landing/Concept'
import { CtaBanner } from '@/components/landing/CtaBanner'
import { Experiences } from '@/components/landing/Experiences'
import { Hero } from '@/components/landing/Hero'
import { Professionals } from '@/components/landing/Professionals'
import { Showcase } from '@/components/landing/Showcase'
import { Testimonials } from '@/components/landing/Testimonials'

export function LandingPage() {
  return (
    <main>
      <Hero />
      <Experiences />
      <Showcase />
      <Professionals />
      <Concept />
      <Testimonials />
      <CtaBanner />
    </main>
  )
}