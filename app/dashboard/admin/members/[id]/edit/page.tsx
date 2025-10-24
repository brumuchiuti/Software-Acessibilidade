import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditMemberForm from "@/components/edit-member-form"

interface EditMemberPageProps {
  params: Promise<{ id: string }>
}

export default async function EditMemberPage({ params }: EditMemberPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  // Fetch the member data
  const { data: member, error } = await supabase
    .from("profiles")
    .select(`
      *,
      member_institute_areas (
        area
      )
    `)
    .eq("id", id)
    .single()

  if (error || !member) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Editar Membro</h1>
        <p className="text-white/60">Atualize as informações do membro</p>
      </div>

      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white">Informações do Membro</CardTitle>
          <CardDescription className="text-white/60">
            Todos os campos são obrigatórios exceto quando indicado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditMemberForm member={member} currentUserId={user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
