import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003366] to-black p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">IFL Jovem SP</h1>
          <p className="text-[#FFD700]">Instituto de Formação de Líderes</p>
        </div>

        <Card className="border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-2xl">Obrigado por se cadastrar!</CardTitle>
            <CardDescription>Verifique seu email para confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Você se cadastrou com sucesso. Por favor, verifique seu email para confirmar sua conta antes de fazer
              login.
            </p>
            <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href="/auth/login">Voltar para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
