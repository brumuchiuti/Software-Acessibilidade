"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

interface RegisterEventButtonProps {
  eventId: string
  isRegistered: boolean
}

export function RegisterEventButton({ eventId, isRegistered }: RegisterEventButtonProps) {
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(isRegistered)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { error } = await supabase.from("event_attendance").insert({
        event_id: eventId,
        user_id: user.id,
        attended: false,
      })

      if (error) throw error

      setRegistered(true)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error registering for event:", error)
      alert("Erro ao se inscrever no evento. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase.from("event_attendance").delete().eq("event_id", eventId).eq("user_id", user.id)

      if (error) throw error

      setRegistered(false)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error unregistering from event:", error)
      alert("Erro ao cancelar inscrição. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Você está inscrito neste evento!</span>
        </div>
        <Button
          onClick={handleUnregister}
          disabled={loading}
          variant="outline"
          className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 bg-transparent"
        >
          {loading ? "Cancelando..." : "Cancelar Inscrição"}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/60">
        <XCircle className="h-5 w-5" />
        <span>Você ainda não está inscrito</span>
      </div>
      <Button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
      >
        {loading ? "Inscrevendo..." : "Inscrever-se no Evento"}
      </Button>
    </div>
  )
}
