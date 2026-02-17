"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RoleBadge } from "@/components/role-badge"
import { CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface AttendanceListProps {
  attendees: any[]
  eventId: string
  pointsValue: number
}

export function AttendanceList({ attendees, eventId, pointsValue }: AttendanceListProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleToggleAttendance = async (attendanceId: string, currentStatus: boolean, userId: string) => {
    setLoading(attendanceId)
    try {
      const newStatus = !currentStatus

      const { error } = await supabase
        .from("event_attendance")
        .update({
          attended: newStatus,
          checked_in_at: newStatus ? new Date().toISOString() : null,
          points_earned: newStatus ? pointsValue : 0,
        })
        .eq("id", attendanceId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating attendance:", error)
      alert("Erro ao atualizar presença. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      {attendees.map((attendee) => (
        <div
          key={attendee.id}
          className="flex items-center justify-between p-4 rounded-lg bg-card border border-border"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" alt={attendee.profiles?.full_name} className="object-cover" />
              <AvatarFallback className="bg-[#FFD700] text-black">
                {attendee.profiles?.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold text-foreground">{attendee.profiles?.full_name}</p>
              <RoleBadge 
                boardRole={attendee.profiles?.board_role}
                developmentLevel={attendee.profiles?.development_level}
                instituteAreas={attendee.profiles?.member_institute_areas}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {attendee.attended ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Presente</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Ausente</span>
              </div>
            )}

            <Button
              onClick={() => handleToggleAttendance(attendee.id, attendee.attended, attendee.user_id)}
              disabled={loading === attendee.id}
              size="sm"
              className={
                attendee.attended
                  ? "bg-red-600 hover:bg-red-700 text-foreground"
                  : "bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
              }
            >
              {loading === attendee.id ? "..." : attendee.attended ? "Marcar Ausente" : "Marcar Presente"}
            </Button>
          </div>
        </div>
      ))}

      {attendees.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Nenhum membro inscrito neste evento ainda.</p>
      )}
    </div>
  )
}
