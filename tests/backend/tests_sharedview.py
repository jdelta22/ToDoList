import pytest
from tasks.models import TaskShare

@pytest.mark.django_db
def test_shared_view(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.post(f"/api/received-shares/{share.id}/accept/")
    share.refresh_from_db()
    assert response.status_code == 200

    shared_response = authenticated_client.get("/api/shares/")
    assert shared_response.status_code == 200
    assert shared_response.data["count"] == 1
    assert shared_response.data["results"][0]["id"] == share.id
    assert shared_response.data["results"][0]["users"][0]["username"] == other_user.username


@pytest.mark.django_db
def test_shared_task_detail(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.post(f"/api/received-shares/{share.id}/accept/")
    share.refresh_from_db()
    assert response.status_code == 200

    shared_response = authenticated_client.get(f"/api/shares/{share.id}/")
    assert shared_response.status_code == 200
    assert shared_response.data["id"] == share.id
    assert shared_response.data["users"][0]["username"] == other_user.username

@pytest.mark.django_db
def test_shared_task_detail_not_owner(authenticated_other_client, other_user, task):
    share = TaskShare.objects.create(task=task, user=other_user, can_edit=True)

    response = authenticated_other_client.get(f"/api/shares/{share.id}/")
    assert response.status_code == 404

@pytest.mark.django_db
def test_shared_task_revoke_access(authenticated_client, authenticated_other_client, other_user, task):
    invite_response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert invite_response.status_code == 200
    share = TaskShare.objects.get(task=task, user=other_user)

    response = authenticated_other_client.post(f"/api/received-shares/{share.id}/accept/")
    share.refresh_from_db()
    assert response.status_code == 200

    revoke_response = authenticated_client.delete(f"/api/tasks/{task.id}/shares/{share.id}/revoke/")
    assert revoke_response.status_code == 200