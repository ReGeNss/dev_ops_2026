import type { TaskRepository } from "../ports/TaskRepository.js";
import type { Task } from "../../domain/task.js";
import { TaskNotFoundError } from "../../domain/task.js";

export async function markTaskDone(
  repository: TaskRepository,
  id: number,
): Promise<Task> {
  const updated = await repository.updateStatus(id, "done");
  if (!updated) {
    throw new TaskNotFoundError(id);
  }
  return updated;
}
