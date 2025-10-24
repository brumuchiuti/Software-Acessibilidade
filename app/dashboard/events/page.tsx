import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

export default async function EventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*, event_attendance(user_id, attended)")
    .in("status", ["scheduled", "ongoing"])
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })

  const { data: pastEvents } = await supabase
    .from("events")
    .select("*, event_attendance(user_id, attended)")
    .eq("status", "completed")
    .lt("event_date", new Date().toISOString())
    .order("event_date", { ascending: false })
    .limit(10)

  const getEventStatus = (event: any) => {
    const userAttendance = event.event_attendance?.find((a: any) => a.user_id === user.id)
    if (userAttendance?.attended) return "attended"
    if (userAttendance) return "registered"
    return "available"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "attended":
        return <Badge className="bg-green-600 hover:bg-green-700">Participou</Badge>
      case "registered":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Inscrito</Badge>
      case "available":
        return (
          <Badge variant="outline" className="border-[#FFD700] text-[#FFD700]">
            Disponível
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Eventos</h1>
        <p className="text-white/60">Participe dos eventos semanais e acumule pontos</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Próximos Eventos</h2>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => {
                const status = getEventStatus(event)
                return (
                  <Card
                    key={event.id}
                    className="bg-white/5 border-[#FFD700]/20 hover:border-[#FFD700]/40 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                        {getStatusBadge(status)}
                      </div>
                      <CardDescription className="text-white/60 line-clamp-2">{event.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Calendar className="h-4 w-4 text-[#FFD700]" />
                          <span>
                            {new Date(event.event_date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="h-4 w-4 text-[#FFD700]" />
                          <span>
                            {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <MapPin className="h-4 w-4 text-[#FFD700]" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.max_participants && (
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Users className="h-4 w-4 text-[#FFD700]" />
                            <span>Máx. {event.max_participants} participantes</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-lg font-bold text-[#FFD700]">{event.points_value} pontos</span>
                        <Button asChild size="sm" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                          <Link href={`/dashboard/events/${event.id}`}>Ver Detalhes</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-white/5 border-[#FFD700]/20">
              <CardContent className="py-12 text-center">
                <p className="text-white/60">Nenhum evento agendado no momento.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Eventos Anteriores</h2>
          {pastEvents && pastEvents.length > 0 ? (
            <div className="space-y-4">
              {pastEvents.map((event) => {
                const status = getEventStatus(event)
                return (
                  <Card key={event.id} className="bg-white/5 border-[#FFD700]/20">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                            {getStatusBadge(status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.event_date).toLocaleDateString("pt-BR")}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-[#FFD700]">{event.points_value} pts</span>
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-[#FFD700]/40 text-[#FFD700] bg-transparent"
                          >
                            <Link href={`/dashboard/events/${event.id}`}>Ver</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="bg-white/5 border-[#FFD700]/20">
              <CardContent className="py-12 text-center">
                <p className="text-white/60">Nenhum evento anterior encontrado.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
