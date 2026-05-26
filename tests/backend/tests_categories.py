import pytest

@pytest.mark.django_db
def test_create_category(authenticated_client):
    response = authenticated_client.post(
        "/api/categories/",
        {
            "name": "Categoria de Teste"
        },
        format="json"
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Categoria de Teste"

@pytest.mark.django_db
def test_list_categories(authenticated_client, category):
    response = authenticated_client.get("/api/categories/")

    assert response.status_code == 200
    assert len(response.json()) > 0

@pytest.mark.django_db
def test_retrieve_category(authenticated_client, category):
    response = authenticated_client.get(f"/api/categories/{category.id}/")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == category.id
    assert data["name"] == category.name

@pytest.mark.django_db
def test_update_category(authenticated_client, category):
    response = authenticated_client.patch(
        f"/api/categories/{category.id}/",
        {
            "name": "Categoria Atualizada"
        },
        format="json"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == category.id
    assert data["name"] == "Categoria Atualizada"

@pytest.mark.django_db
def test_delete_category(authenticated_client, category):
    response = authenticated_client.delete(f"/api/categories/{category.id}/")

    assert response.status_code == 204
