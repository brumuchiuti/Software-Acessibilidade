"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, FileText, Calendar, ClipboardList, FolderTree, Layers } from "lucide-react"
import { ExportPdfButton } from "./export-pdf-button"

const docNavItems = [
  { href: "/docs", label: "Índice", icon: FileText },
  { href: "/docs/tap", label: "TAP / GDD1", icon: FileText },
  { href: "/docs/cronograma", label: "Cronograma (Gantt)", icon: Calendar },
  { href: "/docs/escopo", label: "Declaração de Escopo", icon: ClipboardList },
  { href: "/docs/eap", label: "EAP / WBS", icon: FolderTree },
  { href: "/docs/entrega2", label: "Requisitos, Modelagem e Arquitetura", icon: Layers },
]

export function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#001f3f]">
      <LandingHeader />
      <div className="pt-24 pb-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
          {/* Sidebar - mobile: horizontal scroll, desktop: sticky sidebar */}
          <aside className="shrink-0 lg:w-56">
            <div className="flex flex-col gap-3 lg:hidden">
              <div className="flex gap-2 overflow-x-auto [&>a]:shrink-0">
                {docNavItems.map((item) => (
                  <DocsNavLink key={item.href} href={item.href} icon={item.icon}>
                    {item.label}
                  </DocsNavLink>
                ))}
              </div>
              <ExportPdfButton className="shrink-0" />
            </div>
            <div className="hidden lg:block">
            <div className="sticky top-28 space-y-1 rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">
                Documentos
              </p>
              {docNavItems.map((item) => (
                <DocsNavLink key={item.href} href={item.href} icon={item.icon}>
                  {item.label}
                </DocsNavLink>
              ))}
              <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
                <ExportPdfButton className="w-full justify-center" />
                <Button asChild variant="ghost" size="sm" className="w-full justify-start text-white/70 hover:text-white">
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar ao site
                  </Link>
                </Button>
              </div>
            </div>
            </div>
          </aside>
          <main id="doc-content" className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <LandingFooter />
    </div>
  )
}

function DocsNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== "/docs" && pathname.startsWith(href))

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
        isActive
          ? "bg-[#FFD700]/20 text-[#FFD700]"
          : "text-white/80 hover:bg-white/10 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {children}
    </Link>
  )
}
