# mywebapp — Task Tracker API

Fastify-based HTTP API with a clean architecture layout (domain, application, infrastructure, presentation). PostgreSQL stores tasks. The app name is **mywebapp** per lab requirements.

## Individual assignment variant (N = 13)

| Formula | Result | Effect |
|--------|--------|--------|
| V2 = (N % 2) + 1 | 2 | Configuration file at `/etc/mywebapp/config.yaml` (or `.json`); **PostgreSQL** |
| V3 = (N % 3) + 1 | 2 | **Task Tracker** endpoints |
| V5 = (N % 5) + 1 | 4 | Listen port **8000** |

## Requirements

- Node.js 20+
- PostgreSQL 14+ (or compatible)

## Configuration

- Production path: `/etc/mywebapp/config.yaml` (YAML or JSON).
- Override: set `MYWEBAPP_CONFIG_PATH` to the absolute path of your file.
- Local development: copy `config.example.yaml` to `config.dev.yaml` in the project root (it is gitignored). If `MYWEBAPP_CONFIG_PATH` is unset and `config.dev.yaml` exists, the app loads it.

## Development setup

1. Install dependencies: `npm install`
2. Create a PostgreSQL database and user matching your config.
3. Copy `config.example.yaml` to `config.dev.yaml` and adjust credentials and `host` / `port` (default listen port is **8000**).
4. Run migrations: `npm run migrate`
5. Start in watch mode: `npm run dev`

Build and run compiled output:

```bash
npm run build
npm start
```

## API overview

### Content negotiation

- For **business** task routes (`/tasks`, …), the response uses `Accept` quality values: `application/json` vs `text/html`. If both match with equal quality, **JSON** is chosen.
- For **`GET /`**, only **HTML** is served. If the client does not accept HTML (e.g. only `application/json`), the server responds with **406 Not Acceptable**.

### Business endpoints (Task Tracker)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/tasks` | List all tasks (`id`, `title`, `status`, `created_at`) |
| POST | `/tasks` | Create a task; JSON body `{ "title": "..." }`; new tasks start as `pending` |
| POST | `/tasks/:id/done` | Mark task `id` as `done` |

JSON responses use ISO 8601 strings for `created_at`. HTML responses are minimal tables without CSS or JavaScript.

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health/alive` | Always `200` with body `OK` |
| GET | `/health/ready` | `200` with `OK` if the database is reachable; otherwise `500` with a short plain-text reason |

### Index

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | HTML table listing all **business** API routes (see above) |

## Project layout

- `src/domain` — entities and domain errors
- `src/application` — repository ports and use cases
- `src/infrastructure` — config loading, PostgreSQL pool, repository implementation, migration script entry
- `src/presentation` — Fastify server wiring and HTTP adapters
- `scripts/migrate.ts` — database migration

## License

Educational project.
