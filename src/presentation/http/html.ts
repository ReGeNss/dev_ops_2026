import type { Task } from "../../domain/task.js";

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(d: Date): string {
  return d.toISOString();
}

export function tasksTableHtml(tasks: Task[]): string {
  const rows = tasks
    .map(
      (t) =>
        `<tr><td>${t.id}</td><td>${escapeHtml(t.title)}</td><td>${escapeHtml(t.status)}</td><td>${escapeHtml(formatDate(t.created_at))}</td></tr>`,
    )
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Tasks</title></head><body><table border="1"><thead><tr><th>id</th><th>title</th><th>status</th><th>created_at</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

export function singleTaskHtml(task: Task): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Task ${task.id}</title></head><body><table border="1"><tr><th>id</th><td>${task.id}</td></tr><tr><th>title</th><td>${escapeHtml(task.title)}</td></tr><tr><th>status</th><td>${escapeHtml(task.status)}</td></tr><tr><th>created_at</th><td>${escapeHtml(formatDate(task.created_at))}</td></tr></table></body></html>`;
}
