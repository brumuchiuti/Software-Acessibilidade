import Link from "next/link"
import { Logo } from "@/components/logo"
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Linkedin } from "lucide-react"

const footerLinks = [
  { href: "#sobre", label: "Quem Somos" },
  { href: "#valores", label: "Valores" },
  { href: "#formacao", label: "Formação" },
  { href: "/docs", label: "Documentação", external: false },
  { href: "https://iflbrasil.com.br", label: "IFL Brasil", external: true },
]

const socialLinks = [
  { href: "https://instagram.com/iflbrasil", icon: Instagram, label: "Instagram" },
  { href: "https://facebook.com/iflbrasil", icon: Facebook, label: "Facebook" },
  { href: "https://youtube.com/iflbrasil", icon: Youtube, label: "YouTube" },
  { href: "https://linkedin.com/company/iflbrasil", icon: Linkedin, label: "LinkedIn" },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#001f3f] px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo href="/" size="lg" showText className="[&_span]:text-white [&_span:last-child]:text-white/70" />
            <p className="mt-4 text-sm text-white/70">
              O IFL é referência na formação de líderes engajados em promover um país próspero e livre!
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Links Importantes</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/70 hover:text-[#FFD700] transition"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-[#FFD700] transition"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Entre em Contato</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFD700]" />
                Av. Uruguai, 754 - Sala 10<br />
                Sion, Belo Horizonte - MG<br />
                CEP: 30.310-300
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#FFD700]" />
                +55 31 97169-5294
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-[#FFD700]" />
                suporte@iflbrasil.com.br
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold text-white">Redes Sociais</h4>
            <div className="flex gap-4">
              {socialLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-[#FFD700]"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-white/60">
            IFL © {new Date().getFullYear()} Copyright | Todos os Direitos reservados
          </p>
          <div className="flex gap-6">
            <Link href="/auth/login" className="text-sm text-white/60 hover:text-[#FFD700]">
              Portal do Associado
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
