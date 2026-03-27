sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  CREATE ROLE mywebapp LOGIN PASSWORD 'changeme';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;
SELECT 'CREATE DATABASE mywebapp OWNER mywebapp'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'mywebapp')\gexec
SQL
