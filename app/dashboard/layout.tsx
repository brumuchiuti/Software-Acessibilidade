import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardNav } from "@/components/dashboard-nav"

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
      // Create profile if it doesn't exist
      const { data: newProfile, error } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || "Novo Membro",
          role: "associado_i",
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

    console.log("[v0] Rendering dashboard with profile:", profile)

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#001f3f] via-[#003366] to-black">
        <DashboardNav
          user={{
            email: user.email!,
            full_name: profile.full_name,
            role: profile.role,
          }}
        />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    )
  } catch (error) {
    console.error("[v0] Dashboard layout error:", error)
    throw error
  }
}
