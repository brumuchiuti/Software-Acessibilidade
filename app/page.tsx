import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003366] to-black p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <Logo size="xxxl" className="justify-center" href="" />
          {/* <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Instituto de Formação de Líderes
          </p> */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 text-lg px-8">
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10 text-lg px-8 bg-transparent"
          >
            <Link href="/auth/sign-up">Cadastrar</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg bg-white/5 border border-[#FFD700]/20">
            <h3 className="text-xl font-semibold text-[#FFD700] mb-2">Eventos Semanais</h3>
            <p className="text-white/70">Participe de eventos e acumule pontos</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 border border-[#FFD700]/20">
            <h3 className="text-xl font-semibold text-[#FFD700] mb-2">Sistema de Ranking</h3>
            <p className="text-white/70">Acompanhe seu progresso e engajamento</p>
          </div>
          <div className="p-6 rounded-lg bg-white/5 border border-[#FFD700]/20">
            <h3 className="text-xl font-semibold text-[#FFD700] mb-2">Comunidade</h3>
            <p className="text-white/70">Conecte-se com outros jovens líderes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
