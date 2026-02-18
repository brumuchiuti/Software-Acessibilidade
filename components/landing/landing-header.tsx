"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "#sobre", label: "Quem Somos" },
  { href: "#valores", label: "Valores" },
  { href: "#diretoria", label: "Diretoria" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#formacao", label: "Ciclo de Formação" },
  { href: "#participar", label: "Participar" },
]

export function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#001f3f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo href="/" size="md" showText className="[&_span]:!text-white [&_span:last-child]:!text-white/80" />
        
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition hover:text-[#FFD700]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
            <Link href="/auth/login">Entrar</Link>
          </Button>
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
            <Link href="/auth/sign-up">Quero Participar</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#001f3f] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/90 hover:text-[#FFD700]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Button asChild variant="outline" size="sm" className="border-[#FFD700] text-[#FFD700] flex-1">
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button asChild size="sm" className="bg-[#FFD700] text-black flex-1">
                <Link href="/auth/sign-up">Participar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
