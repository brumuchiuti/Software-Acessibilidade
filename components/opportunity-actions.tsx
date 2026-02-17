"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface Opportunity {
  id: string
  title: string
  description: string | null
  link: string | null
  opportunity_type: string
  is_active: boolean
  created_by: string | null
}

interface OpportunityActionsProps {
  opportunity: Opportunity
}

export default function OpportunityActions({ opportunity }: OpportunityActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Tem certeza que deseja excluir a oportunidade "${opportunity.title}"?`)) {
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("opportunities").delete().eq("id", opportunity.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting opportunity:", error)
      alert("Erro ao excluir oportunidade. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {opportunity.link && (
        <Button
          asChild
          size="sm"
          variant="outline"
          className="border-[#FFD700]/40 text-blue-500 bg-transparent"
        >
          <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-1 h-3 w-3" />
            Link
          </a>
        </Button>
      )}
      <Button
        asChild
        size="sm"
        variant="outline"
        className="border-[#FFD700]/40 text-blue-500 bg-transparent"
      >
        <Link href={`/dashboard/admin/opportunities/${opportunity.id}/edit`}>
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
