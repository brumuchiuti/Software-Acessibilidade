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
import { CalendarIntegration } from "@/components/calendar-integration"
import { CalendarService, CalendarEvent } from "@/lib/calendar"

interface CreateEventFormProps {
  userId: string
}

export function CreateEventForm({ userId }: CreateEventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showCalendarIntegration, setShowCalendarIntegration] = useState(false)
  const [createdEvent, setCreatedEvent] = useState<CalendarEvent | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      // Remove the folder prefix - upload directly to bucket root
      const filePath = fileName

      console.log('Uploading image:', { fileName, filePath, bucket: 'event-images' })

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath)

      console.log('Upload successful:', data.publicUrl)
      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      const eventDate = new Date(`${formData.get("date")}T${formData.get("time")}`)
      
      let imageUrl = null
      const imageFile = formData.get("image") as File
      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          throw new Error("Erro ao fazer upload da imagem")
        }
      }

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
        image_url: imageUrl,
        created_by: userId,
      })

      if (error) throw error

      // Show calendar integration after successful event creation
      const calendarEvent: CalendarEvent = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        startDate: eventDate,
        endDate: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000), // Default 2 hours duration
        location: formData.get("location") as string,
      }
      
      setCreatedEvent(calendarEvent)
      setShowCalendarIntegration(true)

      // Don't redirect immediately, let user add to calendar first
      // router.push("/dashboard/admin/events")
      // router.refresh()
    } catch (error) {
      console.error("[v0] Error creating event:", error)
      setError("Erro ao criar evento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCalendarComplete = () => {
    setShowCalendarIntegration(false)
    router.push("/dashboard/admin/events")
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {showCalendarIntegration && createdEvent && (
        <CalendarIntegration 
          event={createdEvent} 
          onClose={handleCalendarComplete}
        />
      )}
      
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

      <div className="space-y-2">
        <Label htmlFor="image" className="text-white">
          Imagem do Evento (opcional)
        </Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="bg-white/5 border-white/10 text-white file:bg-[#FFD700] file:text-black file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-white/10"
            />
          </div>
        )}
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
    </div>
  )
}
