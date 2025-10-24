import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceList } from "@/components/attendance-list"

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && ["presidente", "vice_presidente", "diretor"].includes(profile.role)

  if (!isAdmin) redirect("/dashboard")

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .in("status", ["scheduled", "ongoing", "completed"])
    .order("event_date", { ascending: false })

  const selectedEventId = params.event || upcomingEvents?.[0]?.id

  const { data: selectedEvent } = selectedEventId
    ? await supabase.from("events").select("*").eq("id", selectedEventId).single()
    : { data: null }

  const { data: attendees } = selectedEventId
    ? await supabase.from("event_attendance").select("*, profiles(id, full_name, role)").eq("event_id", selectedEventId)
    : { data: null }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Marcar Presenças</h1>
        <p className="text-white/60">Registre a presença dos membros nos eventos</p>
      </div>

      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white">Selecionar Evento</CardTitle>
          <CardDescription className="text-white/60">Escolha o evento para marcar presenças</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/dashboard/admin/attendance" method="get">
            <Select name="event" defaultValue={selectedEventId}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione um evento" />
              </SelectTrigger>
              <SelectContent>
                {upcomingEvents?.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title} -{" "}
                    {new Date(event.event_date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </CardContent>
      </Card>

      {selectedEvent && attendees && (
        <Card className="bg-white/5 border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-white">{selectedEvent.title}</CardTitle>
            <CardDescription className="text-white/60">
              {new Date(selectedEvent.event_date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • {attendees.length} inscritos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceList attendees={attendees} eventId={selectedEvent.id} pointsValue={selectedEvent.points_value} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
