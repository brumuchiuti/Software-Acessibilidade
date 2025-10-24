"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CreateEventFormProps {
  userId: string
}

export function CreateEventForm({ userId }: CreateEventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const eventDate = new Date(`${formData.get("date")}T${formData.get("time")}`)

      const { error } = await supabase.from("events").insert({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        event_date: eventDate.toISOString(),
        location: formData.get("location") as string,
        status: formData.get("status") as string,
        points_value: Number.parseInt(formData.get("points_value") as string),
        max_participants: formData.get("max_participants")
          ? Number.parseInt(formData.get("max_participants") as string)
          : null,
        created_by: userId,
      })

      if (error) throw error

      router.push("/dashboard/admin/events")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      setError("Erro ao criar evento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">
          Título do Evento
        </Label>
        <Input id="title" name="title" required className="bg-white/5 border-white/10 text-white" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">
          Descrição
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          required
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-white">
            Data
          </Label>
          <Input id="date" name="date" type="date" required className="bg-white/5 border-white/10 text-white" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-white">
            Horário
          </Label>
          <Input id="time" name="time" type="time" required className="bg-white/5 border-white/10 text-white" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-white">
          Local
        </Label>
        <Input id="location" name="location" required className="bg-white/5 border-white/10 text-white" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="points_value" className="text-white">
            Pontos
          </Label>
          <Input
            id="points_value"
            name="points_value"
            type="number"
            min="0"
            defaultValue="10"
            required
            className="bg-white/5 border-white/10 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_participants" className="text-white">
            Máx. Participantes (opcional)
          </Label>
          <Input
            id="max_participants"
            name="max_participants"
            type="number"
            min="1"
            className="bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-white">
          Status
        </Label>
        <Select name="status" defaultValue="scheduled">
          <SelectTrigger className="bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">Agendado</SelectItem>
            <SelectItem value="ongoing">Em Andamento</SelectItem>
            <SelectItem value="completed">Concluído</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-white/20 text-white bg-transparent"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          {loading ? "Criando..." : "Criar Evento"}
        </Button>
      </div>
    </form>
  )
}
