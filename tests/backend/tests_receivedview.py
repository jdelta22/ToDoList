import pytest
from tasks.models import TaskShare



@pytest.mark.django_db
def test_accept_share(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.post(f"/api/received-shares/{share.id}/accept/")
    share.refresh_from_db()
    assert response.status_code == 200
    assert share.accepted is True

@pytest.mark.django_db
def test_decline_share(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.post(f"/api/received-shares/{share.id}/decline/")
    share.refresh_from_db()
    assert response.status_code == 200
    assert share.accepted is False


@pytest.mark.django_db
def test_list_received_shares(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.get("/api/received-shares/")
    assert response.status_code == 200
    assert response.data["count"] == 1
    assert len(response.data["results"]) == 1
    result = response.data["results"][0]
    assert result["id"] == share.id
    assert result["user"] == other_user.username
    assert result["can_edit"] is True

@pytest.mark.django_db
def test_received_task_detail(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.get(f"/api/received-shares/{share.id}/")
    assert response.status_code == 200
    assert response.data["id"] == share.id
    assert response.data["user"] == other_user.username
    assert response.data["can_edit"] is True

@pytest.mark.django_db
def test_toggle_complete_received_share(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    # Accept the share first
    authenticated_other_client.post(f"/api/received-shares/{share.id}/accept/")

    response = authenticated_other_client.patch(f"/api/received-shares/{share.id}/toggle-complete/")
    share.refresh_from_db()
    assert response.status_code == 200
    assert share.completed is True

@pytest.mark.django_db
def test_edit_accepted_received_share(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    # Accept the share first
    authenticated_other_client.post(f"/api/received-shares/{share.id}/accept/")

    response = authenticated_other_client.patch(f"/api/tasks/{task.id}/", data={"title": "Updated Title"})
    task.refresh_from_db()
    assert response.status_code == 200
    assert task.title == "Updated Title"





