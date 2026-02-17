import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default async function ActivitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) redirect("/auth/login")

  // Get user's activity participations with activity details
  const { data: participations } = await supabase
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
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const pendingCount = participations?.filter((p) => !p.completed).length || 0
  const approvedCount = participations?.filter((p) => p.completed).length || 0
  const totalPoints = participations?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Minhas Atividades</h1>
          <p className="text-muted-foreground">Submeta e acompanhe suas atividades de engajamento</p>
        </div>
        <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <Link href="/dashboard/ranking/activities/submit">
            <Plus className="mr-2 h-4 w-4" />
            Submeter Atividade
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FFD700]">{approvedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Atividades concluídas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pontos Ganhos</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#FFD700]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalPoints}</div>
            <p className="text-xs text-muted-foreground mt-1">De atividades</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Histórico de Atividades</CardTitle>
          <CardDescription className="text-muted-foreground">Todas as suas atividades submetidas</CardDescription>
        </CardHeader>
        <CardContent>
          {!participations || participations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Você ainda não submeteu nenhuma atividade</p>
              <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                <Link href="/dashboard/ranking/activities/submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Submeter Primeira Atividade
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {participations.map((participation: any) => (
                <div
                  key={participation.id}
                  className="flex items-start justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{participation.activities.title}</h3>
                      {participation.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{participation.activities.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        Tipo: <span className="text-foreground">{participation.activities.activity_type}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Pontos: <span className="text-[#FFD700]">{participation.activities.points_value}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Status:{" "}
                        <span className={participation.completed ? "text-green-500" : "text-yellow-500"}>
                          {participation.completed ? "Aprovada" : "Pendente"}
                        </span>
                      </span>
                    </div>
                    {participation.notes && (
                      <p className="text-muted-foreground text-sm mt-2 italic">Nota: {participation.notes}</p>
                    )}
                    {participation.image_url && (
                      <a
                        href={participation.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2"
                      >
                        <img
                          src={participation.image_url}
                          alt="Comprovante"
                          className="w-20 h-20 object-cover rounded-lg border border-border hover:opacity-90"
                        />
                        <span className="text-xs text-muted-foreground mt-1 block">Ver imagem</span>
                      </a>
                    )}
                  </div>
                  {participation.completed && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#FFD700]">+{participation.points_earned}</div>
                      <div className="text-xs text-muted-foreground">pontos</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
