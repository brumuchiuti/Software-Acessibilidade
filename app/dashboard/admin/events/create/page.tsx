import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateEventForm } from "@/components/create-event-form"

export default async function CreateEventPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Criar Novo Evento</h1>
        <p className="text-muted-foreground">Preencha as informações do evento</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Informações do Evento</CardTitle>
          <CardDescription className="text-muted-foreground">
            Todos os campos são obrigatórios exceto quando indicado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateEventForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
