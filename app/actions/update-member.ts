"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { normalizePhoneForStorage } from "@/lib/phone"

export type UpdateMemberResult = { error?: string; success?: boolean }

export async function updateMember(
  memberId: string,
  formData: {
    full_name: string
    role: string
    board_role: string
    development_level: string
    institute_areas: string[]
    bio: string
    phone: string
    linkedin_url: string
    instagram_url: string
    description: string
  },
  isOwnProfile: boolean
): Promise<UpdateMemberResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("board_role")
    .eq("id", user.id)
    .single()

  if (!adminProfile?.board_role) {
    return { error: "Sem permissão para editar membros" }
  }

  const profilePayload: Record<string, unknown> = {
    role: formData.role === "none" ? null : formData.role,
    board_role: formData.board_role === "none" ? null : formData.board_role,
    development_level: formData.development_level,
  }

  if (isOwnProfile) {
    profilePayload.full_name = formData.full_name
    profilePayload.bio = formData.bio || null
    profilePayload.phone = normalizePhoneForStorage(formData.phone) || null
    profilePayload.linkedin_url = formData.linkedin_url || null
    profilePayload.instagram_url = formData.instagram_url || null
    profilePayload.description = formData.description || null
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profilePayload)
    .eq("id", memberId)

  if (profileError) {
    console.error("Profile update error:", profileError)
    return { error: profileError.message }
  }

  const { error: deleteError } = await supabase
    .from("member_institute_areas")
    .delete()
    .eq("member_id", memberId)

  if (deleteError) {
    console.error("Delete areas error:", deleteError)
    return { error: deleteError.message }
  }

  if (formData.institute_areas.length > 0) {
    const rows = formData.institute_areas.map((area) => ({
      member_id: memberId,
      area,
    }))

    const { error: insertError } = await supabase
      .from("member_institute_areas")
      .insert(rows)

    if (insertError) {
      console.error("Insert areas error:", insertError)
      return { error: insertError.message }
    }
  }

  revalidatePath("/dashboard/admin/members")
  return { success: true }
}
