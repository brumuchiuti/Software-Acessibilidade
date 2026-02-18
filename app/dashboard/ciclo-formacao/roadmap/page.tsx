import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  Heart,
  Layers,
  Brain,
  Users,
  BookOpen,
  ChevronRight,
  Zap,
  Trophy,
  GraduationCap,
  CheckCircle2,
  Star,
} from "lucide-react"

export default async function RoadmapFormacaoPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Roadmap de Formação</h1>
        <p className="text-muted-foreground text-lg">
          Instituto de Formação de Líderes Jovem de São Paulo — Versão 2025.2
        </p>
      </div>

      {/* Objetivo */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            1. Objetivo do Roadmap
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            O Roadmap do Ciclo de Formação define, de forma clara e estruturada, a jornada completa de
            desenvolvimento dos associados do IFL Jovem SP.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              "Orientar o crescimento pessoal e institucional dos membros",
              "Estabelecer critérios objetivos de avaliação",
              "Garantir alinhamento com os valores liberais do Instituto",
              "Incentivar protagonismo, mérito e excelência",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-foreground font-medium mt-4">
            O documento não é apenas um cronograma, mas um{" "}
            <span className="text-primary">guia de formação de lideranças liberais</span> comprometidas
            com a Vida, a Liberdade, a Propriedade Privada e o Império da Lei.
          </p>
        </CardContent>
      </Card>

      {/* Valores */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            2. Valores do Ciclo de Formação
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Todo o Ciclo é guiado pelo Hexágono de Valores do IFL
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Integridade Moral",
                desc: "Honestidade intelectual, respeito às regras e coerência entre discurso e prática.",
                icon: Heart,
              },
              {
                title: "Vitalidade e Motivação",
                desc: "Energia, curiosidade e engajamento contínuo.",
                icon: Zap,
              },
              {
                title: "Conquista de Resultados",
                desc: "Metas claras, entregas objetivas e progresso mensurável.",
                icon: Trophy,
              },
              {
                title: "Antevisão (Visão Estratégica)",
                desc: "Pensamento de longo prazo e capacidade de antecipar cenários.",
                icon: Target,
              },
              {
                title: "Rede de Relacionamentos",
                desc: "Colaboração interna, networking externo e comunicação persuasiva.",
                icon: Users,
              },
            ].map((v, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-muted/30 p-4 hover:border-primary/30 transition-colors"
              >
                <v.icon className="h-5 w-5 text-primary mb-2" />
                <h4 className="font-semibold text-foreground">{v.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estrutura - 4 Fases */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            3. Estrutura do Ciclo de Formação
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            O Ciclo é dividido em quatro fases
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden sm:block" />
            <div className="space-y-6">
              {[
                {
                  phase: "Qualify",
                  duration: "3 a 6 meses",
                  objective: "Integração cultural e fundamentos do liberalismo",
                  step: 1,
                },
                {
                  phase: "Associado I",
                  duration: "6 a 12 meses",
                  objective: "Consolidação do conhecimento e primeiras lideranças",
                  step: 2,
                },
                {
                  phase: "Associado II",
                  duration: "6 a 12 meses",
                  objective: "Liderança avançada e aplicação prática dos conceitos",
                  step: 3,
                },
                {
                  phase: "Associado Sênior",
                  duration: "Perfil final",
                  objective: "Conclusão completa do ciclo, mentoria e representação institucional",
                  step: 4,
                },
              ].map((f, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-semibold text-sm z-10">
                    {f.step}
                  </div>
                  <div className="flex-1 rounded-lg border border-border bg-muted/20 p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{f.phase}</h4>
                      <Badge variant="secondary" className="font-normal">
                        {f.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{f.objective}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground italic">
            O não cumprimento das atividades obrigatórias dentro dos prazos implica desligamento
            automático, conforme o Regimento Interno.
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            4. Modelo de Desenvolvimento de Skills
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            10 competências essenciais, divididas entre Soft Skills e Hard Skills, com 6 níveis de
            proficiência
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-2">Soft Skills (5)</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Comunicação e Oratória",
                "Liderança e Protagonismo",
                "Trabalho em Equipe e Colaboração",
                "Pensamento Crítico e Resolução de Problemas",
                "Disciplina e Comprometimento",
              ].map((s, i) => (
                <Badge key={i} variant="outline" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Hard Skills (5)</h4>
            <div className="flex flex-wrap gap-2">
              {[
                "Fundamentos do Pensamento Liberal",
                "Fundamentos de Economia e Políticas Públicas",
                "Produção de Conteúdo e Escrita",
                "Organização e Gestão do Tempo",
                "Apresentação em Público",
              ].map((s, i) => (
                <Badge key={i} variant="outline" className="font-normal">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="font-semibold text-foreground mb-3">Níveis de Proficiência</h4>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { level: 1, desc: "Iniciante" },
                { level: 2, desc: "Básico" },
                { level: 3, desc: "Autônomo" },
                { level: 4, desc: "Bom" },
                { level: 5, desc: "Muito bom" },
                { level: 6, desc: "Excelência / Referência" },
              ].map((n) => (
                <div key={n.level} className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="font-medium">Nível {n.level}:</span>
                  <span className="text-muted-foreground">{n.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-foreground">
              <strong>Requisito mínimo ao final do ciclo:</strong> Nível 3 em todas as skills
            </p>
            <p className="text-foreground">
              <strong>Diferencial:</strong> Nível 6 em pelo menos duas skills
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modelo de Atividades */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            5. Modelo de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border p-4">
              <h4 className="font-semibold text-foreground mb-2">Atividades Mínimas</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Obrigatórias</li>
                <li>• Não geram pontuação no ranking</li>
                <li>• Garantem uma base comum de formação</li>
              </ul>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <h4 className="font-semibold text-foreground mb-2">Atividades Desafiantes</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Opcionais</li>
                <li>• Geram pontuação no ranking</li>
                <li>• Incentivam protagonismo e excelência</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            A partir de Associado I, é possível substituir uma atividade mínima por uma desafiante,
            com aprovação da Diretoria de Formação.
          </p>
        </CardContent>
      </Card>

      {/* Detalhamento por Fase */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            6. Detalhamento por Fase
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          {[
            {
              phase: "Qualify",
              focus: "Cultura institucional e fundamentos do liberalismo",
              deliveries: [
                "Resenha de As Seis Lições (Mises)",
                "Leituras obrigatórias (Hayek e John C. Maxwell)",
                "Participação mínima em eventos",
                "Autoavaliação de skills",
                "Entrevista final de avaliação",
              ],
            },
            {
              phase: "Associado I",
              focus: "Participação ativa e pequenas lideranças",
              deliveries: [
                "Resenha de A Mentalidade Anticapitalista (Mises)",
                "Leitura de artigo de Hayek",
                "Participação em uma diretoria",
                "Autoavaliação e entrevista final",
              ],
            },
            {
              phase: "Associado II",
              focus: "Liderança avançada e estratégia",
              deliveries: [
                "Resenhas obrigatórias de Hayek e Hoppe",
                "Atuação destacada em projetos e eventos",
                "Definição das skills foco para nível 6",
                "Avaliação final da fase",
              ],
            },
            {
              phase: "Associado Sênior",
              focus: "Perfil esperado",
              deliveries: [
                "Nível 3 ou superior em todas as skills",
                "Nível 6 em pelo menos duas competências",
                "Capacidade de mentorar outros associados",
                "Representação institucional externa",
                "Continuidade no processo de autoavaliação",
              ],
            },
          ].map((p, i) => (
            <div key={i} className="rounded-lg border border-border p-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2 mb-1">
                <ChevronRight className="h-4 w-4 text-primary" />
                {p.phase}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{p.focus}</p>
              <ul className="space-y-1">
                {p.deliveries.map((d, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Avaliação e Ranking */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">7. Avaliação e Feedback</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground mb-4">
              Cada fase inclui autoavaliação, avaliação da Diretoria e relatório de acompanhamento
              (pontos fortes, gargalos, recomendações).
            </p>
            <p className="text-sm text-foreground font-medium">
              O modelo equilibra liberdade de escolha com padrões claros de desempenho.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground text-lg">8. Ranking de Formação</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-muted-foreground mb-4">
              O ranking pontua resenhas adicionais, organização de eventos, produção de artigos,
              captação de patrocinadores e atuação em diretorias.
            </p>
            <p className="text-sm text-muted-foreground italic">
              O ranking não substitui os requisitos formais de progressão no Ciclo.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Programa de Leituras + CTA */}
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20 overflow-hidden">
        <div className="bg-linear-to-r from-primary/10 to-primary/5 px-6 py-6">
          <CardTitle className="text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            9. Programa de Leituras
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-1 text-base">
            Cada fase possui leituras obrigatórias e sugeridas. O associado pode escolher livros de
            diferentes fases, desde que não repita obras já entregues. O programa combina
            liberalismo, economia, liderança, filosofia, história e literatura.
          </CardDescription>
        </div>
        <CardContent className="pt-6">
          <blockquote className="text-lg text-foreground font-medium italic border-l-4 border-primary pl-4">
            O Roadmap funciona como uma bússola: define um padrão comum de formação, respeita
            trajetórias individuais e estimula a construção de lideranças éticas, competentes e
            comprometidas com a liberdade.
          </blockquote>
        </CardContent>
      </Card>
    </div>
  )
}
