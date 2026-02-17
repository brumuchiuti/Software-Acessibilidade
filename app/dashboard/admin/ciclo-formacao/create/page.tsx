import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateTrainingTaskForm from "@/components/create-training-task-form"

interface PageProps {
  searchParams: Promise<{ level?: string }>
}

export default async function CreateTrainingTaskPage({ searchParams }: PageProps) {
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
    .select("id, name, slug")
    .order("order_index", { ascending: true })

  if (error || !levels?.length) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Criar tarefa</h1>
          <p className="text-muted-foreground">Não foi possível carregar os níveis. Execute a migração do Ciclo de Formação.</p>
        </div>
      </div>
    )
  }

  const params = await searchParams
  const preselectedLevel = params.level

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Criar tarefa</h1>
        <p className="text-muted-foreground">Adicione uma nova tarefa a um nível de desenvolvimento</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Informações da tarefa</CardTitle>
          <CardDescription className="text-muted-foreground">Preencha os detalhes da tarefa</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTrainingTaskForm
            levels={levels}
            preselectedLevelId={preselectedLevel}
          />
        </CardContent>
      </Card>
    </div>
  )
}
