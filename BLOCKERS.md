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

## 2026-09-14 — Sketchfab A320 reference asset

- **Status:** Superseded on 2026-10-10 — the user requested original artwork, now implemented
- **Reference:** [Airbus A320-200 by Airbus5717](https://sketchfab.com/3d-models/airbus-a320-200-7b8910d3cf824e6399c4ca75a31130ed)
- **Finding:** The indexed listing identifies the model as **CC Attribution-NonCommercial (CC BY-NC)**. The page also returns HTTP 403 from this environment, so no mesh file was obtained.
- **Impact:** Planatomy evaluates component pricing and may become a commercial product. Copying or redistributing this model requires honoring the non-commercial restriction, attribution, and any creator-specific terms.
- **Resolution:** Created the aircraft mesh, Delta-inspired livery, canvas textures, and 27 movable assemblies directly in Three.js. No Sketchfab download is required. The unsegmented GLB overlay hook was removed; a future imported asset needs explicit assembly mapping. See `ORIGINAL-A320-MODEL.md`.

## 2026-10-10 — Local tool sandbox startup

- **Status:** Worked around for this task
- **Finding:** Shell, Node REPL, and in-app browser automation reported `setup refresh had errors` before starting.
- **Resolution:** Approved shell execution outside the failing sandbox supported file reads, builds, and a headless local Chrome verification using the installed Playwright package. No dependencies, paid assets, or hosted services were purchased.

## 2026-10-10 — Exact aircraft part geometry and pricing

- **Status:** Open, non-blocking for the original interactive illustration
- **Scope:** The model is an original A320-200 visual study, with representative interiors and systems. Exact serialized-aircraft configuration, manufacturer part numbers, service detail, and verified part prices are not available from the visual geometry alone.
- **Next action:** Curate configuration-specific part identities and source-backed price evidence before presenting engineering accuracy or component valuations.
- **Progress:** Added 79 independently selectable original subsystem illustrations, plus isolation and child-part separation. This resolves visual-detail coverage for the current study; verified part identities and valuations remain open.
