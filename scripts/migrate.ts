import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadConfig } from "../src/infrastructure/config/loadConfig.js";
import { createPool } from "../src/infrastructure/database/createPool.js";

const MIGRATIONS_DIR = resolve(import.meta.dirname ?? ".", "../migrations");

const TRACKING_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
`;

interface MigrationFile {
  order: number;
  name: string;
  path: string;
}

async function loadMigrations(): Promise<MigrationFile[]> {
  const files = await readdir(MIGRATIONS_DIR);
  const sqlFiles = files.filter((f) => f.endsWith(".sql"));

  const migrations: MigrationFile[] = sqlFiles.map((f) => {
    const match = f.match(/^(\d+)/);
    if (!match) {
      throw new Error(`Migration file "${f}" does not start with a number`);
    }
    return { order: Number(match[1]), name: f, path: join(MIGRATIONS_DIR, f) };
  });

  migrations.sort((a, b) => a.order - b.order);
  return migrations;
}

async function migrate(): Promise<void> {
  const config = loadConfig();
  const pool = createPool(config.database);

  try {
    await pool.query(TRACKING_TABLE_SQL);

    const { rows: applied } = await pool.query<{ name: string }>(
      "SELECT name FROM schema_migrations ORDER BY id",
    );
    const appliedSet = new Set(applied.map((r) => r.name));

    const allMigrations = await loadMigrations();
    const migrations = allMigrations.filter((m) => !appliedSet.has(m.name));

    if (migrations.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const migration of migrations) {
      const sql = await readFile(migration.path, "utf-8");
      console.log(`Applying migration: ${migration.name}`);
      await pool.query("BEGIN");
      try {
        await pool.query(sql);
        await pool.query(
          "INSERT INTO schema_migrations (name) VALUES ($1)",
          [migration.name],
        );
        await pool.query("COMMIT");
        console.log(`  ✓ ${migration.name}`);
      } catch (err) {
        await pool.query("ROLLBACK");
        throw new Error(
          `Migration "${migration.name}" failed: ${err instanceof Error ? err.message : err}`,
        );
      }
    }

    console.log(`Applied ${migrations.length} migration(s).`);
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
