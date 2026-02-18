"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { formatPhoneForDisplay } from "@/lib/phone"

interface MemberApprovalListProps {
  pendingMembers: Array<{
    id: string
    full_name: string
    email: string
    bio?: string | null
    phone?: string | null
    linkedin_url?: string | null
    instagram_url?: string | null
    avatar_url?: string | null
    created_at?: string
  }>
}

export default function MemberApprovalList({ pendingMembers }: MemberApprovalListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (memberId: string) => {
    setLoading(memberId)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({ approved: true })
        .eq("id", memberId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error approving member:", error)
      alert("Erro ao aprovar membro. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (memberId: string) => {
    if (!confirm("Tem certeza que deseja rejeitar este cadastro? O usuário não poderá acessar o sistema.")) return

    setLoading(memberId)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("profiles").delete().eq("id", memberId)

      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error rejecting member:", error)
      alert("Erro ao rejeitar membro. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  if (!pendingMembers || pendingMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhum membro aguardando aprovação</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {pendingMembers.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 rounded-lg bg-card border border-border gap-4 flex-wrap"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={member.avatar_url || ""} alt={member.full_name} className="object-cover" />
              <AvatarFallback className="bg-[#FFD700] text-black">
                {member.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground truncate">{member.full_name}</p>
              <p className="text-sm text-muted-foreground truncate">{member.email}</p>
              {member.phone && (
                <p className="text-sm text-muted-foreground truncate">{formatPhoneForDisplay(member.phone)}</p>
              )}
              {member.bio && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{member.bio}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              size="sm"
              onClick={() => handleApprove(member.id)}
              disabled={loading === member.id}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(member.id)}
              disabled={loading === member.id}
              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejeitar
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
