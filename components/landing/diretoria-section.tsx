import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap, Wallet, Building2 } from "lucide-react"

const diretoras = [
  {
    name: "Giana Ferretti",
    role: "Formação",
    icon: GraduationCap,
  },
  {
    name: "Luiza Arantes",
    role: "Financeiro",
    icon: Wallet,
  },
  {
    name: "Sara Queren",
    role: "Institucional",
    icon: Building2,
  },
]

export function DiretoriaSection() {
  return (
    <section id="diretoria" className="bg-white py-20 px-4 dark:bg-[#0a1628]">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-[#001f3f] dark:text-white sm:text-4xl">
          Diretoria 2024
        </h2>
        <p className="mb-16 text-center text-lg text-muted-foreground">
          A equipe que lidera o IFL Jovem São Paulo
        </p>
        <div className="grid gap-12 sm:grid-cols-3">
          {diretoras.map((diretora) => (
            <div
              key={diretora.name}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="mb-4 h-32 w-32 border-4 border-[#FFD700]/30">
                <AvatarFallback className="bg-[#001f3f] text-3xl text-[#FFD700]">
                  {diretora.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-foreground">{diretora.name}</h3>
              <div className="mt-2 flex items-center justify-center gap-2 text-[#FFD700]">
                <diretora.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{diretora.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
