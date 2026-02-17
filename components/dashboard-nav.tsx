"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Home, Calendar, Trophy, Users, Settings, LogOut, Activity, Menu, X, Briefcase } from "lucide-react"
import { Logo } from "@/components/logo"
import { useState } from "react"

interface DashboardNavProps {
  user: {
    email: string
    full_name: string
    role: string
    avatar_url?: string | null
  }
}

export function DashboardNav({ user }: DashboardNavProps) {
  console.log("[v0] DashboardNav rendering with user:", user)

  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  console.log("[v0] Creating Supabase client in DashboardNav")
  const supabase = createClient()
  console.log("[v0] Supabase client created in DashboardNav")

  const handleLogout = async () => {
    console.log("[v0] Logging out")
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Início", icon: Home },
    { href: "/dashboard/events", label: "Eventos", icon: Calendar },
    { href: "/dashboard/ranking", label: "Ranking", icon: Trophy },
    { href: "/dashboard/opportunities", label: "Oportunidades", icon: Briefcase },
    { href: "/dashboard/members", label: "Membros", icon: Users },
  ]

  const isAdmin = ["presidente", "vice_presidente", "diretor"].includes(user.role)

  return (
    <nav className="border-b border-[#FFD700]/20 bg-[#001f3f]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="sm" showText={true} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={`text-white hover:text-[#FFD700] hover:bg-white/5 ${
                    isActive ? "text-[#FFD700] bg-white/5" : ""
                  }`}
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
            {isAdmin && (
              <Button
                asChild
                variant="ghost"
                className={`text-white hover:text-[#FFD700] hover:bg-white/5 ${
                  pathname?.startsWith("/dashboard/admin") ? "text-[#FFD700] bg-white/5" : ""
                }`}
              >
                <Link href="/dashboard/admin">
                  <Settings className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
          </div>

          {/* Right side - User menu and mobile menu button */}
          <div className="flex items-center gap-2">
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || ""} alt={user.full_name} className="object-cover" />
                    <AvatarFallback className="bg-[#FFD700] text-black">
                      {user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">Configurações</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-[#FFD700] hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#FFD700]/20 bg-[#001f3f]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className={`w-full justify-start text-white hover:text-[#FFD700] hover:bg-white/5 ${
                      isActive ? "text-[#FFD700] bg-white/5" : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
              {isAdmin && (
                <Button
                  asChild
                  variant="ghost"
                  className={`w-full justify-start text-white hover:text-[#FFD700] hover:bg-white/5 ${
                    pathname?.startsWith("/dashboard/admin") ? "text-[#FFD700] bg-white/5" : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/dashboard/admin">
                    <Settings className="mr-3 h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
