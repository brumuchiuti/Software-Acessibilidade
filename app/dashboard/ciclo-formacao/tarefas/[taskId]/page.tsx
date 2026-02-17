import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getTaskFromSupabase } from "@/lib/ciclo-formacao/data"
import { findTaskByIdFromMock } from "@/lib/ciclo-formacao/utils"
import { TaskSubmissionForm } from "@/components/task-submission-form"

interface PageProps {
  params: Promise<{ taskId: string }>
}

export default async function TaskFormPage({ params }: PageProps) {
  const { taskId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const task = (await getTaskFromSupabase(taskId)) || findTaskByIdFromMock(taskId)
  if (!task) notFound()

  const isExternalLink = task.taskType === "link" && task.contentUrl.startsWith("http")

  return (
    <div className="space-y-8 max-w-2xl">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/dashboard/ciclo-formacao">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Ciclo de Formação
        </Link>
      </Button>

      <Card className="bg-card border-primary/20 dark:bg-white/5 dark:border-[#FFD700]/20">
        <CardHeader>
          <CardTitle className="text-foreground">{task.title}</CardTitle>
          {task.description && (
            <CardDescription className="text-muted-foreground text-base mt-2 whitespace-pre-wrap">
              {task.description}
            </CardDescription>
          )}
          {isExternalLink && (
            <a
              href={task.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline mt-3 inline-block"
            >
              Acessar material de referência →
            </a>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">Submissão da tarefa</h3>
            <TaskSubmissionForm task={task} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
