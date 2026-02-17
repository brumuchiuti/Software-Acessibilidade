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
import { GoogleCalendarInvite } from "@/components/google-calendar-invite"
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
  const [calendarUrl, setCalendarUrl] = useState<string | null>(null)
  const [organizerEmail, setOrganizerEmail] = useState<string | null>(null)
  const [attendeeCount, setAttendeeCount] = useState<number>(0)
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

      const eventData = {
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
      }

      const { data: newEvent, error } = await supabase.from("events").insert(eventData).select().single()

      if (error) throw error

      // Automatically create Google Calendar event and invite all users
      try {
        const response = await fetch('/api/google-calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: newEvent.id,
            eventData: eventData,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Google Calendar URL generated successfully:', result)
          
          // Store the calendar URL for display
          if (result.calendarUrl) {
            setCalendarUrl(result.calendarUrl)
            setOrganizerEmail(result.organizerEmail)
            setAttendeeCount(result.invitedUsers)
            
            // Update the event with the calendar URL
            await supabase
              .from('events')
              .update({ google_calendar_event_id: result.calendarUrl })
              .eq('id', newEvent.id)
          }
        } else {
          console.error('Failed to generate Google Calendar URL:', await response.text())
        }
      } catch (calendarError) {
        console.error('Error generating Google Calendar URL:', calendarError)
        // Don't fail the entire event creation if calendar fails
      }

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
      {calendarUrl && (
        <GoogleCalendarInvite 
          eventId=""
          calendarUrl={calendarUrl || undefined}
          organizerEmail={organizerEmail || undefined}
          attendeeCount={attendeeCount}
        />
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground">
          Título do Evento
        </Label>
        <Input id="title" name="title" required className="bg-input border-border text-foreground" />
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
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-foreground">
            Data
          </Label>
          <Input id="date" name="date" type="date" required className="bg-input border-border text-foreground" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time" className="text-foreground">
            Horário
          </Label>
          <Input id="time" name="time" type="time" required className="bg-input border-border text-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-foreground">
          Local
        </Label>
        <Input id="location" name="location" required className="bg-input border-border text-foreground" />
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
            defaultValue="10"
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
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status" className="text-foreground">
          Status
        </Label>
        <Select name="status" defaultValue="scheduled">
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
          {loading ? "Criando..." : "Criar Evento"}
        </Button>
      </div>
    </form>
    </div>
  )
}
