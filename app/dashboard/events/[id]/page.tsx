import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Trophy, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RegisterEventButton } from "@/components/register-event-button"
import { notFound } from "next/navigation"

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()

  if (!event) {
    notFound()
  }

  const { data: attendance } = await supabase
    .from("event_attendance")
    .select("*")
    .eq("event_id", id)
    .eq("user_id", user.id)
    .single()

  const { data: attendees } = await supabase
    .from("event_attendance")
    .select("*, profiles(full_name, role)")
    .eq("event_id", id)

  const { data: creator } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", event.created_by)
    .single()

  const isUpcoming = new Date(event.event_date) > new Date()
  const isRegistered = !!attendance
  const hasAttended = attendance?.attended

  const getStatusBadge = () => {
    if (hasAttended) return <Badge className="bg-green-600 hover:bg-green-700">Você Participou</Badge>
    if (isRegistered) return <Badge className="bg-blue-600 hover:bg-blue-700">Você está Inscrito</Badge>
    if (isUpcoming)
      return (
        <Badge variant="outline" className="border-[#FFD700] text-[#FFD700]">
          Disponível
        </Badge>
      )
    return <Badge variant="secondary">Encerrado</Badge>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="text-white hover:text-[#FFD700] hover:bg-white/5">
          <Link href="/dashboard/events">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex items-center gap-2">{getStatusBadge()}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-white/5 border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-white">Sobre o Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/80 leading-relaxed">{event.description || "Sem descrição disponível."}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#FFD700]" />
                  <div>
                    <p className="text-xs text-white/60">Data</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(event.event_date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#FFD700]" />
                  <div>
                    <p className="text-xs text-white/60">Horário</p>
                    <p className="text-sm font-medium text-white">
                      {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <p className="text-xs text-white/60">Local</p>
                      <p className="text-sm font-medium text-white">{event.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-[#FFD700]" />
                  <div>
                    <p className="text-xs text-white/60">Pontos</p>
                    <p className="text-sm font-medium text-[#FFD700]">{event.points_value} pontos</p>
                  </div>
                </div>

                {event.max_participants && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <p className="text-xs text-white/60">Vagas</p>
                      <p className="text-sm font-medium text-white">
                        {attendees?.length || 0} / {event.max_participants}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {creator && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/60 mb-1">Criado por</p>
                  <p className="text-sm font-medium text-white">{creator.full_name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isUpcoming && !hasAttended && (
            <Card className="bg-white/5 border-[#FFD700]/20">
              <CardContent className="py-6">
                <RegisterEventButton eventId={event.id} isRegistered={isRegistered} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-white/5 border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-white">Participantes</CardTitle>
              <CardDescription className="text-white/60">
                {attendees?.length || 0} {attendees?.length === 1 ? "pessoa inscrita" : "pessoas inscritas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendees && attendees.length > 0 ? (
                <div className="space-y-3">
                  {attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{attendee.profiles?.full_name}</p>
                        {attendee.attended && (
                          <Badge className="mt-1 bg-green-600/20 text-green-400 text-xs">Presente</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60">Nenhum participante ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
