/**
 * Ciclo de Formação - Types & Supabase-ready schema
 * 
 * Supabase tables to create (when integrating):
 * 
 * 1. training_cycle_levels
 *    - id (uuid, pk)
 *    - name (text) - e.g. "Qualify", "Associado I"
 *    - slug (text, unique) - e.g. "qualify", "associado_i"
 *    - description (text, nullable)
 *    - order_index (int) - for display order
 *    - created_at, updated_at
 * 
 * 2. training_cycle_tasks
 *    - id (uuid, pk)
 *    - level_id (uuid, fk -> training_cycle_levels)
 *    - title (text)
 *    - description (text, nullable)
 *    - task_type (text) - 'link' | 'file' | 'image'
 *    - content_url (text) - URL for link, file path or image URL
 *    - order_index (int)
 *    - created_at, updated_at
 * 
 * 3. member_training_progress
 *    - id (uuid, pk)
 *    - member_id (uuid, fk -> profiles)
 *    - task_id (uuid, fk -> training_cycle_tasks)
 *    - completed_at (timestamptz)
 *    - submitted_content (text, nullable) - for file/image submissions
 *    - created_at, updated_at
 *    - unique(member_id, task_id)
 */

export type TaskType = "link" | "file" | "image"

export interface TrainingTask {
  id: string
  title: string
  description: string | null
  taskType: TaskType
  contentUrl: string
  orderIndex: number
}

export interface DevelopmentLevel {
  id: string
  slug: string
  name: string
  description: string | null
  orderIndex: number
  tasks: TrainingTask[]
}

export interface MemberTaskProgress {
  taskId: string
  completedAt: string | null
  submittedContent: string | null
}
