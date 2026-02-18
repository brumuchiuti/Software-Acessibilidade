"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section id="participar" className="relative overflow-hidden bg-gradient-to-br from-[#001f3f] via-[#003366] to-black py-24 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,215,0,0.12)_0%,transparent_60%)]" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="mb-6 font-[family-name:var(--font-serif)] text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Venha fazer parte deste movimento
        </h2>
        <p className="mb-4 text-lg text-white/85 sm:text-xl">
          Faça parte da próxima geração de líderes
        </p>
        <p className="mx-auto mb-12 max-w-2xl text-white/75">
          Se você deseja ser parte de um grupo seleto de líderes que acredita em um futuro próspero, 
          junte-se a nós no Instituto de Formação de Líderes. Juntos, podemos construir um país onde 
          a liberdade e a responsabilidade andam lado a lado.
        </p>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg px-10 py-6"
          >
            <Link href="/auth/sign-up" className="flex items-center gap-2">
              Quero Participar
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 text-white hover:bg-white/10"
          >
            <Link href="/auth/login">Já tenho conta</Link>
          </Button>
        </div>
        <p className="mt-8 text-sm text-white/60">
          Após o cadastro, nossa equipe entrará em contato com você para fornecer mais informações.
        </p>
      </div>
    </section>
  )
}
