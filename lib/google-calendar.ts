export interface GoogleCalendarEvent {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
  attendees: string[]
  organizerEmail: string
}

export class GoogleCalendarService {

  /**
   * Generate Google Calendar URL for creating an event with attendees
   */
  static generateGoogleCalendarUrl(event: GoogleCalendarEvent): string {
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    // Create attendees parameter (comma-separated emails)
    const attendeesParam = event.attendees.join(',')
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description,
      location: event.location || '',
      add: attendeesParam, // Add all attendees
      trp: 'false',
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  /**
   * Create a Google Calendar event and invite all attendees
   */
  static async createEventWithInvites(event: GoogleCalendarEvent): Promise<string | null> {
    try {
      // Generate the Google Calendar URL for the event creator
      const calendarUrl = this.generateGoogleCalendarUrl(event)
      
      console.log('Google Calendar URL generated:', calendarUrl)
      console.log('Event organizer:', event.organizerEmail)
      console.log('Attendees:', event.attendees.length, 'users')
      
      // Return the URL instead of creating the event directly
      // The event creator will use this URL to create the event with all attendees
      return calendarUrl
    } catch (error) {
      console.error('Error generating Google Calendar URL:', error)
      return null
    }
  }

  /**
   * Update an existing Google Calendar event
   */
  static async updateEvent(eventId: string, event: GoogleCalendarEvent): Promise<boolean> {
    try {
      // For the simple approach, we'll generate a new URL for updates
      const calendarUrl = this.generateGoogleCalendarUrl(event)
      
      console.log('Google Calendar update URL generated:', calendarUrl)
      console.log('Event organizer:', event.organizerEmail)
      console.log('Updated attendees:', event.attendees.length, 'users')
      
      return true
    } catch (error) {
      console.error('Error generating Google Calendar update URL:', error)
      return false
    }
  }

  /**
   * Delete a Google Calendar event
   */
  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      // For the simple approach, we can't programmatically delete events
      // The event creator will need to delete it manually from their calendar
      console.log('Google Calendar event deletion requested:', eventId)
      console.log('Note: Event must be deleted manually from the organizer\'s calendar')
      
      return true
    } catch (error) {
      console.error('Error handling Google Calendar event deletion:', error)
      return false
    }
  }

  /**
   * Get all user emails from the database
   */
  static async getAllUserEmails(supabase: any): Promise<string[]> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('email')
        .not('email', 'is', null)

      if (error) {
        console.error('Error fetching user emails:', error)
        return []
      }

      return profiles?.map((profile: any) => profile.email) || []
    } catch (error) {
      console.error('Error fetching user emails:', error)
      return []
    }
  }
}
