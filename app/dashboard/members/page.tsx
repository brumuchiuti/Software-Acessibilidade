import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/role-badge"
import { Users, Linkedin, Instagram } from "lucide-react"

export default async function MembersPage() {
  const supabase = await createClient()

  const { data: allMembers } = await supabase
    .from("profiles")
    .select(`
      *,
      member_institute_areas (
        area
      )
    `)
    .order("full_name", { ascending: true })

  const membersByRole = {
    board_members: allMembers?.filter((m) => m.board_role !== null) || [],
    qualify: allMembers?.filter((m) => m.development_level === "qualify") || [],
    associado_i: allMembers?.filter((m) => m.development_level === "associado_i") || [],
    associado_ii: allMembers?.filter((m) => m.development_level === "associado_ii") || [],
    associado_senior: allMembers?.filter((m) => m.development_level === "associado_senior") || [],
  }

  const roleLabels: Record<string, string> = {
    board_members: "Diretoria",
    qualify: "Qualify",
    associado_i: "Associados I",
    associado_ii: "Associados II",
    associado_senior: "Associados Sênior",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Membros</h1>
        <p className="text-muted-foreground">Conheça todos os membros do IFL Jovem SP</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-foreground">Total de Membros</CardTitle>
            <CardDescription className="text-muted-foreground">Membros ativos na organização</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-4xl font-bold text-primary">{allMembers?.length || 0}</span>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        {Object.entries(membersByRole).map(([role, members]) => {
          if (members.length === 0) return null

          return (
            <div key={role}>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {roleLabels[role]} ({members.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <Card
                    key={member.id}
                    className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20 hover:border-primary/40 transition-colors"
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={member.avatar_url || ""} alt={member.full_name} className="object-cover" />
                          <AvatarFallback className="bg-[#FFD700] text-black text-xl">
                            {member.full_name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-foreground">{member.full_name}</h3>
                          <RoleBadge 
                            boardRole={member.board_role}
                            developmentLevel={member.development_level}
                            instituteAreas={member.member_institute_areas}
                          />
                        </div>

                        {(member.bio || member.description) && (
                          <div className="text-sm text-muted-foreground line-clamp-3">
                            {member.bio && <p className="mb-1">{member.bio}</p>}
                            {member.description && <p>{member.description}</p>}
                          </div>
                        )}

                        {(member.linkedin_url || member.instagram_url) && (
                          <div className="flex items-center gap-3">
                            {member.linkedin_url && (
                              <a
                                href={member.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            )}
                            {member.instagram_url && (
                              <a
                                href={member.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Instagram className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        )}

                        <div className="w-full pt-4 border-t border-border flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Pontos</span>
                          <span className="text-lg font-bold text-primary">{member.total_points}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
