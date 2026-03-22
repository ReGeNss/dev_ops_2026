import Fastify, { type FastifyInstance } from "fastify";
import type { Pool } from "pg";
import type { TaskRepository } from "../application/ports/TaskRepository.js";
import { healthRoutes } from "./http/healthRoutes.js";
import { rootRoutes } from "./http/rootRoutes.js";
import { tasksRoutes } from "./http/tasksRoutes.js";

export type BuildServerOptions = {
  taskRepository: TaskRepository;
  pool: Pool;
};

export async function buildServer(options: BuildServerOptions): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });
  await app.register(healthRoutes, { pool: options.pool });
  await app.register(rootRoutes);
  await app.register(tasksRoutes, { taskRepository: options.taskRepository });
  return app;
}
