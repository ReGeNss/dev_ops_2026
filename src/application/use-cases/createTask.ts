import type { TaskRepository } from "../ports/TaskRepository.js";
import type { Task } from "../../domain/task.js";
import { ValidationError } from "../errors.js";

export async function createTask(
  repository: TaskRepository,
  title: string,
): Promise<Task> {
  const trimmed = title.trim();
  if (!trimmed) {
    throw new ValidationError("title is required");
  }
  return repository.create(trimmed);
}
