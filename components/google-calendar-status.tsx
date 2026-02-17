"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Mail, ExternalLink } from "lucide-react"

interface GoogleCalendarStatusProps {
  eventId: string
  googleCalendarEventId?: string | null
  hasGoogleCalendarIntegration: boolean
}

export function GoogleCalendarStatus({ 
  eventId, 
  googleCalendarEventId, 
  hasGoogleCalendarIntegration 
}: GoogleCalendarStatusProps) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleCreateCalendarEvent = async () => {
    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/google-calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          eventData: {}, // This would need to be passed from parent component
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setStatus('success')
        console.log('Google Calendar event created:', result)
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        setStatus('error')
        console.error('Failed to create Google Calendar event:', await response.text())
      }
    } catch (error) {
      setStatus('error')
      console.error('Error creating Google Calendar event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCalendarEvent = async () => {
    if (!googleCalendarEventId) return

    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch(`/api/google-calendar?googleEventId=${googleCalendarEventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setStatus('success')
        console.log('Google Calendar event deleted')
        // Refresh the page to show updated status
        window.location.reload()
      } else {
        setStatus('error')
        console.error('Failed to delete Google Calendar event:', await response.text())
      }
    } catch (error) {
      setStatus('error')
      console.error('Error deleting Google Calendar event:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!hasGoogleCalendarIntegration) {
    return (
      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#FFD700]" />
            Google Calendar Integration
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Create a Google Calendar event and invite all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-red-500 text-red-500">
                Not Connected
              </Badge>
              <span className="text-muted-foreground text-sm">
                No Google Calendar event created yet
              </span>
            </div>
            
            <Button
              onClick={handleCreateCalendarEvent}
              disabled={loading}
              className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              {loading ? "Creating..." : "Create Google Calendar Event"}
            </Button>

            {status === 'success' && (
              <div className="text-green-500 text-sm text-center">
                ✅ Google Calendar event created successfully!
              </div>
            )}

            {status === 'error' && (
              <div className="text-red-500 text-sm text-center">
                ❌ Failed to create Google Calendar event. Check console for details.
              </div>
            )}
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
          Google Calendar Integration
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Google Calendar event is active and users have been invited
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600 hover:bg-green-700">
              Connected
            </Badge>
            <span className="text-muted-foreground text-sm">
              Event ID: {googleCalendarEventId}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            <span>All users have been invited via email</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Mail className="h-4 w-4" />
            <span>Email reminders: 1 day & 1 hour before event</span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => window.open(`https://calendar.google.com/event?eid=${googleCalendarEventId}`, '_blank')}
              variant="outline"
              className="flex-1 border-border text-foreground bg-transparent hover:bg-muted/50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Calendar
            </Button>
            
            <Button
              onClick={handleDeleteCalendarEvent}
              disabled={loading}
              variant="outline"
              className="flex-1 border-red-500/50 text-red-500 bg-transparent hover:bg-red-500/10"
            >
              {loading ? "Deleting..." : "Delete Event"}
            </Button>
          </div>

          {status === 'success' && (
            <div className="text-green-500 text-sm text-center">
              ✅ Operation completed successfully!
            </div>
          )}

          {status === 'error' && (
            <div className="text-red-500 text-sm text-center">
              ❌ Operation failed. Check console for details.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
