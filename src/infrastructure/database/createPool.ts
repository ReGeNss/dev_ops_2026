import pg from "pg";
import type { DatabaseConfig } from "../config/AppConfig.js";

export function createPool(config: DatabaseConfig): pg.Pool {
  return new pg.Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });
}
