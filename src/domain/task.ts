export type TaskId = number;

export type TaskStatus = "pending" | "done";

export type Task = {
  id: TaskId;
  title: string;
  status: TaskStatus;
  created_at: Date;
};

export class TaskNotFoundError extends Error {
  constructor(public readonly taskId: TaskId) {
    super(`Task ${taskId} not found`);
    this.name = "TaskNotFoundError";
  }
}
