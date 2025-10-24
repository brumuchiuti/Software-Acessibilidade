"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Crown, Users, Shield } from "lucide-react"

export function AdminManagement() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const supabase = createClient()

  const handlePromoteUser = async () => {
    if (!email || !role) {
      setMessage({ type: 'error', text: 'Por favor, preencha email e função' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.rpc('promote_to_admin', {
        user_email: email,
        new_role: role
      })

      if (error) throw error

      if (data) {
        setMessage({ type: 'success', text: `Usuário ${email} promovido para ${role} com sucesso!` })
        setEmail("")
        setRole("")
      } else {
        setMessage({ type: 'error', text: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Error promoting user:', error)
      setMessage({ type: 'error', text: 'Erro ao promover usuário' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFirstAdmin = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Por favor, informe o email' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.rpc('create_first_admin', {
        user_email: email
      })

      if (error) throw error

      if (data) {
        setMessage({ type: 'success', text: `Primeiro administrador criado: ${email}` })
        setEmail("")
      } else {
        setMessage({ type: 'error', text: 'Usuário não encontrado' })
      }
    } catch (error) {
      console.error('Error creating first admin:', error)
      setMessage({ type: 'error', text: 'Erro ao criar primeiro administrador' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-[#FFD700]" />
            Gerenciar Administradores
          </CardTitle>
          <CardDescription className="text-white/60">
            Promova usuários para funções administrativas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email do Usuário</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-white">Função</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="presidente">Presidente</SelectItem>
                <SelectItem value="vice_presidente">Vice-Presidente</SelectItem>
                <SelectItem value="diretor">Diretor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePromoteUser}
              disabled={loading}
              className="flex-1 bg-[#FFD700] text-black hover:bg-[#FFD700]/90"
            >
              {loading ? "Promovendo..." : "Promover Usuário"}
            </Button>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                : 'bg-red-600/20 text-red-400 border border-red-600/30'
            }`}>
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#FFD700]" />
            Configuração Inicial
          </CardTitle>
          <CardDescription className="text-white/60">
            Crie o primeiro administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first-admin-email" className="text-white">Email do Primeiro Admin</Label>
            <Input
              id="first-admin-email"
              type="email"
              placeholder="admin@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <Button
            onClick={handleCreateFirstAdmin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? "Criando..." : "Criar Primeiro Administrador"}
          </Button>

          <div className="text-xs text-white/50">
            <strong>Nota:</strong> Use esta opção apenas para configurar o primeiro administrador do sistema.
            O usuário será promovido automaticamente para Presidente.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
