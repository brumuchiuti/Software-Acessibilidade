import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Plus, Share2, Mail } from "lucide-react"
import Link from "next/link"

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile && profile.board_role !== null

  if (!isAdmin) redirect("/dashboard")

  const { data: allEvents } = await supabase.from("events").select("*").order("event_date", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Agendado</Badge>
      case "ongoing":
        return <Badge className="bg-green-600 hover:bg-green-700">Em Andamento</Badge>
      case "completed":
        return <Badge className="bg-gray-600 hover:bg-gray-700">Concluído</Badge>
      case "cancelled":
        return <Badge className="bg-red-600 hover:bg-red-700">Cancelado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Gerenciar Eventos</h1>
          <p className="text-muted-foreground">Criar e gerenciar eventos da organização</p>
        </div>
        <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          <Link href="/dashboard/admin/events/create">
            <Plus className="mr-2 h-4 w-4" />
            Criar Evento
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {allEvents && allEvents.length > 0 ? (
          allEvents.map((event) => (
            <Card key={event.id} className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.event_date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      )}
                      <span className="text-primary">{event.points_value} pontos</span>
                      {event.google_calendar_event_id && (
                        <span className="flex items-center gap-1 text-green-400">
                          <Mail className="h-3 w-3" />
                          Google Calendar
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-[#FFD700]/40 text-primary bg-transparent"
                    >
                      <Link href={`/dashboard/admin/events/${event.id}/edit`}>Editar</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-green-500/40 text-green-400 bg-transparent"
                    >
                      <Link href={`/public/events/${event.id}`} target="_blank">
                        <Share2 className="mr-1 h-3 w-3" />
                        Compartilhar
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                      <Link href={`/dashboard/admin/attendance?event=${event.id}`}>Presenças</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum evento criado ainda.</p>
              <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                <Link href="/dashboard/admin/events/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Evento
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
