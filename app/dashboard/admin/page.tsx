import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Activity, Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const { data: totalEvents } = await supabase.from("events").select("id", { count: "exact" })

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("id", { count: "exact" })
    .eq("status", "scheduled")
    .gte("event_date", new Date().toISOString())

  const { data: totalMembers } = await supabase.from("profiles").select("id", { count: "exact" })

  const { data: recentAttendance } = await supabase
    .from("event_attendance")
    .select("id", { count: "exact" })
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-white/60">Gerencie eventos, membros e atividades</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalEvents?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Eventos criados</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Próximos Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FFD700]">{upcomingEvents?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Agendados</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total de Membros</CardTitle>
            <Users className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalMembers?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Membros ativos</p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Presenças (7 dias)</CardTitle>
            <Activity className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{recentAttendance?.length || 0}</div>
            <p className="text-xs text-white/60 mt-1">Registros recentes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/5 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FFD700]" />
              Gerenciar Eventos
            </CardTitle>
            <CardDescription className="text-white/60">Criar, editar e gerenciar eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href="/dashboard/admin/events">
                <Plus className="mr-2 h-4 w-4" />
                Acessar Eventos
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-[#FFD700]" />
              Gerenciar Membros
            </CardTitle>
            <CardDescription className="text-white/60">Atualizar funções e informações</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href="/dashboard/admin/members">
                <Plus className="mr-2 h-4 w-4" />
                Acessar Membros
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#FFD700]" />
              Marcar Presenças
            </CardTitle>
            <CardDescription className="text-white/60">Registrar presença em eventos</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href="/dashboard/admin/attendance">
                <Plus className="mr-2 h-4 w-4" />
                Acessar Presenças
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#FFD700]" />
              Gerenciar Atividades
            </CardTitle>
            <CardDescription className="text-white/60">Criar atividades e aprovar submissões</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href="/dashboard/admin/activities">
                <Plus className="mr-2 h-4 w-4" />
                Acessar Atividades
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
