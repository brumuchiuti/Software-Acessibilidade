import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/role-badge"

export default async function AdminMembersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && ["presidente", "vice_presidente", "diretor"].includes(profile.role)

  if (!isAdmin) redirect("/dashboard")

  const { data: allMembers } = await supabase.from("profiles").select("*").order("full_name", { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Gerenciar Membros</h1>
        <p className="text-white/60">Visualize e gerencie informações dos membros</p>
      </div>

      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white">Todos os Membros</CardTitle>
          <CardDescription className="text-white/60">{allMembers?.length || 0} membros cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url || ""} alt={member.full_name} className="object-cover" />
                    <AvatarFallback className="bg-[#FFD700] text-black">
                      {member.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold text-white">{member.full_name}</p>
                    <p className="text-sm text-white/60">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <RoleBadge role={member.role} directorTitle={member.director_title} />
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FFD700]">{member.total_points}</p>
                    <p className="text-xs text-white/60">pontos</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
