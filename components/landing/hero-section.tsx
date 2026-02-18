import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003366] to-black px-4 pt-24 pb-16 text-center overflow-hidden">
      {/* Logo no background - direita */}
      <div className="absolute inset-0 flex items-center justify-end pointer-events-none pr-8 md:pr-16 lg:pr-24">
        <Image
          src="/logo-dark.png"
          alt=""
          width={500}
          height={500}
          className="opacity-[0.06] object-contain"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08)_0%,transparent_70%)]" />
      <div className="relative z-10 max-w-4xl space-y-8">
        <p className="font-medium uppercase tracking-[0.3em] text-[#FFD700]/90 text-sm">
          Instituto de Formação de Líderes
        </p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Conheça o{" "}
          <span className="text-[#FFD700]">IFL Jovem São Paulo</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-white/80 sm:text-xl">
          Moldando o futuro através da formação de líderes de alta performance 
          para a construção de um país próspero e livre.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg px-8"
          >
            <Link href="#participar">Quero Participar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 text-lg px-8 bg-transparent"
          >
            <Link href="#sobre">Saber Mais</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
