"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Activity {
  id: string
  title: string
  description: string
  activity_type: string
  points_value: number
  created_by: string
}

interface ActivityActionsProps {
  activity: Activity
}

export default function ActivityActions({ activity }: ActivityActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a atividade "${activity.title}"? Esta ação não pode ser desfeita.`)) {
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // First, delete all participations for this activity
      const { error: participationError } = await supabase
        .from("activity_participation")
        .delete()
        .eq("activity_id", activity.id)

      if (participationError) {
        console.error("Error deleting participations:", participationError)
        // Continue with activity deletion even if participations fail
      }

      // Then delete the activity
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", activity.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting activity:", error)
      alert("Erro ao excluir atividade. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        asChild
        size="sm"
        variant="outline"
        className="border-[#FFD700]/40 text-blue-500 bg-transparent"
      >
        <Link href={`/dashboard/admin/activities/${activity.id}/edit`}>
          <Edit className="mr-1 h-3 w-3" />
          Editar
        </Link>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={loading}
        className="border-red-500/50 text-red-500 hover:bg-red-500/10"
      >
        <Trash2 className="mr-1 h-3 w-3" />
        {loading ? "Excluindo..." : "Excluir"}
      </Button>
    </div>
  )
}
