"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

interface Member {
  id: string
  full_name: string
  email: string
  role: string
  board_role: string | null
  development_level: string
  director_title: string | null
  bio: string | null
  phone: string | null
  linkedin_url: string | null
  instagram_url: string | null
  description: string | null
  member_institute_areas?: Array<{
    area: string
  }>
}

interface EditMemberFormProps {
  member: Member
  currentUserId: string
}

export default function EditMemberForm({ member, currentUserId }: EditMemberFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: member.full_name,
    role: member.role || "none",
    board_role: member.board_role || "none",
    development_level: member.development_level || "qualify",
    institute_areas: member.member_institute_areas?.map(area => area.area) || [],
    bio: member.bio || "",
    phone: member.phone || "",
    linkedin_url: member.linkedin_url || "",
    instagram_url: member.instagram_url || "",
    description: member.description || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Update profile information
      const updateData: any = {
        role: formData.role === "none" ? null : formData.role,
        board_role: formData.board_role === "none" ? null : formData.board_role,
        development_level: formData.development_level,
      }

      // Only update personal information if editing own profile
      if (isCurrentUser) {
        updateData.full_name = formData.full_name
        updateData.bio = formData.bio || null
        updateData.phone = formData.phone || null
        updateData.linkedin_url = formData.linkedin_url || null
        updateData.instagram_url = formData.instagram_url || null
        updateData.description = formData.description || null
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", member.id)

      if (profileError) throw profileError

      // Update institute areas
      // First, delete existing areas
      const { error: deleteError } = await supabase
        .from("member_institute_areas")
        .delete()
        .eq("member_id", member.id)

      if (deleteError) throw deleteError

      // Then insert new areas
      if (formData.institute_areas.length > 0) {
        const areasToInsert = formData.institute_areas.map(area => ({
          member_id: member.id,
          area: area
        }))

        const { error: insertError } = await supabase
          .from("member_institute_areas")
          .insert(areasToInsert)

        if (insertError) throw insertError
      }

      router.push("/dashboard/admin/members")
      router.refresh()
    } catch (error) {
      console.error("Error updating member:", error)
      alert("Erro ao atualizar membro. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    { value: "none", label: "Nenhum" },
    { value: "presidente", label: "Presidente" },
    { value: "vice_presidente", label: "Vice-Presidente" },
    { value: "diretor", label: "Diretor" },
  ]

  const boardRoleOptions = [
    { value: "none", label: "Não é membro da diretoria" },
    { value: "presidente", label: "Presidente" },
    { value: "vice_presidente", label: "Vice-Presidente" },
    { value: "diretor_eventos", label: "Diretor de Eventos" },
    { value: "diretor_comunicacao", label: "Diretor de Comunicação" },
    { value: "diretor_formacao", label: "Diretor de Formação" },
    { value: "diretor_institucional", label: "Diretor Institucional" },
    { value: "diretor_financeiro", label: "Diretor Financeiro" },
    { value: "diretor_forum", label: "Diretor de Fórum" },
    { value: "conselheiro", label: "Conselheiro" },
  ]

  const developmentLevelOptions = [
    { value: "qualify", label: "Qualify" },
    { value: "associado_i", label: "Associado I" },
    { value: "associado_ii", label: "Associado II" },
    { value: "associado_senior", label: "Associado Sênior" },
  ]

  const instituteAreaOptions = [
    { value: "diretoria_financeira", label: "Diretoria Financeira" },
    { value: "diretoria_comunicacao", label: "Diretoria de Comunicação" },
    { value: "diretoria_forum", label: "Diretoria de Fórum" },
    { value: "diretoria_formacao", label: "Diretoria de Formação" },
    { value: "diretoria_institucional", label: "Diretoria Institucional" },
    { value: "diretoria_eventos", label: "Diretoria de Eventos" },
  ]

  const handleAreaChange = (area: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        institute_areas: [...prev.institute_areas, area]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        institute_areas: prev.institute_areas.filter(a => a !== area)
      }))
    }
  }

  const isCurrentUser = member.id === currentUserId

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-foreground">
          Nome Completo *
        </Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
          required
          disabled={!isCurrentUser}
        />
        {!isCurrentUser && (
          <p className="text-xs text-muted-foreground">Apenas o próprio membro pode alterar informações pessoais</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          value={member.email}
          disabled
          className="bg-input border-border text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-foreground">
          Função
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Função administrativa do membro</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="board_role" className="text-foreground">
          Cargo na Diretoria
        </Label>
        <Select
          value={formData.board_role}
          onValueChange={(value) => setFormData({ ...formData, board_role: value })}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Selecione o cargo na diretoria" />
          </SelectTrigger>
          <SelectContent>
            {boardRoleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Apenas membros da diretoria têm acesso ao painel administrativo</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="development_level" className="text-foreground">
          Nível de Desenvolvimento *
        </Label>
        <Select
          value={formData.development_level}
          onValueChange={(value) => setFormData({ ...formData, development_level: value })}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {developmentLevelOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">
          Áreas do Instituto
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {instituteAreaOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={formData.institute_areas.includes(option.value)}
                onCheckedChange={(checked) => handleAreaChange(option.value, checked as boolean)}
                className="border-border"
              />
              <Label
                htmlFor={option.value}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Selecione uma ou mais áreas que o membro participa</p>
      </div>

      {!isCurrentUser && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-400 text-sm">
            ℹ️ Você está editando o perfil de outro membro. Apenas informações organizacionais podem ser alteradas.
          </p>
        </div>
      )}

      {isCurrentUser && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-yellow-400 text-sm">
            ⚠️ Você está editando seu próprio perfil. Tenha cuidado ao alterar seu cargo.
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1 border-border text-foreground hover:bg-muted/50"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          {loading ? "Atualizando..." : "Atualizar Membro"}
        </Button>
      </div>
    </form>
  )
}
