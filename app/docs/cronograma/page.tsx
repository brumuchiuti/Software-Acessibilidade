import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Flag, CheckCircle2 } from "lucide-react"

const TOTAL_WEEKS = 18

const milestones = [
  { id: "M1", week: 1, label: "Início do Projeto", entregavel: "TAP e cronograma aprovados" },
  { id: "M2", week: 1, label: "Escopo Definido", entregavel: "Declaração de escopo + EAP aprovados" },
  { id: "M3", week: 8, label: "MVP Funcional", entregavel: "Landing, auth, dashboard básico" },
  { id: "M4", week: 12, label: "Ciclo de aprendizagem", entregavel: "Níveis e tarefas operacionais" },
  { id: "M5", week: 14, label: "Acessibilidade", entregavel: "VLibras + Modo Neurodivergente" },
  { id: "M6", week: 16, label: "Homologação", entregavel: "QA completo" },
  { id: "M7", week: 18, label: "Lançamento", entregavel: "Go-live em produção" },
]

const phases = [
  {
    activities: [
      { id: 1, name: "Planejamento", start: 1, duration: 1, phase: "plan" },
      { id: 2, name: "Infraestrutura (Supabase, Vercel)", start: 1, duration: 2, phase: "plan" },
    ],
  },
  {
    activities: [
      { id: 4, name: "Autenticação", start: 2, duration: 3, phase: "mvp" },
      { id: 5, name: "Landing page", start: 2, duration: 4, phase: "mvp" },
      { id: 6, name: "Dashboard base", start: 3, duration: 4, phase: "mvp" },
      { id: 7, name: "Eventos", start: 5, duration: 3, phase: "mvp" },
      { id: 8, name: "Ranking e atividades", start: 5, duration: 3, phase: "mvp" },
      { id: 9, name: "Oportunidades", start: 6, duration: 2, phase: "mvp" },
    ],
  },
  {
    activities: [
      { id: 10, name: "Ciclo de Formação", start: 6, duration: 6, phase: "ciclo" },
      { id: 11, name: "Painel administrativo", start: 6, duration: 5, phase: "ciclo" },
    ],
  },
  {
    activities: [
      { id: 12, name: "Integração VLibras", start: 12, duration: 2, phase: "acess" },
      { id: 13, name: "Modo visual autistas/dautônicos", start: 12, duration: 2, phase: "acess" },
    ],
  },
  {
    activities: [
      { id: 14, name: "QA e testes de acessibilidade", start: 14, duration: 2, phase: "deploy" },
      { id: 16, name: "Deploy em produção", start: 16, duration: 2, phase: "deploy" },
    ],
  },
]

const phaseColors: Record<string, string> = {
  plan: "bg-amber-500/80",
  mvp: "bg-emerald-600/80",
  ciclo: "bg-blue-600/80",
  acess: "bg-violet-600/80",
  deploy: "bg-rose-500/80",
}

function GanttBar({
  start,
  duration,
  label,
  phase,
}: {
  start: number
  duration: number
  label: string
  phase: string
}) {
  const leftPercent = ((start - 1) / TOTAL_WEEKS) * 100
  const widthPercent = (duration / TOTAL_WEEKS) * 100

  return (
    <div className="group relative flex items-center gap-4 py-1.5" data-gantt-row>
      <div className="w-48 shrink-0 text-sm text-white/90">{label}</div>
      <div className="relative h-8 flex-1 overflow-hidden rounded bg-white/5 print:overflow-visible print:min-w-[400px]" data-gantt-bar-container>
        <div
          className={`absolute top-1 bottom-1 rounded ${phaseColors[phase] || "bg-gray-500"} transition-all group-hover:opacity-90`}
          style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
          data-gantt-phase={phase}
        />
      </div>
      <div className="hidden w-20 shrink-0 text-xs text-white/60 sm:block">
        Sem {start}–{start + duration - 1}
      </div>
    </div>
  )
}

function MilestoneMarker({ week, id, label }: { week: number; id: string; label: string }) {
  const leftPercent = (week / TOTAL_WEEKS) * 100

  return (
    <div
      className="absolute top-0 bottom-0 w-px bg-[#FFD700]/60"
      style={{ left: `${leftPercent}%` }}
      title={`Semana ${week}: ${label}`}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-[#FFD700] px-1.5 py-0.5 text-[10px] font-bold text-black opacity-90">
        {id}
      </div>
    </div>
  )
}

export default function CronogramaPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Cronograma do Projeto</h1>
          <p className="mt-2 text-white/70">
            Plataforma Educacional Acessível – Marcos e fases (18 semanas). Destaque para M5 (Acessibilidade).
          </p>
        </div>
        <Badge variant="secondary" className="w-fit bg-white/10 text-white">
          Versão 1.0 • 24/02/2025
        </Badge>
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Flag className="h-5 w-5 text-[#FFD700]" />
            Marcos do Projeto
          </CardTitle>
          <CardDescription className="text-white/70">
            Principais entregas e datas previstas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#FFD700] text-black">{m.id}</Badge>
                  <span className="text-xs text-white/60">Semana {m.week}</span>
                </div>
                <p className="mt-2 font-medium text-white">{m.label}</p>
                <p className="mt-1 text-sm text-white/70">{m.entregavel}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5 text-[#FFD700]" />
            Diagrama de Gantt
          </CardTitle>
          <CardDescription className="text-white/70">
            Timeline visual das atividades por fase
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto print:overflow-visible" data-gantt-container>
          <div className="mb-4 flex gap-0">
            <div className="w-48 shrink-0" />
            <div className="relative flex flex-1">
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
                <div
                  key={i}
                  className="flex flex-1 items-center justify-center border-r border-white/10 py-2 text-xs text-white/50"
                >
                  {i + 1}
                </div>
              ))}
              {milestones.map((m) => (
                <MilestoneMarker key={m.id} week={m.week} id={m.id} label={m.label} />
              ))}
            </div>
            <div className="hidden w-20 shrink-0 sm:block" />
          </div>

          <div className="mb-6 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-3 w-4 rounded bg-amber-500/80" /> Planejamento
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-3 w-4 rounded bg-emerald-600/80" /> MVP
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-3 w-4 rounded bg-blue-600/80" /> Ciclo/Admin
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-3 w-4 rounded bg-violet-600/80" /> Acessibilidade
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-3 w-4 rounded bg-rose-500/80" /> Deploy
            </span>
          </div>

          <div className="space-y-0">
            {phases.flatMap((phase) =>
              phase.activities.map((a) => (
                <GanttBar
                  key={a.id}
                  start={a.start}
                  duration={a.duration}
                  label={a.name}
                  phase={a.phase}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CheckCircle2 className="h-5 w-5 text-[#FFD700]" />
            Caminho Crítico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/80 leading-relaxed">
            Infra → Auth → Dashboard → Ranking/Eventos → Ciclo → Admin → <strong className="text-[#FFD700]">VLibras + Modo Neuro</strong> → QA → Deploy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
