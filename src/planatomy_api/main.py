from uuid import UUID

from fastapi import FastAPI, HTTPException

from .config import settings
from .db import connection, database_check

app = FastAPI(title=settings.app_name, version="0.1.0")


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}


@app.get("/health/db", tags=["system"])
def database_health() -> dict[str, object]:
    try:
        details = database_check()
    except Exception as exc:  # pragma: no cover - exercised against a stopped database
        raise HTTPException(status_code=503, detail="database unavailable") from exc
    return {"status": "ok", **details}


@app.get("/aircraft", tags=["catalog"])
def aircraft_catalog() -> dict[str, object]:
    """Return published aircraft references available to the public explorer."""
    try:
        with connection() as conn:
            rows = conn.execute(
                """
                SELECT
                    cr.id,
                    af.name AS family,
                    av.designation AS variant,
                    cr.revision,
                    cr.status,
                    cr.attributes,
                    cr.unknown_attributes,
                    cr.as_of_date
                FROM configuration_revisions cr
                JOIN aircraft_variants av ON av.id = cr.variant_id
                JOIN aircraft_families af ON af.id = av.family_id
                WHERE cr.status = 'published'
                ORDER BY af.name, av.designation, cr.revision DESC
                """
            ).fetchall()
    except Exception as exc:  # pragma: no cover - exercised against a stopped database
        raise HTTPException(status_code=503, detail="database unavailable") from exc
    return {"items": [dict(row) for row in rows]}


@app.get("/aircraft/{configuration_id}/components", tags=["catalog"])
def component_tree(configuration_id: UUID) -> dict[str, object]:
    """Return the published component occurrences for one configuration."""
    try:
        with connection() as conn:
            rows = conn.execute(
                """
                SELECT
                    co.id,
                    co.parent_occurrence_id,
                    co.position_label,
                    co.quantity,
                    co.quantity_status,
                    co.fidelity,
                    cc.canonical_name,
                    cc.description
                FROM component_occurrences co
                JOIN component_concepts cc ON cc.id = co.concept_id
                JOIN configuration_revisions cr ON cr.id = co.configuration_revision_id
                WHERE co.configuration_revision_id = %s
                  AND cr.status = 'published'
                ORDER BY co.parent_occurrence_id NULLS FIRST, cc.canonical_name
                """,
                (configuration_id,),
            ).fetchall()
    except Exception as exc:  # pragma: no cover - exercised against a stopped database
        raise HTTPException(status_code=503, detail="database unavailable") from exc
    return {"configuration_id": str(configuration_id), "items": [dict(row) for row in rows]}
