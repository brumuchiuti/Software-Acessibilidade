import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import ActivityApprovalList from "@/components/activity-approval-list"
import ActivityActions from "@/components/activity-actions"

export default async function AdminActivitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  // Get all activities
  const { data: activities } = await supabase.from("activities").select("*").order("created_at", { ascending: false })

  // Get pending participations
  const { data: pendingParticipations } = await supabase
    .from("activity_participation")
    .select(
      `
      *,
      activities (
        id,
        title,
        description,
        activity_type,
        points_value
      ),
      profiles (
        id,
        full_name,
        email,
        role
      )
    `,
    )
    .eq("completed", false)
    .order("created_at", { ascending: false })

  // Get approved participations
  const { data: approvedParticipations } = await supabase
    .from("activity_participation")
    .select(
      `
      *,
      activities (
        id,
        title,
        activity_type,
        points_value
      ),
      profiles (
        id,
        full_name
      )
    `,
    )
    .eq("completed", true)
    .order("completed_at", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gerenciar Atividades</h1>
          <p className="text-muted-foreground">Crie atividades e aprove submissões dos membros</p>
        </div>
        <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <Link href="/dashboard/admin/activities/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar Atividade
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Total de Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{activities?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{pendingParticipations?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{approvedParticipations?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Submissões Pendentes</CardTitle>
          <CardDescription className="text-muted-foreground">
            Aprove ou rejeite atividades submetidas pelos membros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityApprovalList participations={pendingParticipations || []} />
        </CardContent>
      </Card>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Atividades Disponíveis</CardTitle>
          <CardDescription className="text-muted-foreground">Todas as atividades criadas</CardDescription>
        </CardHeader>
        <CardContent>
          {!activities || activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma atividade criada ainda</p>
              <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                <Link href="/dashboard/admin/activities/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Atividade
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity: any) => (
                <div key={activity.id} className="p-4 rounded-lg bg-card border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{activity.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Tipo: <span className="text-foreground">{activity.activity_type}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Pontos: <span className="text-[#FFD700]">{activity.points_value}</span>
                        </span>
                      </div>
                    </div>
                    <ActivityActions activity={activity} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
