"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sun, Moon, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Configurações</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência no IFL Jovem SP</p>
      </div>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">Aparência</CardTitle>
          <CardDescription className="text-muted-foreground">
            Escolha entre o modo claro ou escuro. O modo sistema segue as preferências do seu dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="text-base">Tema</Label>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value)}
            className="grid gap-3 sm:grid-cols-3"
          >
            <Label
              htmlFor="theme-light"
              className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors hover:bg-accent/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent/50 ${
                theme === "light" ? "border-primary bg-accent/50" : "border-transparent"
              }`}
            >
              <RadioGroupItem value="light" id="theme-light" />
              <Sun className="h-5 w-5" />
              <span>Claro</span>
            </Label>
            <Label
              htmlFor="theme-dark"
              className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors hover:bg-accent/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent/50 ${
                theme === "dark" ? "border-primary bg-accent/50" : "border-transparent"
              }`}
            >
              <RadioGroupItem value="dark" id="theme-dark" />
              <Moon className="h-5 w-5" />
              <span>Escuro</span>
            </Label>
            <Label
              htmlFor="theme-system"
              className={`flex items-center gap-3 rounded-lg border-2 p-4 cursor-pointer transition-colors hover:bg-accent/50 has-data-[state=checked]:border-primary has-data-[state=checked]:bg-accent/50 ${
                theme === "system" ? "border-primary bg-accent/50" : "border-transparent"
              }`}
            >
              <RadioGroupItem value="system" id="theme-system" />
              <Monitor className="h-5 w-5" />
              <span>Sistema</span>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  )
}
