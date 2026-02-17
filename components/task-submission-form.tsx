"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Link2, FileText, Image as ImageIcon } from "lucide-react"
import type { TrainingTask, TaskType } from "@/lib/ciclo-formacao/types"

function TaskTypeLabel({ type }: { type: TaskType }) {
  switch (type) {
    case "link":
      return (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link2 className="h-4 w-4" /> Envie o link
        </span>
      )
    case "file":
      return (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" /> Envie o arquivo
        </span>
      )
    case "image":
      return (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="h-4 w-4" /> Envie a imagem
        </span>
      )
  }
}

interface TaskSubmissionFormProps {
  task: TrainingTask
}

export function TaskSubmissionForm({ task }: TaskSubmissionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    link: "",
    notes: "",
    file: null as File | null,
    image: null as File | null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Integrate with Supabase member_training_progress when ready
      await new Promise((r) => setTimeout(r, 800))
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting task:", error)
      alert("Erro ao enviar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
        <p className="font-medium text-foreground">Submissão enviada com sucesso!</p>
        <p className="text-sm text-muted-foreground mt-1">Aguardando revisão.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/dashboard/ciclo-formacao")}
        >
          Voltar ao Ciclo de Formação
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {task.taskType === "link" && (
        <div className="space-y-2">
          <Label htmlFor="link">
            <TaskTypeLabel type="link" />
          </Label>
          <Input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            placeholder="https://..."
            required
          />
        </div>
      )}

      {(task.taskType === "file" || task.taskType === "image") && (
        <div className="space-y-2">
          <Label>
            <TaskTypeLabel type={task.taskType} />
          </Label>
          <Input
            type="file"
            accept={task.taskType === "image" ? "image/*" : "*"}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (task.taskType === "image") {
                setFormData({ ...formData, image: file || null })
              } else {
                setFormData({ ...formData, file: file || null })
              }
            }}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Comentários adicionais sobre sua submissão..."
          className="min-h-[100px]"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? "Enviando..." : "Enviar submissão"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/ciclo-formacao")}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
