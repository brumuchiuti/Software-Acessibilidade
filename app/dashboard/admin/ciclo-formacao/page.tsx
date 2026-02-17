import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Link2, FileText, Image as ImageIcon, GraduationCap } from "lucide-react"
import Link from "next/link"

function TaskTypeIcon({ type }: { type: string }) {
  switch (type) {
    case "link":
      return <Link2 className="h-4 w-4" />
    case "file":
      return <FileText className="h-4 w-4" />
    case "image":
      return <ImageIcon className="h-4 w-4" />
    default:
      return null
  }
}

export default async function AdminCicloFormacaoPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  const { data: levels, error } = await supabase
    .from("training_cycle_levels")
    .select(`
      *,
      training_cycle_tasks (*)
    `)
    .order("order_index", { ascending: true })

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Ciclo de Formação - Admin</h1>
          <p className="text-muted-foreground">Gerencie tarefas por nível de desenvolvimento</p>
        </div>
        <Card className="bg-card border-destructive/30">
          <CardContent className="pt-6">
            <p className="text-destructive font-medium">Tabelas não encontradas.</p>
            <p className="text-muted-foreground text-sm mt-2">
              Execute a migração do Ciclo de Formação no Supabase para criar as tabelas{" "}
              <code className="bg-muted px-1 rounded">training_cycle_levels</code> e{" "}
              <code className="bg-muted px-1 rounded">training_cycle_tasks</code>.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Arquivo: <code className="bg-muted px-1 rounded">supabase/migrations/20250217000000_ciclo_formacao.sql</code>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const tasksByLevel = levels || []

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Ciclo de Formação</h1>
          <p className="text-muted-foreground">Gerencie tarefas por nível de desenvolvimento</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/dashboard/admin/ciclo-formacao/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar tarefa
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        {tasksByLevel.map((level: any) => (
          <Card
            key={level.id}
            className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-foreground">{level.name}</CardTitle>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/dashboard/admin/ciclo-formacao/create?level=${level.id}`}>
                    <Plus className="mr-1 h-3 w-3" />
                    Adicionar tarefa
                  </Link>
                </Button>
              </div>
              {level.description && (
                <CardDescription className="text-muted-foreground">{level.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {!level.training_cycle_tasks || level.training_cycle_tasks.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4">Nenhuma tarefa cadastrada.</p>
              ) : (
                <div className="space-y-3">
                  {level.training_cycle_tasks
                    .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
                    .map((task: any) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <TaskTypeIcon type={task.task_type} />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{task.title}</p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground capitalize">{task.task_type}</span>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
