import type { FastifyPluginAsync } from "fastify";
import type { Pool } from "pg";

export type HealthRoutesOptions = {
  pool: Pool;
};

export const healthRoutes: FastifyPluginAsync<HealthRoutesOptions> = async (
  app,
  opts,
) => {
  const pool = opts.pool;

  app.get("/health/alive", async (_request, reply) => {
    reply.code(200).type("text/plain; charset=utf-8").send("OK");
  });

  app.get("/health/ready", async (_request, reply) => {
    try {
      await pool.query("SELECT 1");
      reply.code(200).type("text/plain; charset=utf-8").send("OK");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Database unavailable";
      reply.code(500).type("text/plain; charset=utf-8").send(`Not ready: ${msg}`);
    }
  });
};
