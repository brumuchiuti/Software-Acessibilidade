import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateActivityForm from "@/components/create-activity-form"

export default async function CreateActivityPage() {
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
        <h1 className="text-4xl font-bold text-white mb-2">Criar Nova Atividade</h1>
        <p className="text-white/60">Defina uma nova atividade de engajamento para os membros</p>
      </div>

      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white">Informações da Atividade</CardTitle>
          <CardDescription className="text-white/60">Preencha os detalhes da nova atividade</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateActivityForm userId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
