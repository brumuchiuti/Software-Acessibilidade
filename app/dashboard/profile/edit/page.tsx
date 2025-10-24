import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileEditForm } from "@/components/profile-edit-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProfileEditPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) redirect("/dashboard")

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="text-white hover:text-[#FFD700] hover:bg-white/5">
          <Link href="/dashboard/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Editar Perfil</h1>
          <p className="text-white/60">Atualize suas informações pessoais</p>
        </div>
      </div>

      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white">Informações Pessoais</CardTitle>
          <CardDescription className="text-white/60">
            Mantenha suas informações atualizadas para melhor comunicação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileEditForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
