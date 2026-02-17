"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createClient } from "@/lib/supabase/client"

interface Opportunity {
  id: string
  title: string
  description: string | null
  link: string | null
  opportunity_type: string
  is_active: boolean
}

interface EditOpportunityFormProps {
  opportunity: Opportunity
}

export default function EditOpportunityForm({ opportunity }: EditOpportunityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: opportunity.title,
    description: opportunity.description || "",
    link: opportunity.link || "",
    opportunity_type: opportunity.opportunity_type,
    is_active: opportunity.is_active,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("opportunities")
        .update({
          title: formData.title,
          description: formData.description || null,
          link: formData.link || null,
          opportunity_type: formData.opportunity_type,
          is_active: formData.is_active,
        })
        .eq("id", opportunity.id)

      if (error) throw error

      router.push("/dashboard/admin/opportunities")
      router.refresh()
    } catch (error) {
      console.error("Error updating opportunity:", error)
      alert("Erro ao atualizar oportunidade. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título da Oportunidade *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Mentoria de Carreira"
          className="bg-white/5 border-white/10 placeholder:text-white/40"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva a oportunidade e seus benefícios..."
          className="bg-white/5 border-white/10 placeholder:text-white/40 min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (opcional)</Label>
        <Input
          id="link"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://..."
          className="bg-white/5 border-white/10 placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="opportunity_type">Tipo *</Label>
        <Input
          id="opportunity_type"
          value={formData.opportunity_type}
          onChange={(e) => setFormData({ ...formData, opportunity_type: e.target.value })}
          placeholder="Ex: estágio, mentoria, curso, voluntariado"
          className="bg-white/5 border-white/10 placeholder:text-white/40"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Oportunidade ativa (visível para membros)</Label>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 border-white/10"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          {loading ? "Atualizando..." : "Atualizar Oportunidade"}
        </Button>
      </div>
    </form>
  )
}
