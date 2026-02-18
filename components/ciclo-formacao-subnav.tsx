"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GraduationCap, Map } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard/ciclo-formacao", icon: GraduationCap, label: "Tarefas" },
  { href: "/dashboard/ciclo-formacao/roadmap", icon: Map, label: "Roadmap de Formação" },
]

export function CicloFormacaoSubnav() {
  const pathname = usePathname()

  return (
    <nav className="flex gap-2 p-1 rounded-lg bg-muted/50 w-fit">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href === "/dashboard/ciclo-formacao" &&
            pathname.startsWith("/dashboard/ciclo-formacao/tarefas")) ||
          (item.href !== "/dashboard/ciclo-formacao" &&
            pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/60"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
