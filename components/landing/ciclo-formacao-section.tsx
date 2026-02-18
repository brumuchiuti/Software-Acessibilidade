import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Target, Award } from "lucide-react"

const phases = [
  {
    icon: BookOpen,
    title: "Qualify",
    duration: "3 a 6 meses",
    description: "Integração cultural e fundamentos do liberalismo",
  },
  {
    icon: Users,
    title: "Associado I",
    duration: "6 a 12 meses",
    description: "Consolidação do conhecimento e primeiras lideranças",
  },
  {
    icon: Target,
    title: "Associado II",
    duration: "6 a 12 meses",
    description: "Liderança avançada e aplicação prática dos conceitos",
  },
  {
    icon: Award,
    title: "Associado Sênior",
    duration: "Conclusão do ciclo",
    description: "Mentoria e representação institucional",
  },
]

export function CicloFormacaoSection() {
  return (
    <section id="formacao" className="bg-white py-20 px-4 dark:bg-[#0a1628]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-[#001f3f] dark:text-white sm:text-4xl">
          Ciclo de Formação
        </h2>
        <p className="mb-4 text-center text-lg text-muted-foreground">
          A jornada completa de desenvolvimento dos associados do IFL Jovem SP
        </p>
        <p className="mb-16 text-center text-muted-foreground">
          10 competências essenciais • 6 níveis de proficiência • Sistema de ranking meritocrático
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((phase) => (
            <div
              key={phase.title}
              className="flex flex-col items-center rounded-xl border border-[#FFD700]/20 bg-white p-6 shadow-sm dark:bg-[#001f3f]/30 dark:border-[#FFD700]/20"
            >
              <div className="mb-4 rounded-full bg-[#FFD700]/20 p-4">
                <phase.icon className="h-8 w-8 text-[#FFD700]" />
              </div>
              <h3 className="mb-1 text-xl font-semibold text-foreground">{phase.title}</h3>
              <p className="mb-2 text-sm font-medium text-[#FFD700]">{phase.duration}</p>
              <p className="text-center text-sm text-muted-foreground">{phase.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" className="border-[#FFD700] text-[#001f3f] hover:bg-[#FFD700]/10 dark:text-white dark:hover:bg-[#FFD700]/10">
            <Link href="/auth/login">
              Associados: acesse o roadmap completo
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
