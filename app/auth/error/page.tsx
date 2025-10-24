import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#001f3f] via-[#003366] to-black p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo size="lg" showText={true} className="justify-center" href="" />
        </div>
        
        <Card className="border-[#FFD700]/20">
          <CardHeader>
            <CardTitle className="text-2xl">Desculpe, algo deu errado.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">Código do erro: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Ocorreu um erro não especificado.</p>
            )}
            <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              <Link href="/auth/login">Voltar para Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
