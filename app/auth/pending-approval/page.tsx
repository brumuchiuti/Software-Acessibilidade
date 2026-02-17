import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Clock } from "lucide-react"

export default function PendingApprovalPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003366] to-black p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="lg" showText={true} className="justify-center" href="" />
        </div>

        <Card className="border-[#FFD700]/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-[#FFD700]" />
              <CardTitle className="text-2xl">Aguardando Aprovação</CardTitle>
            </div>
            <CardDescription>
              Sua conta foi criada com sucesso e está aguardando aprovação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Um administrador do IFL Jovem SP precisa aprovar seu cadastro antes que você possa acessar o painel.
              Você será notificado assim que sua conta for aprovada.
            </p>
            <p className="text-sm text-muted-foreground">
              Em caso de dúvidas, entre em contato com a diretoria.
            </p>
            <Button asChild variant="outline" className="w-full border-[#FFD700]/40 text-foreground hover:bg-[#FFD700]/10">
              <Link href="/auth/login">Voltar para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
