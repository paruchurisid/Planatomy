from fastapi.testclient import TestClient

from planatomy_api.main import app

client = TestClient(app)


def test_health_endpoint_reports_environment() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert "environment" in response.json()


def test_openapi_describes_database_health_route() -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    assert "/health/db" in response.json()["paths"]
