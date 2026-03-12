"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { formatPhoneForDisplay, formatPhoneInput } from "@/lib/phone"
import { updateMember } from "@/app/actions/update-member"

const ROLE_OPTIONS = [
  { value: "none", label: "Nenhum" },
  { value: "presidente", label: "Presidente" },
  { value: "vice_presidente", label: "Vice-Presidente" },
  { value: "diretor", label: "Diretor" },
]

const BOARD_ROLE_OPTIONS = [
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

const DEVELOPMENT_LEVEL_OPTIONS = [
  { value: "qualify", label: "Qualify" },
  { value: "associado_i", label: "Associado I" },
  { value: "associado_ii", label: "Associado II" },
  { value: "associado_senior", label: "Associado Sênior" },
]

const INSTITUTE_AREA_OPTIONS = [
  { value: "diretoria_financeira", label: "Diretoria Financeira" },
  { value: "diretoria_comunicacao", label: "Diretoria de Comunicação" },
  { value: "diretoria_forum", label: "Diretoria de Fórum" },
  { value: "diretoria_formacao", label: "Diretoria de Formação" },
  { value: "diretoria_institucional", label: "Diretoria Institucional" },
  { value: "diretoria_eventos", label: "Diretoria de Eventos" },
]

type Member = {
  id: string
  full_name: string
  email: string
  role: string | null
  board_role: string | null
  development_level: string
  bio: string | null
  phone: string | null
  linkedin_url: string | null
  instagram_url: string | null
  description: string | null
  member_institute_areas?: Array<{ area: string }>
}

type Props = {
  member: Member
  currentUserId: string
}

export default function EditMemberForm({ member, currentUserId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOwnProfile = member.id === currentUserId

  const [form, setForm] = useState({
    full_name: member.full_name ?? "",
    role: member.role ?? "none",
    board_role: member.board_role ?? "none",
    development_level: member.development_level ?? "qualify",
    institute_areas: member.member_institute_areas?.map((a) => a.area) ?? [],
    bio: member.bio ?? "",
    phone: formatPhoneForDisplay(member.phone) ?? "",
    linkedin_url: member.linkedin_url ?? "",
    instagram_url: member.instagram_url ?? "",
    description: member.description ?? "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const result = await updateMember(member.id, form, isOwnProfile)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push("/dashboard/admin/members")
    router.refresh()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name">Nome Completo *</Label>
        <Input
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
          className="bg-input border-border text-foreground"
          required
          disabled={!isOwnProfile}
        />
        {!isOwnProfile && (
          <p className="text-xs text-muted-foreground">
            Apenas o próprio membro pode alterar informações pessoais
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={member.email}
          disabled
          className="bg-input border-border text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">Email não pode ser alterado</p>
      </div>

      {isOwnProfile && (
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={(e) =>
              setForm((p) => ({ ...p, phone: formatPhoneInput(e.target.value) }))
            }
            placeholder="+55 (11) 98765-4321"
            className="bg-input border-border text-foreground"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Função</Label>
        <Select
          value={form.role}
          onValueChange={(v) => setForm((p) => ({ ...p, role: v }))}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Selecione a função" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Função administrativa do membro
        </p>
      </div>

      <div className="space-y-2">
        <Label>Cargo na Diretoria</Label>
        <Select
          value={form.board_role}
          onValueChange={(v) => setForm((p) => ({ ...p, board_role: v }))}
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue placeholder="Selecione o cargo na diretoria" />
          </SelectTrigger>
          <SelectContent>
            {BOARD_ROLE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Apenas membros da diretoria têm acesso ao painel administrativo
        </p>
      </div>

      <div className="space-y-2">
        <Label>Nível de Desenvolvimento *</Label>
        <Select
          value={form.development_level}
          onValueChange={(v) =>
            setForm((p) => ({ ...p, development_level: v }))
          }
        >
          <SelectTrigger className="bg-input border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEVELOPMENT_LEVEL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Áreas do Instituto</Label>
        <div className="grid grid-cols-2 gap-3">
          {INSTITUTE_AREA_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <Checkbox
                id={opt.value}
                checked={form.institute_areas.includes(opt.value)}
                onCheckedChange={(checked) => {
                  setForm((p) => ({
                    ...p,
                    institute_areas: checked
                      ? [...p.institute_areas, opt.value]
                      : p.institute_areas.filter((a) => a !== opt.value),
                  }))
                }}
                className="border-border"
              />
              <Label
                htmlFor={opt.value}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {opt.label}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Selecione uma ou mais áreas que o membro participa
        </p>
      </div>

      {!isOwnProfile && (
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-sm text-blue-400">
            ℹ️ Você está editando o perfil de outro membro. Apenas informações
            organizacionais podem ser alteradas.
          </p>
        </div>
      )}

      {isOwnProfile && (
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
          <p className="text-sm text-yellow-400">
            ⚠️ Você está editando seu próprio perfil. Tenha cuidado ao alterar
            seu cargo.
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
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
        >
          {loading ? "Atualizando..." : "Atualizar Membro"}
        </Button>
      </div>
    </form>
  )
}
