export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export type AppConfig = {
  host: string;
  port: number;
  database: DatabaseConfig;
};
