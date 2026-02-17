import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GraduationCap, Link2, FileText, Image as ImageIcon } from "lucide-react"
import { getLevelsFromSupabase, getLevelsWithMockFallback } from "@/lib/ciclo-formacao/data"
import type { TrainingTask, TaskType } from "@/lib/ciclo-formacao/types"
import { cn } from "@/lib/utils"

function TaskTypeIcon({ type }: { type: TaskType }) {
  switch (type) {
    case "link":
      return <Link2 className="h-4 w-4" />
    case "file":
      return <FileText className="h-4 w-4" />
    case "image":
      return <ImageIcon className="h-4 w-4" />
  }
}

function TaskCard({ task, isCurrentLevel }: { task: TrainingTask; isCurrentLevel: boolean }) {
  return (
    <Link
      href={`/dashboard/ciclo-formacao/tarefas/${task.id}`}
      className={cn(
        "block p-4 rounded-lg border transition-all hover:border-primary/50",
        isCurrentLevel
          ? "bg-primary/5 border-primary/30 hover:bg-primary/10"
          : "bg-muted/30 border-border hover:bg-muted/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isCurrentLevel ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          )}
        >
          <TaskTypeIcon type={task.taskType} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs font-normal">
              {task.taskType === "link" && "Link"}
              {task.taskType === "file" && "Arquivo"}
              {task.taskType === "image" && "Imagem"}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default async function CicloFormacaoPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("development_level").eq("id", user.id).single()

  const supabaseLevels = await getLevelsFromSupabase()
  const levels = getLevelsWithMockFallback(supabaseLevels)

  const userLevelSlug = profile?.development_level || "qualify"
  const currentLevel = levels.find((l) => l.slug === userLevelSlug) || levels[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Ciclo de Formação</h1>
        <p className="text-muted-foreground">
          Suas tarefas de desenvolvimento por nível. Complete as atividades do seu nível para evoluir.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">Seu nível atual:</span>
          <Badge className="bg-primary text-primary-foreground">{currentLevel.name}</Badge>
        </div>
      </div>

      <div className="space-y-8">
        {levels.map((level) => {
          const isCurrentLevel = level.slug === userLevelSlug
          return (
            <Card
              key={level.id}
              className={cn(
                "bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20",
                isCurrentLevel && "ring-2 ring-primary/30"
              )}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      {level.name}
                      {isCurrentLevel && (
                        <Badge variant="outline" className="border-primary text-primary text-xs">
                          Seu nível
                        </Badge>
                      )}
                    </CardTitle>
                    {level.description && (
                      <CardDescription className="text-muted-foreground mt-1">{level.description}</CardDescription>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {level.tasks.length} {level.tasks.length === 1 ? "tarefa" : "tarefas"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {level.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} isCurrentLevel={isCurrentLevel} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!supabaseLevels?.length && (
        <p className="text-sm text-muted-foreground italic">
          * Dados de exemplo. Crie tarefas no Admin para usar dados reais do Supabase.
        </p>
      )}
    </div>
  )
}
