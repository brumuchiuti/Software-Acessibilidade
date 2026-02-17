"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Level {
  id: string
  name: string
  slug: string
}

interface CreateTrainingTaskFormProps {
  levels: Level[]
  preselectedLevelId?: string | null
}

export default function CreateTrainingTaskForm({ levels, preselectedLevelId }: CreateTrainingTaskFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    level_id: preselectedLevelId || levels[0]?.id || "",
    title: "",
    description: "",
    task_type: "link" as "link" | "file" | "image",
    content_url: "",
    order_index: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()

      const { error } = await supabase.from("training_cycle_tasks").insert({
        level_id: formData.level_id,
        title: formData.title,
        description: formData.description || null,
        task_type: formData.task_type,
        content_url: formData.content_url,
        order_index: formData.order_index,
      })

      if (error) throw error

      router.push("/dashboard/admin/ciclo-formacao")
      router.refresh()
    } catch (error) {
      console.error("Error creating task:", error)
      alert("Erro ao criar tarefa. Verifique se as tabelas do Ciclo de Formação existem no Supabase.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="level_id">Nível de desenvolvimento *</Label>
        <Select
          value={formData.level_id}
          onValueChange={(v) => setFormData({ ...formData, level_id: v })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o nível" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título da tarefa *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: Assistir ao vídeo de boas-vindas"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Instruções para o membro..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="task_type">Tipo da tarefa *</Label>
        <Select
          value={formData.task_type}
          onValueChange={(v: "link" | "file" | "image") => setFormData({ ...formData, task_type: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="link">Link</SelectItem>
            <SelectItem value="file">Arquivo</SelectItem>
            <SelectItem value="image">Imagem</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">O membro enviará um link, arquivo ou imagem na submissão</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_url">URL do material de referência *</Label>
        <Input
          id="content_url"
          value={formData.content_url}
          onChange={(e) => setFormData({ ...formData, content_url: e.target.value })}
          placeholder="https://... ou /documents/arquivo.pdf"
        />
        <p className="text-xs text-muted-foreground">
          Link externo ou caminho para o material que o membro deve acessar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="order_index">Ordem de exibição</Label>
        <Input
          id="order_index"
          type="number"
          min="0"
          value={formData.order_index}
          onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? "Criando..." : "Criar tarefa"}
        </Button>
      </div>
    </form>
  )
}
