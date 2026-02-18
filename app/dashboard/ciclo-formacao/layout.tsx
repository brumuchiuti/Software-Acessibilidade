import { CicloFormacaoSubnav } from "@/components/ciclo-formacao-subnav"

export default function CicloFormacaoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <CicloFormacaoSubnav />
      {children}
    </div>
  )
}
