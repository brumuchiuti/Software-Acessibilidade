import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EditEventForm } from "@/components/edit-event-form"
import { notFound } from "next/navigation"

interface EditEventPageProps {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  // Fetch the event data
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Editar Evento</h1>
        <p className="text-muted-foreground">Atualize as informações do evento</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Informações do Evento</CardTitle>
          <CardDescription className="text-muted-foreground">
            Todos os campos são obrigatórios exceto quando indicado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditEventForm event={event} userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
