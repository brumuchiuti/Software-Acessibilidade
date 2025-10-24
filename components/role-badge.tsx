import { Badge } from "@/components/ui/badge"

interface RoleBadgeProps {
  role: string
  directorTitle?: string | null
}

export function RoleBadge({ role, directorTitle }: RoleBadgeProps) {
  const roleLabels: Record<string, string> = {
    presidente: "Presidente",
    vice_presidente: "Vice-Presidente",
    diretor: directorTitle || "Diretor",
    associado_i: "Associado I",
    associado_ii: "Associado II",
    associado_iii: "Associado III",
    associado_senior: "Associado Sênior",
  }

  const roleColors: Record<string, string> = {
    presidente: "bg-[#FFD700] text-black hover:bg-[#FFD700]/90",
    vice_presidente: "bg-[#FFD700]/80 text-black hover:bg-[#FFD700]/70",
    diretor: "bg-[#003366] text-[#FFD700] hover:bg-[#003366]/90",
    associado_i: "bg-white/10 text-white hover:bg-white/20",
    associado_ii: "bg-white/10 text-white hover:bg-white/20",
    associado_iii: "bg-white/10 text-white hover:bg-white/20",
    associado_senior: "bg-white/20 text-white hover:bg-white/30",
  }

  return <Badge className={roleColors[role] || "bg-secondary"}>{roleLabels[role] || role}</Badge>
}
