CONFIG="/etc/mywebapp/config.yaml"

DB_USER=$(yq '.database.user' "$CONFIG")
DB_PASS=$(yq '.database.password' "$CONFIG")
DB_NAME=$(yq '.database.database' "$CONFIG")

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
\$\$;
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec
SQL
