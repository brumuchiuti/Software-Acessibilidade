"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { formatPhoneForDisplay, formatPhoneInput, normalizePhoneForStorage } from "@/lib/phone"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Linkedin, Instagram, User, Mail, Phone } from "lucide-react"

interface ProfileEditFormProps {
  profile: {
    id: string
    full_name: string
    email: string
    bio?: string
    phone?: string
    avatar_url?: string
    linkedin_url?: string
    instagram_url?: string
    description?: string
  }
}

export function ProfileEditForm({ profile }: ProfileEditFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(profile.avatar_url || null)
  const router = useRouter()
  const supabase = createClient()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `profile-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      let avatarUrl = profile.avatar_url
      const imageFile = formData.get("avatar") as File
      if (imageFile && imageFile.size > 0) {
        avatarUrl = await uploadImage(imageFile)
        if (!avatarUrl) {
          throw new Error("Erro ao fazer upload da imagem")
        }
      }

      const { error } = await supabase.from("profiles").update({
        full_name: formData.get("full_name") as string,
        bio: formData.get("bio") as string || null,
        phone: normalizePhoneForStorage(formData.get("phone") as string),
        avatar_url: avatarUrl,
        linkedin_url: formData.get("linkedin_url") as string || null,
        instagram_url: formData.get("instagram_url") as string || null,
        description: formData.get("description") as string || null,
        updated_at: new Date().toISOString(),
      }).eq("id", profile.id)

      if (error) throw error

      router.push("/dashboard/profile")
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Erro ao atualizar perfil. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label className="text-foreground">Foto de Perfil</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={imagePreview || ""} alt={profile.full_name} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {profile.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Input
              name="avatar"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded file:px-4 file:py-2 file:mr-4"
            />
            <p className="text-xs text-muted-foreground mt-1">Formatos aceitos: JPG, PNG, GIF (máx. 5MB)</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-foreground">
          Nome Completo *
        </Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-foreground">
          Bio (Breve descrição)
        </Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio || ""}
          rows={3}
          placeholder="Uma breve descrição sobre você..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Descrição Detalhada
        </Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={profile.description || ""}
          rows={4}
          placeholder="Conte mais sobre você, seus interesses, experiência profissional..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Telefone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={formatPhoneForDisplay(profile.phone)}
            placeholder="+55 (11) 98765-4321"
            onChange={(e) => {
              e.target.value = formatPhoneInput(e.target.value)
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email (somente leitura)
          </Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="opacity-70"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Redes Sociais</h3>
        
        <div className="space-y-2">
          <Label htmlFor="linkedin_url" className="text-foreground flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Label>
          <Input
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            defaultValue={profile.linkedin_url || ""}
            placeholder="https://linkedin.com/in/seu-perfil"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram_url" className="text-foreground flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </Label>
          <Input
            id="instagram_url"
            name="instagram_url"
            type="url"
            defaultValue={profile.instagram_url || ""}
            placeholder="https://instagram.com/seu-perfil"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
