import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log("[v0] Dashboard layout loading")

  try {
    const supabase = await createClient()
    console.log("[v0] Supabase server client created")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] User fetched:", user?.id)

    if (!user) {
      console.log("[v0] No user found, redirecting to login")
      redirect("/auth/login")
    }

    console.log("[v0] Fetching profile for user:", user.id)
    let { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    console.log("[v0] Profile fetch result:", { profile, profileError })

    if (!profile) {
      console.log("[v0] Profile not found, creating new profile")
      // Create profile if it doesn't exist (approved: false - awaits admin approval)
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || "Novo Membro",
          role: "associado_i",
          approved: false,
        })
        .select()
        .single()

      console.log("[v0] Profile creation result:", { newProfile, error })

      if (error) {
        console.error("[v0] Error creating profile:", error)
        redirect("/auth/login")
      }

      profile = newProfile
    }

    const isAdmin = profile && profile.board_role !== null
    const isApproved = profile?.approved === true

    if (!isAdmin && !isApproved) {
      redirect("/auth/pending-approval")
    }

    console.log("[v0] Rendering dashboard with profile:", profile)

    return (
      <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-[#001f3f] dark:via-[#003366] dark:to-black">
        <DashboardSidebar
          user={{
            email: user.email!,
            full_name: profile.full_name,
            role: profile.role,
            avatar_url: profile.avatar_url,
          }}
        >
          <main className="container mx-auto px-4 py-8">{children}</main>
        </DashboardSidebar>
      </div>
    )
  } catch (error) {
    console.error("[v0] Dashboard layout error:", error)
    throw error
  }
}
