import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SubmitActivityForm from "@/components/submit-activity-form"

export default async function SubmitActivityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) redirect("/auth/login")

  // Get all available activities
  const { data: activities } = await supabase.from("activities").select("*").order("created_at", { ascending: false })

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Submeter Atividade</h1>
        <p className="text-muted-foreground">Registre suas atividades de engajamento para ganhar pontos</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Formulário de Submissão</CardTitle>
          <CardDescription className="text-muted-foreground">
            Selecione uma atividade e forneça detalhes sobre sua participação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmitActivityForm activities={activities || []} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
