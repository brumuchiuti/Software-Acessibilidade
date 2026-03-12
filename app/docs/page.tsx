import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, ClipboardList, FolderTree, Layers, ArrowRight } from "lucide-react"

const docs = [
  {
    href: "/docs/tap",
    title: "TAP – Termo de Abertura do Projeto / GDD1",
    description: "Objetivos, escopo e critérios de sucesso. Foco em acessibilidade.",
    icon: FileText,
  },
  {
    href: "/docs/cronograma",
    title: "Cronograma (Gantt)",
    description: "Cronograma inicial com marcos, diagrama de Gantt e detalhamento das atividades.",
    icon: Calendar,
  },
  {
    href: "/docs/escopo",
    title: "Declaração de Escopo",
    description: "Escopo do produto, critérios de aceitação, entregáveis e glossário.",
    icon: ClipboardList,
  },
  {
    href: "/docs/eap",
    title: "EAP / WBS",
    description: "Estrutura Analítica do Projeto com breakdown completo das tarefas.",
    icon: FolderTree,
  },
  {
    href: "/docs/entrega2",
    title: "Requisitos, Modelagem e Arquitetura",
    description: "Requisitos funcionais e não funcionais, DCU, DCL, diagramas e justificativa da arquitetura.",
    icon: Layers,
  },
]

export default function DocsIndexPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Documentação de Planejamento
        </h1>
        <p className="mt-2 text-white/70">
          Plataforma Educacional Acessível – Grupo ABE. Documentos de escopo e planejamento. Foco em acessibilidade inclusiva.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {docs.map((doc) => (
          <Link key={doc.href} href={doc.href} className="block">
            <Card className="h-full border-white/10 bg-white/5 transition hover:border-[#FFD700]/30 hover:bg-white/10">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="rounded-lg bg-[#FFD700]/20 p-3">
                  <doc.icon className="h-6 w-6 text-[#FFD700]" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-white">{doc.title}</CardTitle>
                  <CardDescription className="mt-1 text-white/70">
                    {doc.description}
                  </CardDescription>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-white/50" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="font-semibold text-white">Acessibilidade – Prioridade Central</h3>
        <ul className="mt-3 space-y-1 text-sm text-white/80">
          <li>• <strong>VLibras</strong>: widget oficial (gov.br) para LIBRAS em todo o site</li>
          <li>• <strong>Modo para autistas e dautônicos</strong>: previsibilidade, redução de estímulos, layout simplificado</li>
          <li>• <strong>WCAG 2.1 AA</strong>: conformidade mínima com diretrizes de acessibilidade web</li>
        </ul>
      </div>
    </div>
  )
}
