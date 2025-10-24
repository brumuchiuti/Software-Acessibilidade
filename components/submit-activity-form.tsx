"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Activity {
  id: string
  title: string
  description: string
  activity_type: string
  points_value: number
}

interface SubmitActivityFormProps {
  activities: Activity[]
  userId: string
}

export default function SubmitActivityForm({ activities, userId }: SubmitActivityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<string>("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("activity_participation").insert({
        activity_id: selectedActivity,
        user_id: userId,
        notes: notes || null,
        completed: false,
        points_earned: 0,
      })

      if (error) throw error

      router.push("/dashboard/ranking/activities")
      router.refresh()
    } catch (error) {
      console.error("Error submitting activity:", error)
      alert("Erro ao submeter atividade. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const selectedActivityData = activities.find((a) => a.id === selectedActivity)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="activity" className="text-white">
          Selecione a Atividade *
        </Label>
        <Select value={selectedActivity} onValueChange={setSelectedActivity} required>
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Escolha uma atividade" />
          </SelectTrigger>
          <SelectContent>
            {activities.map((activity) => (
              <SelectItem key={activity.id} value={activity.id}>
                {activity.title} ({activity.points_value} pontos)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedActivityData && (
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <h3 className="text-white font-semibold mb-2">{selectedActivityData.title}</h3>
          <p className="text-white/60 text-sm mb-2">{selectedActivityData.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/60">
              Tipo: <span className="text-white">{selectedActivityData.activity_type}</span>
            </span>
            <span className="text-white/60">
              Pontos: <span className="text-[#FFD700]">{selectedActivityData.points_value}</span>
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className="text-white">
          Notas / Descrição da sua participação
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Descreva como você participou desta atividade..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[120px]"
        />
        <p className="text-xs text-white/60">Opcional: Forneça detalhes sobre sua participação</p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 border-white/10 text-white hover:bg-white/5"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || !selectedActivity}
          className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
        >
          {loading ? "Submetendo..." : "Submeter Atividade"}
        </Button>
      </div>
    </form>
  )
}
