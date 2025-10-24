"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Download, ExternalLink, Share2 } from "lucide-react"
import { CalendarService, CalendarEvent } from "@/lib/calendar"

interface CalendarIntegrationProps {
  event: CalendarEvent
  onClose?: () => void
}

export function CalendarIntegration({ event, onClose }: CalendarIntegrationProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleGoogleCalendar = () => {
    const url = CalendarService.generateGoogleCalendarUrl(event)
    window.open(url, '_blank')
  }

  const handleOutlookCalendar = () => {
    const url = CalendarService.generateOutlookCalendarUrl(event)
    window.open(url, '_blank')
  }

  const handleDownloadICS = () => {
    CalendarService.downloadICSFile(event)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: CalendarService.generateGoogleCalendarUrl(event)
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const url = CalendarService.generateGoogleCalendarUrl(event)
      navigator.clipboard.writeText(url)
      // You could add a toast notification here
    }
  }

  if (!isOpen) return null

  return (
    <Card className="bg-white/5 border-[#FFD700]/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#FFD700]" />
              Adicionar ao Calendário
            </CardTitle>
            <CardDescription className="text-white/60">
              Adicione este evento ao seu calendário pessoal
            </CardDescription>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-[#FFD700]"
            >
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={handleGoogleCalendar}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Google Calendar
          </Button>
          
          <Button
            onClick={handleOutlookCalendar}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Outlook Calendar
          </Button>
          
          <Button
            onClick={handleDownloadICS}
            className="bg-gray-600 hover:bg-gray-700 text-white"
            variant="outline"
          >
            <Download className="h-4 w-4 mr-2" />
            Download (.ics)
          </Button>
          
          <Button
            onClick={handleShare}
            className="bg-green-600 hover:bg-green-700 text-white"
            variant="outline"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>
        
        <div className="text-xs text-white/50 text-center">
          Escolha sua plataforma de calendário preferida para adicionar o evento
        </div>
        
        {onClose && (
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-white/20 text-white bg-transparent hover:bg-white/5"
            >
              Continuar sem adicionar ao calendário
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
