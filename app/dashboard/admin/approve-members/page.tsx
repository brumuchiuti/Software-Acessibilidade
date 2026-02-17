import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MemberApprovalList from "@/components/member-approval-list"

export default async function AdminApproveMembersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  const { data: pendingMembers } = await supabase
    .from("profiles")
    .select("id, full_name, email, bio, phone, linkedin_url, instagram_url, avatar_url, created_at")
    .eq("approved", false)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Aprovar Membros</h1>
          <p className="text-muted-foreground">
            Revise e aprove novos cadastros para que possam acessar o painel
          </p>
        </div>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Cadastros Pendentes</CardTitle>
          <CardDescription className="text-muted-foreground">
            {pendingMembers?.length || 0} membros aguardando aprovação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MemberApprovalList pendingMembers={pendingMembers || []} />
        </CardContent>
      </Card>
    </div>
  )
}
