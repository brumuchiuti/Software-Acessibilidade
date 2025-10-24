// Calendar integration utilities
export interface CalendarEvent {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
  attendees?: string[]
}

export class CalendarService {
  /**
   * Generate Google Calendar URL for adding event
   */
  static generateGoogleCalendarUrl(event: CalendarEvent): string {
    const startDate = event.startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDate = event.endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: `${startDate}/${endDate}`,
      details: event.description,
      location: event.location || '',
      trp: 'false',
    })

    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  /**
   * Generate Outlook Calendar URL for adding event
   */
  static generateOutlookCalendarUrl(event: CalendarEvent): string {
    const startDate = event.startDate.toISOString()
    const endDate = event.endDate.toISOString()
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      subject: event.title,
      startdt: startDate,
      enddt: endDate,
      body: event.description,
      location: event.location || '',
    })

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
  }

  /**
   * Generate Apple Calendar (.ics) file content
   */
  static generateICSContent(event: CalendarEvent): string {
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//IFL Jovem SP//Event Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@ifl-jovem-sp.com`,
      `DTSTART:${formatDate(event.startDate)}`,
      `DTEND:${formatDate(event.endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location || ''}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')
  }

  /**
   * Download ICS file
   */
  static downloadICSFile(event: CalendarEvent, filename?: string): void {
    const content = this.generateICSContent(event)
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
