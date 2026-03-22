import fs from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import type { AppConfig } from "./AppConfig.js";

const DEFAULT_ETC_PATH = "/etc/mywebapp/config.yaml";

function readConfigFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

function parseConfig(content: string, filePath: string): AppConfig {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".yaml" || ext === ".yml") {
    const data = parseYaml(content) as unknown;
    return validateConfig(data, filePath);
  }
  if (ext === ".json") {
    const data = JSON.parse(content) as unknown;
    return validateConfig(data, filePath);
  }
  throw new Error(
    `Unsupported config extension for ${filePath}; use .yaml, .yml, or .json`,
  );
}

function validateConfig(data: unknown, source: string): AppConfig {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid config in ${source}: expected an object`);
  }
  const o = data as Record<string, unknown>;
  const host = o.host;
  const port = o.port;
  const db = o.database;
  if (typeof host !== "string" || host.length === 0) {
    throw new Error(`Invalid config in ${source}: host must be a non-empty string`);
  }
  if (typeof port !== "number" || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid config in ${source}: port must be an integer 1-65535`);
  }
  if (!db || typeof db !== "object") {
    throw new Error(`Invalid config in ${source}: database must be an object`);
  }
  const d = db as Record<string, unknown>;
  const dh = d.host;
  const dp = d.port;
  const du = d.user;
  const dpw = d.password;
  const dname = d.database;
  if (typeof dh !== "string" || dh.length === 0) {
    throw new Error(`Invalid config in ${source}: database.host must be a non-empty string`);
  }
  if (typeof dp !== "number" || !Number.isInteger(dp) || dp < 1 || dp > 65535) {
    throw new Error(`Invalid config in ${source}: database.port must be an integer 1-65535`);
  }
  if (typeof du !== "string" || du.length === 0) {
    throw new Error(`Invalid config in ${source}: database.user must be a non-empty string`);
  }
  if (typeof dpw !== "string") {
    throw new Error(`Invalid config in ${source}: database.password must be a string`);
  }
  if (typeof dname !== "string" || dname.length === 0) {
    throw new Error(`Invalid config in ${source}: database.database must be a non-empty string`);
  }
  return {
    host,
    port,
    database: {
      host: dh,
      port: dp,
      user: du,
      password: dpw,
      database: dname,
    },
  };
}

/**
 * Resolves config path: MYWEBAPP_CONFIG_PATH, then ./config.dev.yaml if it exists, else /etc/mywebapp/config.yaml
 */
export function resolveConfigPath(): string {
  const fromEnv = process.env.MYWEBAPP_CONFIG_PATH;
  if (fromEnv && fromEnv.length > 0) {
    return path.resolve(fromEnv);
  }
  const devLocal = path.resolve(process.cwd(), "config.dev.yaml");
  if (fs.existsSync(devLocal)) {
    return devLocal;
  }
  return DEFAULT_ETC_PATH;
}

export function loadConfig(configPath?: string): AppConfig {
  const resolved = configPath ?? resolveConfigPath();
  if (!fs.existsSync(resolved)) {
    throw new Error(
      `Config file not found: ${resolved}. Set MYWEBAPP_CONFIG_PATH or create config.dev.yaml.`,
    );
  }
  const content = readConfigFile(resolved);
  return parseConfig(content, resolved);
}
