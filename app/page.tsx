import { LandingHeader } from "@/components/landing/landing-header"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { ValuesSection } from "@/components/landing/values-section"
import { DiretoriaSection } from "@/components/landing/diretoria-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CicloFormacaoSection } from "@/components/landing/ciclo-formacao-section"
import { CTASection } from "@/components/landing/cta-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#001f3f]">
      <LandingHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ValuesSection />
        <DiretoriaSection />
        <TestimonialsSection />
        <CicloFormacaoSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  )
}
