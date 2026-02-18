import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RoleBadge } from "@/components/role-badge"
import { Calendar, Trophy, Users, TrendingUp, UserCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
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

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .eq("status", "scheduled")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3)

  const { data: userAttendance } = await supabase
    .from("event_attendance")
    .select("*, events(*)")
    .eq("user_id", user.id)
    .eq("attended", true)

  const { data: topMembers } = await supabase
    .from("profiles")
    .select(`
      full_name, 
      total_points, 
      board_role,
      development_level,
      member_institute_areas (
        area
      )
    `)
    .order("total_points", { ascending: false })
    .limit(5)

  const userRank =
    (
      await supabase
        .from("profiles")
        .select("id")
        .gt("total_points", profile?.total_points || 0)
    ).data?.length || 0

  const isProfileIncomplete =
    !profile?.phone ||
    !profile?.bio ||
    !profile?.avatar_url

  return (
    <div className="space-y-8">
      {isProfileIncomplete && (
        <Alert className="border-amber-300 bg-amber-50 text-gray-900 dark:border-primary/30 dark:bg-primary/10 dark:text-foreground [&_svg]:text-amber-700 dark:[&_svg]:text-current">
          <UserCircle className="h-4 w-4 shrink-0" />
          <AlertTitle className="!text-gray-900 dark:!text-foreground">Completar Cadastro</AlertTitle>
          <AlertDescription className="!text-gray-700 dark:!text-muted-foreground">
            <p className="mb-3">
              Complete suas informações de perfil para uma melhor experiência na plataforma.
            </p>
            <Button asChild size="sm" className="gap-2 !bg-amber-600 !text-white hover:!bg-amber-700 dark:!bg-primary dark:!text-primary-foreground dark:hover:!bg-primary/90">
              <Link href="/dashboard/profile/edit">
                Inserir dados do perfil
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Bem-vindo, {profile?.full_name.match(/\S+/)[0]}!</h1>
        <div className="flex items-center gap-2">
          <RoleBadge 
            boardRole={profile?.board_role}
            developmentLevel={profile?.development_level}
            instituteAreas={profile?.member_institute_areas}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pontos Totais</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{profile?.total_points || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Seu ranking: #{userRank + 1}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Eventos Participados</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{userAttendance?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de presenças</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Próximos Eventos</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{upcomingEvents?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Eventos agendados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Membros Ativos</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{topMembers?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Top membros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Próximos Eventos</CardTitle>
            <CardDescription className="text-muted-foreground">Eventos que você pode participar</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.event_date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-primary">{event.points_value} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum evento agendado no momento.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Top 5 Membros</CardTitle>
            <CardDescription className="text-muted-foreground">Ranking por pontuação</CardDescription>
          </CardHeader>
          <CardContent>
            {topMembers && topMembers.length > 0 ? (
              <div className="space-y-4">
                {topMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-foreground">{member.full_name}</p>
                        <RoleBadge 
                          boardRole={member.board_role}
                          developmentLevel={member.development_level}
                          instituteAreas={member.member_institute_areas}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">{member.total_points} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Nenhum membro encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
