import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Briefcase } from "lucide-react"
import Link from "next/link"
import OpportunityActions from "@/components/opportunity-actions"

export default async function AdminOpportunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false })

  const activeCount = opportunities?.filter((o) => o.is_active)?.length ?? 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Oportunidades</h1>
          <p className="text-muted-foreground">Gerencie oportunidades que o instituto oferece aos membros</p>
        </div>
        <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <Link href="/dashboard/admin/opportunities/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar Oportunidade
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Total de Oportunidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{opportunities?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-foreground">Oportunidades Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#FFD700]">{activeCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#FFD700]" />
            Oportunidades Cadastradas
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Todas as oportunidades criadas (ativas e inativas)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!opportunities || opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Nenhuma oportunidade cadastrada ainda</p>
              <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                <Link href="/dashboard/admin/opportunities/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Oportunidade
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp: any) => (
                <div
                  key={opp.id}
                  className={`p-4 rounded-lg bg-card border ${
                    opp.is_active ? "border-border" : "border-border opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">{opp.title}</h3>
                        {!opp.is_active && (
                          <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            Inativa
                          </span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded bg-[#FFD700]/20 text-[#FFD700]">
                          {opp.opportunity_type}
                        </span>
                      </div>
                      {opp.description && (
                        <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{opp.description}</p>
                      )}
                      {opp.link && (
                        <a
                          href={opp.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline truncate block"
                        >
                          {opp.link}
                        </a>
                      )}
                    </div>
                    <OpportunityActions opportunity={opp} />
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
