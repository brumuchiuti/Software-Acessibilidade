"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"

interface CreateActivityFormProps {
  userId: string
}

export default function CreateActivityForm({ userId }: CreateActivityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activity_type: "",
    points_value: 5,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("activities").insert({
        ...formData,
        created_by: userId,
      })

      if (error) throw error

      router.push("/dashboard/admin/activities")
      router.refresh()
    } catch (error) {
      console.error("Error creating activity:", error)
      alert("Erro ao criar atividade. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground">
          Título da Atividade *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Participação em Workshop"
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Descrição
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva a atividade..."
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity_type" className="text-foreground">
          Tipo de Atividade *
        </Label>
        <Input
          id="activity_type"
          value={formData.activity_type}
          onChange={(e) => setFormData({ ...formData, activity_type: e.target.value })}
          placeholder="Ex: workshop, projeto, voluntariado"
          className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="points_value" className="text-foreground">
          Valor em Pontos *
        </Label>
        <Input
          id="points_value"
          type="number"
          min="1"
          value={formData.points_value}
          onChange={(e) => setFormData({ ...formData, points_value: Number.parseInt(e.target.value) })}
          className="bg-muted border-border text-foreground"
          required
        />
        <p className="text-xs text-muted-foreground">Quantos pontos esta atividade vale</p>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 border-border text-foreground hover:bg-muted"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          {loading ? "Criando..." : "Criar Atividade"}
        </Button>
      </div>
    </form>
  )
}
