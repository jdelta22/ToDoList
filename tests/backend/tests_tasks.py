import pytest

@pytest.mark.django_db
def test_create_task(
    authenticated_client,
    category,
):

    response = authenticated_client.post(
        "/api/tasks/",
        {
            "title": "Nova tarefa",
            "description": "Teste",
            "category_ids": [category.id]
        },
        format="json"
    )

    assert response.status_code == 201

    data = response.json()

    assert data["title"] == "Nova tarefa"
    assert data["description"] == "Teste"
    assert len(data["categories"]) == 1
    assert data["categories"][0]["id"] == category.id

@pytest.mark.django_db
def test_list_tasks(
    authenticated_client
):

    response = authenticated_client.get("/api/tasks/")

    assert response.status_code == 200

@pytest.mark.django_db
def test_retrieve_task(
    authenticated_client,
    task
):

    response = authenticated_client.get(f"/api/tasks/{task.id}/")

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == task.id
    assert data["title"] == task.title
    assert data["description"] == task.description

@pytest.mark.django_db
def test_update_task(
    authenticated_client,
    task
):

    response = authenticated_client.patch(
        f"/api/tasks/{task.id}/",
        {
            "title": "Tarefa atualizada",
            "description": "Descrição atualizada"
        },
        format="json"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == task.id
    assert data["title"] == "Tarefa atualizada"
    assert data["description"] == "Descrição atualizada"

@pytest.mark.django_db
def test_delete_task(
    authenticated_client,
    task
):

    response = authenticated_client.delete(f"/api/tasks/{task.id}/")

    assert response.status_code == 204

    assert not Task.objects.filter(id=task.id).exists()