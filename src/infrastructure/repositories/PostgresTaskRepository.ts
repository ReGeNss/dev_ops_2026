import type { Pool } from "pg";
import type { TaskRepository } from "../../application/ports/TaskRepository.js";
import type { Task, TaskStatus } from "../../domain/task.js";

type TaskRow = {
  id: number;
  title: string;
  status: string;
  created_at: Date;
};

function rowToTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status as TaskStatus,
    created_at: new Date(row.created_at),
  };
}

export class PostgresTaskRepository implements TaskRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Task[]> {
    const res = await this.pool.query<TaskRow>(
      `SELECT id, title, status, created_at FROM tasks ORDER BY id ASC`,
    );
    return res.rows.map(rowToTask);
  }

  async create(title: string): Promise<Task> {
    const res = await this.pool.query<TaskRow>(
      `INSERT INTO tasks (title, status) VALUES ($1, 'pending')
       RETURNING id, title, status, created_at`,
      [title],
    );
    const row = res.rows[0];
    if (!row) {
      throw new Error("Failed to create task");
    }
    return rowToTask(row);
  }

  async updateStatus(id: number, status: TaskStatus): Promise<Task | null> {
    const res = await this.pool.query<TaskRow>(
      `UPDATE tasks SET status = $2 WHERE id = $1
       RETURNING id, title, status, created_at`,
      [id, status],
    );
    const row = res.rows[0];
    return row ? rowToTask(row) : null;
  }
}
