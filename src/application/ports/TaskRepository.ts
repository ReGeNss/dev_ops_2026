import type { Task, TaskStatus } from "../../domain/task.js";

export interface TaskRepository {
  findAll(): Promise<Task[]>;
  create(title: string): Promise<Task>;
  updateStatus(id: number, status: TaskStatus): Promise<Task | null>;
}
