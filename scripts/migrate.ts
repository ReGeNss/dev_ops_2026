import { loadConfig } from "../src/infrastructure/config/loadConfig.js";
import { createPool } from "../src/infrastructure/database/createPool.js";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status VARCHAR(32) NOT NULL CHECK (status IN ('pending', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);
`;

async function migrate(): Promise<void> {
  const config = loadConfig();
  const pool = createPool(config.database);
  try {
    await pool.query(MIGRATION_SQL);
    console.log("Migration completed successfully.");
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
