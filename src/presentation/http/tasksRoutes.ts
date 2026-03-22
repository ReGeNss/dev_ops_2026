import type { FastifyPluginAsync } from "fastify";
import type { TaskRepository } from "../../application/ports/TaskRepository.js";
import { createTask } from "../../application/use-cases/createTask.js";
import { listTasks } from "../../application/use-cases/listTasks.js";
import { markTaskDone } from "../../application/use-cases/markTaskDone.js";
import { ValidationError } from "../../application/errors.js";
import { TaskNotFoundError } from "../../domain/task.js";
import { negotiateJsonOrHtml } from "./negotiate.js";
import { serializeTask } from "./serializeTask.js";
import { singleTaskHtml, tasksTableHtml } from "./html.js";

export type TasksRoutesOptions = {
  taskRepository: TaskRepository;
};

export const tasksRoutes: FastifyPluginAsync<TasksRoutesOptions> = async (
  app,
  opts,
) => {
  const repo = opts.taskRepository;

  app.get("/tasks", async (request, reply) => {
    const tasks = await listTasks(repo);
    const mode = negotiateJsonOrHtml(request.headers.accept);
    if (mode === "html") {
      reply.type("text/html; charset=utf-8");
      return tasksTableHtml(tasks);
    }
    reply.type("application/json; charset=utf-8");
    return tasks.map(serializeTask);
  });

  app.post("/tasks", async (request, reply) => {
    const body = request.body as { title?: unknown };
    const title = typeof body?.title === "string" ? body.title : "";
    try {
      const task = await createTask(repo, title);
      const mode = negotiateJsonOrHtml(request.headers.accept);
      if (mode === "html") {
        reply.code(201).type("text/html; charset=utf-8");
        return singleTaskHtml(task);
      }
      reply.code(201).type("application/json; charset=utf-8");
      return serializeTask(task);
    } catch (err) {
      if (err instanceof ValidationError) {
        reply.code(400).send({ error: err.message });
        return;
      }
      throw err;
    }
  });

  app.post("/tasks/:id/done", async (request, reply) => {
    const id = Number((request.params as { id: string }).id);
    if (!Number.isInteger(id) || id < 1) {
      reply.code(400).send({ error: "Invalid task id" });
      return;
    }
    try {
      const task = await markTaskDone(repo, id);
      const mode = negotiateJsonOrHtml(request.headers.accept);
      if (mode === "html") {
        reply.type("text/html; charset=utf-8");
        return singleTaskHtml(task);
      }
      reply.type("application/json; charset=utf-8");
      return serializeTask(task);
    } catch (err) {
      if (err instanceof TaskNotFoundError) {
        reply.code(404).send({ error: err.message });
        return;
      }
      throw err;
    }
  });
};
