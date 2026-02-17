import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Trophy, ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RegisterEventButton } from "@/components/register-event-button"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    .select("*, profiles(full_name, role, avatar_url)")
    .eq("event_id", id)

  const { data: creator } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
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
        <Badge variant="outline" className="border-[#FFD700] text-primary">
          Disponível
        </Badge>
      )
    return <Badge variant="secondary">Encerrado</Badge>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="text-foreground hover:text-primary hover:bg-muted/50">
          <Link href="/dashboard/events">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">{event.title}</h1>
          <div className="flex items-center gap-2">{getStatusBadge()}</div>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-green-500/40 text-green-400 bg-transparent hover:bg-green-500/10"
        >
          <Link href={`/public/events/${event.id}`} target="_blank">
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {event.image_url && (
            <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20 overflow-hidden rounded-2xl">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
            </Card>
          )}
          
          <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-foreground">Sobre o Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{event.description || "Sem descrição disponível."}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(event.event_date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Horário</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Local</p>
                      <p className="text-sm font-medium text-foreground">{event.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Pontos</p>
                    <p className="text-sm font-medium text-primary">{event.points_value} pontos</p>
                  </div>
                </div>

                {event.max_participants && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vagas</p>
                      <p className="text-sm font-medium text-foreground">
                        {attendees?.length || 0} / {event.max_participants}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {creator && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Criado por</p>
                  <p className="text-sm font-medium text-foreground">{creator.full_name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isUpcoming && !hasAttended && (
            <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
              <CardContent className="py-6">
                <RegisterEventButton eventId={event.id} isRegistered={isRegistered} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-foreground">Participantes</CardTitle>
              <CardDescription className="text-muted-foreground">
                {attendees?.length || 0} {attendees?.length === 1 ? "pessoa inscrita" : "pessoas inscritas"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {attendees && attendees.length > 0 ? (
                <div className="space-y-3">
                  {attendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={attendee.profiles?.avatar_url || ""} alt={attendee.profiles?.full_name} className="object-cover" />
                          <AvatarFallback className="bg-[#FFD700] text-black">
                            {attendee.profiles?.full_name
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-foreground">{attendee.profiles?.full_name}</p>
                        {attendee.attended && (
                          <Badge className="mt-1 bg-green-600/20 text-green-400 text-xs">Presente</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum participante ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
