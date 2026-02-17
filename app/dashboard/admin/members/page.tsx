import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/role-badge"
import { Edit } from "lucide-react"
import Link from "next/link"

export default async function AdminMembersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  const { data: allMembers } = await supabase
    .from("profiles")
    .select(`
      *,
      member_institute_areas (
        area
      )
    `)
    .order("full_name", { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Gerenciar Membros</h1>
        <p className="text-muted-foreground">Visualize e gerencie informações dos membros</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Todos os Membros</CardTitle>
          <CardDescription className="text-muted-foreground">{allMembers?.length || 0} membros cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar_url || ""} alt={member.full_name} className="object-cover" />
                    <AvatarFallback className="bg-[#FFD700] text-black">
                      {member.full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold text-foreground">{member.full_name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <RoleBadge 
                    boardRole={member.board_role}
                    developmentLevel={member.development_level}
                    instituteAreas={member.member_institute_areas}
                  />
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FFD700]">{member.total_points}</p>
                    <p className="text-xs text-muted-foreground">pontos</p>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-[#FFD700]/40 text-blue-500 bg-transparent"
                  >
                    <Link href={`/dashboard/admin/members/${member.id}/edit`}>
                      <Edit className="mr-1 h-3 w-3" />
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
