"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ActivityApprovalListProps {
  participations: any[]
}

export default function ActivityApprovalList({ participations }: ActivityApprovalListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (participationId: string, pointsValue: number) => {
    setLoading(participationId)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("activity_participation")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          points_earned: pointsValue,
        })
        .eq("id", participationId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error approving activity:", error)
      alert("Erro ao aprovar atividade. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (participationId: string) => {
    if (!confirm("Tem certeza que deseja rejeitar esta atividade?")) return

    setLoading(participationId)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("activity_participation").delete().eq("id", participationId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error rejecting activity:", error)
      alert("Erro ao rejeitar atividade. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  if (!participations || participations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">Nenhuma submissão pendente</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {participations.map((participation: any) => (
        <div key={participation.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{participation.activities.title}</h3>
                <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-500">Pendente</span>
              </div>
              <p className="text-white/60 text-sm mb-2">{participation.activities.description}</p>
              <div className="flex items-center gap-4 text-sm mb-3">
                <span className="text-white/60">
                  Membro: <span className="text-white">{participation.profiles.full_name}</span>
                </span>
                <span className="text-white/60">
                  Tipo: <span className="text-white">{participation.activities.activity_type}</span>
                </span>
                <span className="text-white/60">
                  Pontos: <span className="text-[#FFD700]">{participation.activities.points_value}</span>
                </span>
              </div>
              {participation.notes && (
                <div className="p-3 rounded bg-white/5 border border-white/10">
                  <p className="text-white/80 text-sm">{participation.notes}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApprove(participation.id, participation.activities.points_value)}
                disabled={loading === participation.id}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(participation.id)}
                disabled={loading === participation.id}
                className="border-red-500/50 text-red-500 hover:bg-red-500/10"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
