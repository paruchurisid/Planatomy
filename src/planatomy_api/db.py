from collections.abc import Generator

import psycopg
from psycopg.rows import dict_row

from .config import settings


def connection() -> psycopg.Connection:
    """Open one short-lived connection using the configured Postgres URL."""
    return psycopg.connect(settings.database_url, row_factory=dict_row)


def database_check() -> dict[str, object]:
    with connection() as conn:
        row = conn.execute("SELECT current_database() AS database, now() AS server_time").fetchone()
    return {"database": row["database"], "server_time": row["server_time"].isoformat()}


def get_connection() -> Generator[psycopg.Connection, None, None]:
    with connection() as conn:
        yield conn
