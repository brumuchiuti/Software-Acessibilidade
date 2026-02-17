"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  status: string
  points_value: number
  max_participants: number | null
  image_url: string | null
  created_by: string
  google_calendar_event_id?: string | null
}

interface EditEventFormProps {
  event: Event
  userId: string
}

export function EditEventForm({ event, userId }: EditEventFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hasNewImage, setHasNewImage] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Initialize form with existing event data
  useEffect(() => {
    if (event.image_url) {
      setImagePreview(event.image_url)
    }
  }, [event.image_url])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
        setHasNewImage(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
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
      
      let imageUrl = event.image_url // Keep existing image by default
      const imageFile = formData.get("image") as File
      if (imageFile && imageFile.size > 0) {
        imageUrl = await uploadImage(imageFile)
        if (!imageUrl) {
          throw new Error("Erro ao fazer upload da imagem")
        }
      }

      const updateData = {
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
      }

      const { error } = await supabase
        .from("events")
        .update(updateData)
        .eq("id", event.id)

      if (error) throw error

      // Update Google Calendar event if it exists
      if (event.google_calendar_event_id) {
        try {
          const response = await fetch('/api/google-calendar', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventId: event.id,
              googleEventId: event.google_calendar_event_id,
              eventData: updateData,
            }),
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Google Calendar event updated successfully:', result)
          } else {
            console.error('Failed to update Google Calendar event:', await response.text())
          }
        } catch (calendarError) {
          console.error('Error updating Google Calendar event:', calendarError)
          // Don't fail the entire event update if calendar fails
        }
      }

      router.push("/dashboard/admin/events")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating event:", error)
      setError("Erro ao atualizar evento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  // Format date and time for form inputs
  const eventDate = new Date(event.event_date)
  const formattedDate = eventDate.toISOString().split('T')[0]
  const formattedTime = eventDate.toTimeString().slice(0, 5)

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-foreground">
            Título do Evento
          </Label>
          <Input 
            id="title" 
            name="title" 
            required 
            defaultValue={event.title}
            className="bg-input border-border text-foreground" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-foreground">
            Descrição
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            required
            defaultValue={event.description}
            className="bg-input border-border text-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className="text-foreground">
            Imagem do Evento (opcional)
          </Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="bg-input border-border text-foreground file:bg-[#FFD700] file:text-black file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-border"
              />
              {hasNewImage && (
                <p className="text-sm text-[#FFD700] mt-1">Nova imagem selecionada</p>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">
              Data
            </Label>
            <Input 
              id="date" 
              name="date" 
              type="date" 
              required 
              defaultValue={formattedDate}
              className="bg-input border-border text-foreground" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time" className="text-foreground">
              Horário
            </Label>
            <Input 
              id="time" 
              name="time" 
              type="time" 
              required 
              defaultValue={formattedTime}
              className="bg-input border-border text-foreground" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-foreground">
            Local
          </Label>
          <Input 
            id="location" 
            name="location" 
            required 
            defaultValue={event.location}
            className="bg-input border-border text-foreground" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="points_value" className="text-foreground">
              Pontos
            </Label>
            <Input
              id="points_value"
              name="points_value"
              type="number"
              min="0"
              defaultValue={event.points_value}
              required
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_participants" className="text-foreground">
              Máx. Participantes (opcional)
            </Label>
            <Input
              id="max_participants"
              name="max_participants"
              type="number"
              min="1"
              defaultValue={event.max_participants || ""}
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-foreground">
            Status
          </Label>
          <Select name="status" defaultValue={event.status}>
            <SelectTrigger className="bg-input border-border text-foreground">
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
            className="flex-1 border-border text-foreground bg-transparent"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
            {loading ? "Atualizando..." : "Atualizar Evento"}
          </Button>
        </div>
      </form>
    </div>
  )
}
