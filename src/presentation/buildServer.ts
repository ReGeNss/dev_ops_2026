import Fastify, { type FastifyInstance } from "fastify";
import type { TaskRepository } from "../application/ports/TaskRepository.js";
import { tasksRoutes } from "./http/tasksRoutes.js";

export async function buildServer(
  taskRepository: TaskRepository,
): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });
  await app.register(tasksRoutes, { taskRepository });
  return app;
}
