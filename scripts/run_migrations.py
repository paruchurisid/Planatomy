from pathlib import Path

from planatomy_api.db import connection


def main() -> None:
    migration_dir = Path(__file__).resolve().parents[1] / "migrations"
    migrations = sorted(migration_dir.glob("*.sql"))
    if not migrations:
        raise SystemExit("No migrations found")
    with connection() as conn:
        for migration in migrations:
            conn.execute(migration.read_text(encoding="utf-8"))
        conn.commit()
    print(f"Applied {len(migrations)} migration file(s)")


if __name__ == "__main__":
    main()
