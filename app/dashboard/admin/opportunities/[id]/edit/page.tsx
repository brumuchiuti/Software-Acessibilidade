import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditOpportunityForm from "@/components/edit-opportunity-form"

interface EditOpportunityPageProps {
  params: Promise<{ id: string }>
}

export default async function EditOpportunityPage({ params }: EditOpportunityPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  const { data: opportunity, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !opportunity) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Editar Oportunidade</h1>
        <p className="text-muted-foreground">Atualize as informações da oportunidade</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Informações da Oportunidade</CardTitle>
          <CardDescription className="text-muted-foreground">
            Todos os campos são obrigatórios exceto quando indicado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditOpportunityForm opportunity={opportunity} />
        </CardContent>
      </Card>
    </div>
  )
}
