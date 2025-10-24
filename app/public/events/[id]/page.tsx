import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Clock, Trophy, Share2, Download } from "lucide-react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { PublicCalendarIntegration } from "@/components/public-calendar-integration"
import { ShareButton } from "@/components/share-button"

interface PublicEventPageProps {
  params: Promise<{ id: string }>
}

export default async function PublicEventPage({ params }: PublicEventPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the event data without authentication
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Get creator info
  const { data: creator } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", event.created_by)
    .single()

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

  const eventDate = new Date(event.event_date)
  const isUpcoming = eventDate > new Date()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              {getStatusBadge(event.status)}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {event.description || "Um evento especial da nossa organização"}
            </p>
          </div>

          {/* Event Image */}
          {event.image_url && (
            <Card className="bg-white/5 border-[#FFD700]/20 overflow-hidden rounded-2xl">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover rounded-2xl"
                  priority
                />
              </div>
            </Card>
          )}

          {/* Event Details */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Details */}
            <Card className="bg-white/5 border-[#FFD700]/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#FFD700]" />
                  Detalhes do Evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <p className="text-xs text-white/60">Data</p>
                      <p className="text-sm font-medium text-white">
                        {eventDate.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          weekday: "long",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-[#FFD700]" />
                    <div>
                      <p className="text-xs text-white/60">Horário</p>
                      <p className="text-sm font-medium text-white">
                        {eventDate.toLocaleTimeString("pt-BR", {
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
                        <p className="text-xs text-white/60">Vagas Disponíveis</p>
                        <p className="text-sm font-medium text-white">{event.max_participants} participantes</p>
                      </div>
                    </div>
                  )}
                </div>

                {creator && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-white/60 mb-1">Organizado por</p>
                    <p className="text-sm font-medium text-white">{creator.full_name}</p>
                    <p className="text-xs text-white/60">{creator.role}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Calendar Integration */}
            <Card className="bg-white/5 border-[#FFD700]/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-[#FFD700]" />
                  Adicionar ao Calendário
                </CardTitle>
                <CardDescription className="text-white/60">
                  Adicione este evento ao seu calendário pessoal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PublicCalendarIntegration event={event} />
              </CardContent>
            </Card>
          </div>

          {/* Share Section */}
          <Card className="bg-white/5 border-[#FFD700]/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[#FFD700]" />
                Compartilhar Evento
              </CardTitle>
              <CardDescription className="text-white/60">
                Compartilhe este evento com seus amigos e familiares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShareButton 
                eventTitle={event.title}
                eventUrl={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/public/events/${event.id}`}
              />
            </CardContent>
          </Card>

          {/* Call to Action */}
          {/* {isUpcoming && event.status === 'scheduled' && (
            <Card className="bg-linear-to-r from-[#FFD700]/10 to-[#FFD700]/5 border-[#FFD700]/30">
              <CardContent className="py-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Interessado em participar?
                </h3>
                <p className="text-white/80 mb-6">
                  Faça login em nossa plataforma para se inscrever neste evento e ganhar pontos!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild 
                    className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                  >
                    <a href="/auth/login">
                      Fazer Login
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="border-[#FFD700]/40 text-[#FFD700] bg-transparent hover:bg-[#FFD700]/10"
                  >
                    <a href="/auth/sign-up">
                      Criar Conta
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )} */}

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-white/60 text-sm">
              Este é um evento público da nossa organização
            </p>
            <p className="text-white/40 text-xs mt-2">
              Para mais informações, entre em contato conosco
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
