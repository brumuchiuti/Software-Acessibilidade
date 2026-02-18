import { Shield, Zap, Target, Eye, Users, MessageCircle } from "lucide-react"

const hexagonValues = [
  {
    icon: Shield,
    title: "Integridade Moral",
    description: "Honestidade intelectual, respeito às regras e coerência entre discurso e prática.",
  },
  {
    icon: Zap,
    title: "Vitalidade e Motivação",
    description: "Energia, curiosidade e engajamento contínuo.",
  },
  {
    icon: Target,
    title: "Conquista de Resultados",
    description: "Metas claras, entregas objetivas e progresso mensurável.",
  },
  {
    icon: Eye,
    title: "Antevisão (Visão Estratégica)",
    description: "Pensamento de longo prazo e capacidade de antecipar cenários.",
  },
  {
    icon: Users,
    title: "Rede de Relacionamentos e Comunicação",
    description: "Colaboração interna, networking externo e comunicação persuasiva.",
  },
  {
    icon: MessageCircle,
    title: "Excelência",
    description: "Compromisso com a qualidade e o aprimoramento contínuo.",
  },
]

export function ValuesSection() {
  return (
    <section id="valores" className="bg-gradient-to-b from-[#0a1628] to-[#001f3f] py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          Hexágono de Valores
        </h2>
        <p className="mb-16 text-center text-lg text-white/80">
          Valores que orientam o Ciclo de Formação do IFL Jovem SP
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {hexagonValues.map((item) => (
            <div
              key={item.title}
              className="group rounded-xl border border-[#FFD700]/20 bg-white/5 p-8 backdrop-blur-sm transition hover:border-[#FFD700]/40 hover:bg-white/10"
            >
              <div className="mb-4 inline-flex rounded-lg bg-[#FFD700]/20 p-3">
                <item.icon className="h-8 w-8 text-[#FFD700]" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#FFD700]">{item.title}</h3>
              <p className="text-white/80">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
