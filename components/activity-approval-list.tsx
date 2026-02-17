"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Edit3 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ActivityApprovalListProps {
  participations: any[]
}

export default function ActivityApprovalList({ participations }: ActivityApprovalListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [editingPoints, setEditingPoints] = useState<string | null>(null)
  const [pointsValues, setPointsValues] = useState<Record<string, number>>({})

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

  const handleEditPoints = (participationId: string, currentPoints: number) => {
    setEditingPoints(participationId)
    setPointsValues(prev => ({
      ...prev,
      [participationId]: currentPoints
    }))
  }

  const handleSavePoints = (participationId: string) => {
    setEditingPoints(null)
  }

  const handlePointsChange = (participationId: string, value: string) => {
    const numValue = parseInt(value) || 0
    setPointsValues(prev => ({
      ...prev,
      [participationId]: numValue
    }))
  }

  const getPointsValue = (participation: any) => {
    return pointsValues[participation.id] ?? participation.activities.points_value
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
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Pontos:</span>
                  {editingPoints === participation.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={getPointsValue(participation)}
                        onChange={(e) => handlePointsChange(participation.id, e.target.value)}
                        className="w-20 h-6 text-xs bg-white/5 border-white/10 text-white"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSavePoints(participation.id)}
                        className="h-6 px-2 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                      >
                        ✓
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-[#FFD700]">{getPointsValue(participation)}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditPoints(participation.id, getPointsValue(participation))}
                        className="h-6 w-6 p-0 text-white/60 hover:text-[#FFD700] hover:bg-white/5"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {participation.notes && (
                <div className="p-3 rounded bg-white/5 border border-white/10">
                  <p className="text-white/80 text-sm">{participation.notes}</p>
                </div>
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
                    className="w-24 h-24 object-cover rounded-lg border border-white/10 hover:opacity-90"
                  />
                  <span className="text-xs text-white/60 mt-1 block">Clique para ampliar</span>
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleApprove(participation.id, getPointsValue(participation))}
                disabled={loading === participation.id || editingPoints === participation.id}
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
