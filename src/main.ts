import Fastify from "fastify";
import { loadConfig } from "./infrastructure/config/loadConfig.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const app = Fastify({ logger: true });

  await app.listen({ host: config.host, port: config.port });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
