import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, ExternalLink } from "lucide-react"

export default async function OpportunitiesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) redirect("/auth/login")
  if (!profile.approved && !profile.board_role) redirect("/auth/pending-approval")

  const { data: opportunities } = await supabase
    .from("opportunities")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Oportunidades</h1>
        <p className="text-muted-foreground">
          Oportunidades que o instituto oferece aos membros — estágios, mentorias, cursos e mais
        </p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#FFD700]" />
            Oportunidades Disponíveis
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Confira as oportunidades disponíveis para membros do IFL
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!opportunities || opportunities.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma oportunidade disponível no momento</p>
              <p className="text-muted-foreground text-sm mt-2">Confira novamente em breve!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {opportunities.map((opp: any) => (
                <Card
                  key={opp.id}
                  className="bg-card/50 border-primary/10 hover:border-[#FFD700]/30 transition-colors overflow-hidden"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{opp.title}</CardTitle>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/20 text-[#FFD700] shrink-0">
                        {opp.opportunity_type}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {opp.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3">{opp.description}</p>
                    )}
                    {opp.link && (
                      <a
                        href={opp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#FFD700] hover:text-[#FFD700]/80 font-medium"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Saiba mais
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
