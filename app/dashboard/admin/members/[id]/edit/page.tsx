import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditMemberForm from "@/components/edit-member-form"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("board_role")
    .eq("id", user.id)
    .single()

  if (!adminProfile?.board_role) redirect("/dashboard")

  const { data: member, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      role,
      board_role,
      development_level,
      bio,
      phone,
      linkedin_url,
      instagram_url,
      description,
      member_institute_areas (
        area
      )
    `)
    .eq("id", id)
    .single()

  if (error || !member) notFound()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Editar Membro
        </h1>
        <p className="text-muted-foreground">
          Atualize as informações do membro
        </p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">
            Informações do Membro
          </CardTitle>
          <CardDescription className="text-muted-foreground">
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
