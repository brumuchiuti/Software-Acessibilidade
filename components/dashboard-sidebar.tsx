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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Home, Calendar, Trophy, Users, Settings, LogOut, GraduationCap, Briefcase, ChevronDown } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardSidebarProps {
  user: {
    email: string
    full_name: string
    role: string
    avatar_url?: string | null
  }
  children: React.ReactNode
}

export function DashboardSidebar({ user, children }: DashboardSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Início", icon: Home },
    { href: "/dashboard/events", label: "Eventos", icon: Calendar },
    { href: "/dashboard/ranking", label: "Ranking", icon: Trophy },
    { href: "/dashboard/ciclo-formacao", label: "Ciclo de Formação", icon: GraduationCap },
    { href: "/dashboard/opportunities", label: "Oportunidades", icon: Briefcase },
    { href: "/dashboard/members", label: "Membros", icon: Users },
  ]

  const isAdmin = ["presidente", "vice_presidente", "diretor"].includes(user.role)

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border p-3 group-data-[collapsible=icon]/sidebar-inner:items-center">
          <Link href="/dashboard" className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]/sidebar-inner:justify-center">
            <Logo size="sm" showText={true} textClassName="group-data-[collapsible=icon]/sidebar-inner:hidden" />
          </Link>
        </SidebarHeader>

        <SidebarContent className="group-data-[collapsible=icon]/sidebar-inner:flex group-data-[collapsible=icon]/sidebar-inner:flex-col group-data-[collapsible=icon]/sidebar-inner:items-center">
          <SidebarGroup className="group-data-[collapsible=icon]/sidebar-inner:items-center group-data-[collapsible=icon]/sidebar-inner:w-full">
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                        <Link href={item.href}>
                          <Icon className="h-4 w-4 flex items-center justify-center" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
                {isAdmin && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname?.startsWith("/dashboard/admin") ?? false}
                      tooltip="Admin"
                    >
                      <Link href="/dashboard/admin">
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2 group-data-[collapsible=icon]/sidebar-inner:flex group-data-[collapsible=icon]/sidebar-inner:flex-col group-data-[collapsible=icon]/sidebar-inner:items-center">
          <div className="mb-2">
            <ThemeToggle variant="sidebar" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 px-2 py-2 h-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground [&>span]:truncate group-data-[collapsible=icon]/sidebar-inner:justify-center group-data-[collapsible=icon]/sidebar-inner:px-2"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user.avatar_url || ""} alt={user.full_name} className="object-cover" />
                  <AvatarFallback className="bg-[#FFD700] text-black text-xs">
                    {user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 truncate text-left min-w-0 group-data-[collapsible=icon]/sidebar-inner:hidden">
                  {user.full_name}
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-70 group-data-[collapsible=icon]/sidebar-inner:hidden" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-56">
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
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-transparent">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar/90 px-4 backdrop-blur-sm">
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
        </header>
        <div className="flex-1 overflow-auto bg-transparent">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
