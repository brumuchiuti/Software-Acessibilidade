import { Shield, Zap, Target, Eye, Users, MessageCircle } from "lucide-react"

const hexagonValues = [
  { icon: Shield, title: "Integridade Moral", description: "Honestidade intelectual, respeito às regras e coerência entre discurso e prática." },
  { icon: Zap, title: "Vitalidade e Motivação", description: "Energia, curiosidade e engajamento contínuo." },
  { icon: Target, title: "Conquista de Resultados", description: "Metas claras, entregas objetivas e progresso mensurável." },
  { icon: Eye, title: "Antevisão", description: "Pensamento de longo prazo e capacidade de antecipar cenários." },
  { icon: Users, title: "Rede e Comunicação", description: "Colaboração interna, networking externo e comunicação persuasiva." },
  { icon: MessageCircle, title: "Excelência", description: "Compromisso com a qualidade e o aprimoramento contínuo." },
]

export function ValuesSection() {
  return (
    <section id="valores" className="bg-[#0a1628] py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-white sm:text-4xl">
          Hexágono de Valores
        </h2>
        <p className="mb-12 text-center text-white/70">
          Valores que orientam o Ciclo de Formação do IFL Jovem SP
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hexagonValues.map((item) => (
            <div
              key={item.title}
              className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-[#FFD700]/30 hover:bg-white/10"
            >
              <div className="mb-3 inline-flex w-fit rounded-lg bg-[#FFD700]/20 p-2">
                <item.icon className="h-6 w-6 text-[#FFD700]" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-[#FFD700]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
