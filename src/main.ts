import { loadConfig } from "./infrastructure/config/loadConfig.js";
import { createPool } from "./infrastructure/database/createPool.js";
import { PostgresTaskRepository } from "./infrastructure/repositories/PostgresTaskRepository.js";
import { buildServer } from "./presentation/buildServer.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const pool = createPool(config.database);
  const taskRepository = new PostgresTaskRepository(pool);
  const app = await buildServer({ taskRepository, pool });

  if (process.env.LISTEN_FDS) {
    await app.ready();
    app.server.listen({ fd: 3 });
  } else {
    await app.listen({ host: config.host, port: config.port });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
