import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, Trophy, Linkedin, Instagram, Edit } from "lucide-react"
import Link from "next/link"
import { formatPhoneForDisplay } from "@/lib/phone"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      member_institute_areas (
        area
      )
    `)
    .eq("id", user.id)
    .single()

  const { data: attendedEvents } = await supabase
    .from("event_attendance")
    .select("*, events(*)")
    .eq("user_id", user.id)
    .eq("attended", true)
    .order("checked_in_at", { ascending: false })

  const { data: activities } = await supabase
    .from("activity_participation")
    .select("*, activities(*)")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("completed_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Meu Perfil</h1>
            <p className="text-muted-foreground">Visualize e gerencie suas informações</p>
          </div>
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
            <Link href="/dashboard/profile/edit">
              <Edit className="mr-2 h-4 w-4" />
              Editar Perfil
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-foreground">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name} className="object-cover" />
                <AvatarFallback className="bg-[#FFD700] text-black text-3xl">
                  {profile?.full_name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-foreground text-center">{profile?.full_name}</h2>
              <div className="mt-2">
                <RoleBadge 
                  boardRole={profile?.board_role}
                  developmentLevel={profile?.development_level}
                  instituteAreas={profile?.member_institute_areas}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-[#FFD700]" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              {profile?.phone && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-[#FFD700]" />
                  <span className="text-sm">{formatPhoneForDisplay(profile.phone)}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground">
                <Calendar className="h-4 w-4 text-[#FFD700]" />
                <span className="text-sm">
                  Membro desde{" "}
                  {new Date(profile?.joined_at || "").toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Trophy className="h-4 w-4 text-[#FFD700]" />
                <span className="text-sm">{profile?.total_points || 0} pontos totais</span>
              </div>
            </div>

            {(profile?.bio || profile?.description) && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">Sobre</h3>
                {profile?.bio && (
                  <p className="text-sm text-muted-foreground mb-2">{profile.bio}</p>
                )}
                {profile?.description && (
                  <p className="text-sm text-muted-foreground">{profile.description}</p>
                )}
              </div>
            )}

            {(profile?.linkedin_url || profile?.instagram_url) && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-2">Redes Sociais</h3>
                <div className="space-y-2">
                  {profile?.linkedin_url && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-[#FFD700]" />
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {profile?.instagram_url && (
                    <div className="flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-[#FFD700]" />
                      <a
                        href={profile.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        Instagram
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-foreground">Histórico de Eventos</CardTitle>
              <CardDescription className="text-muted-foreground">Eventos que você participou</CardDescription>
            </CardHeader>
            <CardContent>
              {attendedEvents && attendedEvents.length > 0 ? (
                <div className="space-y-4">
                  {attendedEvents.map((attendance) => (
                    <div
                      key={attendance.id}
                      className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{attendance.events?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(attendance.checked_in_at || "").toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-[#FFD700]">+{attendance.points_earned} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Você ainda não participou de nenhum evento.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-foreground">Atividades Concluídas</CardTitle>
              <CardDescription className="text-muted-foreground">Outras atividades de engajamento</CardDescription>
            </CardHeader>
            <CardContent>
              {activities && activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((participation) => (
                    <div
                      key={participation.id}
                      className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-foreground">{participation.activities?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(participation.completed_at || "").toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-[#FFD700]">+{participation.points_earned} pts</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Você ainda não completou nenhuma atividade.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
