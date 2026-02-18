"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import { Logo } from "@/components/logo"
import { formatPhoneInput, normalizePhoneForStorage } from "@/lib/phone"
import { Upload, User, Linkedin, Instagram, Phone, FileText } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    repeatPassword: "",
    bio: "",
    description: "",
    phone: "",
    linkedin: "",
    instagram: "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    const formatted = field === "phone" ? formatPhoneInput(value) : value
    setFormData(prev => ({ ...prev, [field]: formatted }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null

    const supabase = createClient()
    const fileExt = avatarFile.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(fileName, avatarFile)

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return null
    }

    const { data } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.repeatPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setIsLoading(false)
      return
    }

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (authError) throw authError

      // If user was created successfully, upload avatar and update profile
      if (authData.user) {
        let avatarUrl = null
        if (avatarFile) {
          avatarUrl = await uploadAvatar(authData.user.id)
        }

        // Update the profile with additional information
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            bio: formData.bio,
            description: formData.description,
            phone: normalizePhoneForStorage(formData.phone),
            linkedin_url: formData.linkedin,
            instagram_url: formData.instagram,
            avatar_url: avatarUrl,
          })
          .eq('id', authData.user.id)

        if (profileError) {
          console.error('Error updating profile:', profileError)
          // Don't throw here as the user was created successfully
        }
      }

      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003366] to-black p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Logo size="lg" showText={true} className="justify-center" href="" />
        </div>

        <Card className="border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>Preencha todos os dados para se juntar ao IFL Jovem SP</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <Label className="text-sm font-medium">Foto de Perfil</Label>
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview} alt="Preview" className="object-cover" />
                        <AvatarFallback className="bg-[#FFD700] text-black text-2xl">
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Clique no ícone para fazer upload da sua foto
                    </p>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Nome Completo *</Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+55 (11) 98765-4321"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Bio and Description */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          id="bio"
                          placeholder="Uma breve descrição sobre você..."
                          className="pl-10 min-h-[80px]"
                          value={formData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="description">Descrição Detalhada</Label>
                      <Textarea
                        id="description"
                        placeholder="Conte mais sobre seus interesses, objetivos e experiência..."
                        className="min-h-[100px]"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="linkedin"
                          type="url"
                          placeholder="https://linkedin.com/in/seu-perfil"
                          className="pl-10"
                          value={formData.linkedin}
                          onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          type="url"
                          placeholder="https://instagram.com/seu-perfil"
                          className="pl-10"
                          value={formData.instagram}
                          onChange={(e) => handleInputChange('instagram', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Senha *</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="repeat-password">Repetir Senha *</Label>
                      <Input
                        id="repeat-password"
                        type="password"
                        required
                        value={formData.repeatPassword}
                        onChange={(e) => handleInputChange('repeatPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-destructive mt-4">{error}</p>}
              
              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="text-[#FFD700] underline underline-offset-4 hover:text-[#FFD700]/80"
                >
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
