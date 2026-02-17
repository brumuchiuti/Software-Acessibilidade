import { MOCK_DEVELOPMENT_LEVELS } from "./mock-data"
import type { TrainingTask } from "./types"

export function findTaskByIdFromMock(taskId: string): TrainingTask | null {
  for (const level of MOCK_DEVELOPMENT_LEVELS) {
    const task = level.tasks.find((t) => t.id === taskId)
    if (task) return task
  }
  return null
}
