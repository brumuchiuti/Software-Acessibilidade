import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown, Building2, CalendarDays, GraduationCap, Wallet, Megaphone } from "lucide-react"

const diretoria = [
  { name: "Ellen Brito", role: "Presidente", icon: Crown, image: "/gestao/ellen-brito.jpeg" },
  { name: "Moisés Marin", role: "Vice-Presidente e Diretor Institucional", icon: Building2, image: "/gestao/moises-marin.jpeg" },
  { name: "Gabriel Henrique", role: "Diretor de Eventos", icon: CalendarDays, image: "/gestao/gabriel-henrique.png" },
  { name: "Mateus Couto", role: "Diretor de Formação", icon: GraduationCap, image: "/gestao/mateus-couto.jpeg" },
  { name: "Pedro Quelhas", role: "Diretor Financeiro", icon: Wallet, image: "/gestao/pedro-quelhas.jpeg" },
  { name: "Ivan Vecchia", role: "Diretor de Comunicação", icon: Megaphone, image: "/gestao/ivan-vecchia.jpeg" },
]

export function DiretoriaSection() {
  return (
    <section id="diretoria" className="bg-white py-20 px-4 dark:bg-[#0a1628]">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center font-[family-name:var(--font-serif)] text-3xl font-bold text-[#001f3f] dark:text-white sm:text-4xl">
          Diretoria 2026
        </h2>
        <p className="mb-16 text-center text-lg text-muted-foreground">
          A equipe que lidera o IFL Jovem São Paulo
        </p>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {diretoria.map((dir) => (
            <div
              key={dir.name}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="mb-4 h-32 w-32 border-4 border-[#FFD700]/30">
                <AvatarImage src={dir.image} alt={dir.name} className="object-cover object-center" />
                <AvatarFallback className="bg-[#001f3f] text-3xl text-[#FFD700]">
                  {dir.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-foreground">{dir.name}</h3>
              <div className="mt-2 flex items-center justify-center gap-2 text-[#FFD700]">
                <dir.icon className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium text-center max-w-[220px]">{dir.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
