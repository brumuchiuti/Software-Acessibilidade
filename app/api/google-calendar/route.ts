import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleCalendarService, GoogleCalendarEvent } from '@/lib/google-calendar'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const isAdmin = profile && profile.board_role !== null
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { eventId, eventData } = body

    if (!eventId || !eventData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get all user emails
    const userEmails = await GoogleCalendarService.getAllUserEmails(supabase)
    
    if (userEmails.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 })
    }

    // Get the event creator's email
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', eventData.created_by)
      .single()

    if (!creatorProfile?.email) {
      return NextResponse.json({ error: 'Event creator email not found' }, { status: 400 })
    }

    // Generate Google Calendar URL with all users as attendees
    const googleCalendarEvent: GoogleCalendarEvent = {
      title: eventData.title,
      description: eventData.description,
      startDate: new Date(eventData.event_date),
      endDate: new Date(new Date(eventData.event_date).getTime() + 2 * 60 * 60 * 1000), // Default 2 hours duration
      location: eventData.location,
      attendees: userEmails,
      organizerEmail: creatorProfile.email,
    }

    const calendarUrl = await GoogleCalendarService.createEventWithInvites(googleCalendarEvent)

    if (!calendarUrl) {
      return NextResponse.json({ error: 'Failed to generate Google Calendar URL' }, { status: 500 })
    }

    // Store the calendar URL in the database
    const { error: updateError } = await supabase
      .from('events')
      .update({ google_calendar_event_id: calendarUrl })
      .eq('id', eventId)

    if (updateError) {
      console.error('Error updating event with Google Calendar URL:', updateError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({ 
      success: true, 
      calendarUrl,
      organizerEmail: creatorProfile.email,
      invitedUsers: userEmails.length 
    })

  } catch (error) {
    console.error('Error in Google Calendar API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const isAdmin = profile && profile.board_role !== null
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { eventId, eventData } = body

    if (!eventId || !eventData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get all user emails
    const userEmails = await GoogleCalendarService.getAllUserEmails(supabase)
    
    if (userEmails.length === 0) {
      return NextResponse.json({ error: 'No users found' }, { status: 400 })
    }

    // Get the event creator's email
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', eventData.created_by)
      .single()

    if (!creatorProfile?.email) {
      return NextResponse.json({ error: 'Event creator email not found' }, { status: 400 })
    }

    // Generate updated Google Calendar URL
    const googleCalendarEvent: GoogleCalendarEvent = {
      title: eventData.title,
      description: eventData.description,
      startDate: new Date(eventData.event_date),
      endDate: new Date(new Date(eventData.event_date).getTime() + 2 * 60 * 60 * 1000), // Default 2 hours duration
      location: eventData.location,
      attendees: userEmails,
      organizerEmail: creatorProfile.email,
    }

    const success = await GoogleCalendarService.updateEvent('', googleCalendarEvent)

    if (!success) {
      return NextResponse.json({ error: 'Failed to generate updated Google Calendar URL' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      updatedUsers: userEmails.length,
      organizerEmail: creatorProfile.email
    })

  } catch (error) {
    console.error('Error in Google Calendar update API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    const isAdmin = profile && profile.board_role !== null
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const googleEventId = searchParams.get('googleEventId')

    if (!googleEventId) {
      return NextResponse.json({ error: 'Missing Google Event ID' }, { status: 400 })
    }

    const success = await GoogleCalendarService.deleteEvent(googleEventId)

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete Google Calendar event' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in Google Calendar delete API route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
