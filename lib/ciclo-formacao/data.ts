import { createClient } from "@/lib/supabase/server"
import { MOCK_DEVELOPMENT_LEVELS } from "./mock-data"
import type { DevelopmentLevel, TrainingTask } from "./types"

function mapDbLevelToLevel(dbLevel: any): DevelopmentLevel {
  const tasks: TrainingTask[] = (dbLevel.training_cycle_tasks || [])
    .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      taskType: t.task_type,
      contentUrl: t.content_url,
      orderIndex: t.order_index ?? 0,
    }))
  return {
    id: dbLevel.id,
    slug: dbLevel.slug,
    name: dbLevel.name,
    description: dbLevel.description,
    orderIndex: dbLevel.order_index ?? 0,
    tasks,
  }
}

export async function getLevelsFromSupabase(): Promise<DevelopmentLevel[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("training_cycle_levels")
    .select(
      `
      *,
      training_cycle_tasks (*)
    `
    )
    .order("order_index", { ascending: true })

  if (error || !data?.length) return null
  return data.map(mapDbLevelToLevel)
}

export async function getTaskFromSupabase(taskId: string): Promise<TrainingTask | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("training_cycle_tasks")
    .select("*")
    .eq("id", taskId)
    .single()

  if (error || !data) return null
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    taskType: data.task_type,
    contentUrl: data.content_url,
    orderIndex: data.order_index ?? 0,
  }
}

export function getLevelsWithMockFallback(levels: DevelopmentLevel[] | null): DevelopmentLevel[] {
  return levels && levels.length > 0 ? levels : MOCK_DEVELOPMENT_LEVELS
}
