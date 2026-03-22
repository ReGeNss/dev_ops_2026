import type { Task } from "../../domain/task.js";

export function serializeTask(task: Task): {
  id: number;
  title: string;
  status: string;
  created_at: string;
} {
  return {
    id: task.id,
    title: task.title,
    status: task.status,
    created_at: task.created_at.toISOString(),
  };
}
