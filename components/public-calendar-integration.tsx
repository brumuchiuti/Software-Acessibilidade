"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Download, ExternalLink } from "lucide-react"
import { CalendarService, CalendarEvent } from "@/lib/calendar"

interface PublicCalendarIntegrationProps {
  event: {
    id: string
    title: string
    description: string | null
    event_date: string
    location: string | null
  }
}

export function PublicCalendarIntegration({ event }: PublicCalendarIntegrationProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const eventDate = new Date(event.event_date)
  const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000) // Default 2 hours duration

  const calendarEvent: CalendarEvent = {
    title: event.title,
    description: event.description || "",
    startDate: eventDate,
    endDate: endDate,
    location: event.location || "",
  }

  const handleCalendarDownload = async (format: 'google' | 'outlook' | 'ics') => {
    setIsGenerating(true)
    
    try {
      switch (format) {
        case 'google':
          const googleUrl = CalendarService.generateGoogleCalendarUrl(calendarEvent)
          window.open(googleUrl, '_blank')
          break
        case 'outlook':
          const outlookUrl = CalendarService.generateOutlookCalendarUrl(calendarEvent)
          window.open(outlookUrl, '_blank')
          break
        case 'ics':
          CalendarService.downloadICSFile(calendarEvent, `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`)
          break
      }
    } catch (error) {
      console.error('Error generating calendar event:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <Button
          onClick={() => handleCalendarDownload('google')}
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {isGenerating ? "Gerando..." : "Adicionar ao Google Calendar"}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={() => handleCalendarDownload('outlook')}
          disabled={isGenerating}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {isGenerating ? "Gerando..." : "Adicionar ao Outlook"}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>

        <Button
          onClick={() => handleCalendarDownload('ics')}
          disabled={isGenerating}
          variant="outline"
          className="w-full border-[#FFD700]/40 text-[#FFD700] bg-transparent hover:bg-[#FFD700]/10"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Gerando..." : "Baixar arquivo .ics"}
        </Button>
      </div>

      <div className="text-xs text-white/60 text-center">
        <p>Escolha seu calendário preferido para adicionar este evento</p>
      </div>
    </div>
  )
}
