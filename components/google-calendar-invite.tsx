"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Mail, ExternalLink, Copy, Check } from "lucide-react"

interface GoogleCalendarInviteProps {
  eventId: string
  calendarUrl?: string | null
  organizerEmail?: string
  attendeeCount?: number
}

export function GoogleCalendarInvite({ 
  eventId, 
  calendarUrl, 
  organizerEmail,
  attendeeCount = 0
}: GoogleCalendarInviteProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyUrl = async () => {
    if (calendarUrl) {
      try {
        await navigator.clipboard.writeText(calendarUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy URL:', error)
      }
    }
  }

  const handleOpenCalendar = () => {
    if (calendarUrl) {
      window.open(calendarUrl, '_blank')
    }
  }

  if (!calendarUrl) {
    return (
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#FFD700]" />
            Google Calendar Invitation
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Generate a calendar invitation with all members as guests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                Not Generated
              </Badge>
              <span className="text-muted-foreground text-sm">
                Calendar invitation not yet created
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>When you create an event, a Google Calendar invitation will be generated that includes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All organization members as attendees</li>
                <li>Event details (title, description, location, time)</li>
                <li>Direct link to create the calendar event</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#FFD700]" />
          Google Calendar Invitation
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Calendar invitation ready with all members as guests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 hover:bg-green-700">
              Ready
            </Badge>
            <span className="text-muted-foreground text-sm">
              Invitation generated successfully
            </span>
          </div>

          {organizerEmail && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Mail className="h-4 w-4" />
              <span>Organizer: {organizerEmail}</span>
            </div>
          )}

          {attendeeCount > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="h-4 w-4" />
              <span>{attendeeCount} members will be invited</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground font-medium">Instructions:</div>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Click "Open Google Calendar" below</li>
              <li>Review the event details and attendees</li>
              <li>Click "Save" to create the event</li>
              <li>All members will receive email invitations</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleOpenCalendar}
              className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Google Calendar
            </Button>
            
            <Button
              onClick={handleCopyUrl}
              variant="outline"
              className="border-border text-foreground bg-transparent hover:bg-muted/50"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {copied && (
            <div className="text-green-500 text-sm text-center">
              ✅ Calendar URL copied to clipboard!
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            The event organizer will receive the calendar invitation and can manage attendees
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
