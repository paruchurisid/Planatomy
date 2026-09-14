# Planatomy setup blockers

## 2026-09-14 — Neon CLI initialization

- **Status:** Resolved
- **Command attempted:** `npx neon@latest init <provided connection string>`
- **Result:** Neon CLI 4.17.3 returned `ERROR: Unknown command: <connection string>`.
- **Cause:** `neon init` does not accept a PostgreSQL connection string as a positional argument. It is a Neon project/bootstrap command.
- **Impact:** The original URL-based syntax was invalid, but the Neon project was already linked.
- **Resolution:** Ran `npx neon@latest init --skip-template --no-config --yes --agent codex`. Neon CLI authenticated successfully, confirmed the existing Planatomy project link, and installed the project-scoped Neon plugin. No database credential was written to the repository.

## 2026-09-14 — Neon database connection

- **Status:** Resolved
- **Action:** Used the provided connection string transiently as `DATABASE_URL` and ran `python scripts/run_migrations.py`.
- **Result:** Migration applied successfully to the Neon database. The API verified `/health/db`, `/aircraft`, and `/aircraft/{configuration_id}/components` against Neon.
- **Credential handling:** The connection string was not written to `.env`, source files, migrations, logs, or the repository. Keep using environment or secret storage for it. Because this credential was pasted into a chat, rotate the database password before production use.

## 2026-09-14 — Local Docker engine

- **Status:** Open, non-blocking
- **Result:** Docker CLI is installed, but Docker Desktop's Linux engine was not running when `docker compose up -d postgres` was attempted.
- **Impact:** Local Postgres was not exercised in this environment. Neon is currently the verified database target.
- **Next action:** Start Docker Desktop, then run `docker compose up -d postgres` and `python scripts/run_migrations.py` to verify the local path.

## 2026-09-14 — Neon project setup retry

- **Status:** Resolved
- **Action:** Ran the supported command `npx neon@latest init --skip-template --no-config --yes --agent codex`.
- **Result:** Neon confirmed the existing Planatomy project and production branch, installed the project-scoped Neon plugin, and generated local branch/config files. Running `python scripts/run_migrations.py` with the generated ignored environment succeeded again.
- **Note:** The generated `neon.ts` declares preview Functions, Object Storage, and AI Gateway configuration. No deployment or paid/beta service activation was performed.
