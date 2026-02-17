import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateOpportunityForm from "@/components/create-opportunity-form"

export default async function CreateOpportunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Nova Oportunidade</h1>
        <p className="text-muted-foreground">
          Cadastre uma oportunidade que o instituto pode oferecer aos membros
        </p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Informações da Oportunidade</CardTitle>
          <CardDescription className="text-muted-foreground">
            Preencha os detalhes da oportunidade (ex: estágio, mentoria, curso)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateOpportunityForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
