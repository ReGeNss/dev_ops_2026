import type { TaskRepository } from "../ports/TaskRepository.js";
import type { Task } from "../../domain/task.js";

export async function listTasks(repository: TaskRepository): Promise<Task[]> {
  return repository.findAll();
}
