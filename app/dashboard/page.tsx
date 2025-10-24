import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RoleBadge } from "@/components/role-badge"
import { Calendar, Trophy, Users, TrendingUp } from "lucide-react"

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Bem-vindo, {profile?.full_name.match(/\S+/)[0]}!</h1>
        <div className="flex items-center gap-2">
          <RoleBadge 
            boardRole={profile?.board_role}
            developmentLevel={profile?.development_level}
            instituteAreas={profile?.member_institute_areas}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Pontos Totais</CardTitle>
            <Trophy className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FFD700]">{profile?.total_points || 0}</div>
            <p className="text-xs text-white/60 mt-1">Seu ranking: #{userRank + 1}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Eventos Participados</CardTitle>
            <Calendar className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{userAttendance?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Total de presenças</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Próximos Eventos</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{upcomingEvents?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Eventos agendados</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Membros Ativos</CardTitle>
            <Users className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{topMembers?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Top membros</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-white">Próximos Eventos</CardTitle>
            <CardDescription className="text-white/60">Eventos que você pode participar</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-white">{event.title}</p>
                      <p className="text-sm text-white/60">
                        {new Date(event.event_date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-[#FFD700]">{event.points_value} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">Nenhum evento agendado no momento.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-white">Top 5 Membros</CardTitle>
            <CardDescription className="text-white/60">Ranking por pontuação</CardDescription>
          </CardHeader>
          <CardContent>
            {topMembers && topMembers.length > 0 ? (
              <div className="space-y-4">
                {topMembers.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-[#FFD700]">#{index + 1}</span>
                      <div>
                        <p className="font-medium text-white">{member.full_name}</p>
                        <RoleBadge 
                          boardRole={member.board_role}
                          developmentLevel={member.development_level}
                          instituteAreas={member.member_institute_areas}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#FFD700]">{member.total_points} pts</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/60 text-sm">Nenhum membro encontrado.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
