import { Badge } from "@/components/ui/badge"

interface RoleBadgeProps {
  boardRole?: string | null
  developmentLevel?: string
  instituteAreas?: Array<{ area: string }>
}

export function RoleBadge({ boardRole, developmentLevel, instituteAreas }: RoleBadgeProps) {
  const boardRoleLabels: Record<string, string> = {
    presidente: "Presidente",
    vice_presidente: "Vice-Presidente",
    diretor_eventos: "Diretor de Eventos",
    diretor_comunicacao: "Diretor de Comunicação",
    diretor_formacao: "Diretor de Formação",
    diretor_institucional: "Diretor Institucional",
    diretor_financeiro: "Diretor Financeiro",
    diretor_forum: "Diretor de Fórum",
    conselheiro: "Conselheiro",
  }

  const developmentLevelLabels: Record<string, string> = {
    qualify: "Qualify",
    associado_i: "Associado I",
    associado_ii: "Associado II",
    associado_senior: "Associado Sênior",
  }

  const instituteAreaLabels: Record<string, string> = {
    diretoria_financeira: "Diretoria Financeira",
    diretoria_comunicacao: "Diretoria de Comunicação",
    diretoria_forum: "Diretoria de Fórum",
    diretoria_formacao: "Diretoria de Formação",
    diretoria_institucional: "Diretoria Institucional",
    diretoria_eventos: "Diretoria de Eventos",
  }

  const boardRoleColors: Record<string, string> = {
    presidente: "bg-[#FFD700] text-black hover:bg-[#FFD700]/90",
    vice_presidente: "bg-[#FFD700]/80 text-black hover:bg-[#FFD700]/70",
    diretor_eventos: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    diretor_comunicacao: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    diretor_formacao: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    diretor_institucional: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    diretor_financeiro: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    diretor_forum: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    conselheiro: "bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-600 dark:text-white",
  }

  const developmentLevelColors: Record<string, string> = {
    qualify: "bg-gray-500 text-white hover:bg-gray-600",
    associado_i: "bg-muted text-foreground hover:bg-muted/80",
    associado_ii: "bg-muted text-foreground hover:bg-muted/80",
    associado_senior: "bg-muted text-foreground hover:bg-muted/80",
  }

  return (
    <div className="flex flex-wrap gap-2">
      {boardRole && (
        <Badge className={boardRoleColors[boardRole] || "bg-secondary"}>
          {boardRoleLabels[boardRole] || boardRole}
        </Badge>
      )}
      {developmentLevel && (
        <Badge className={developmentLevelColors[developmentLevel] || "bg-secondary"}>
          {developmentLevelLabels[developmentLevel] || developmentLevel}
        </Badge>
      )}
      {instituteAreas && instituteAreas.length > 0 && (
        <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
          {instituteAreas.map(area => instituteAreaLabels[area.area] || area.area).join(", ")}
        </Badge>
      )}
    </div>
  )
}
