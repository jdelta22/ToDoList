import pytest


@pytest.mark.django_db
def test_make_public_task(authenticated_client, task):
    response = authenticated_client.post(f"/api/public/tasks/{task.share_code}/make-public/")

    assert response.status_code == 200
    assert response.data["is_public"] is True

@pytest.mark.django_db
def test_clone_public_task(authenticated_client, task):
    # First, make the task public
    authenticated_client.post(f"/api/public/tasks/{task.share_code}/make-public/")

    # Then, clone the public task
    response = authenticated_client.post(f"/api/public/tasks/{task.share_code}/clone/")

    assert response.status_code == 200
    assert response.data["detail"] == "Task cloned successfully"
    
@pytest.mark.django_db
def test_clone_non_public_task(authenticated_client, task):
    # Attempt to clone a non-public task
    response = authenticated_client.post(f"/api/public/tasks/{task.share_code}/clone/")

    assert response.status_code == 404
    assert response.data["detail"] == "Invalid share link"


@pytest.mark.django_db
def test_invite_private_task(authenticated_client, task, other_user):
    # Attempt to invite a user to a private task
    response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": other_user.username, "can_edit": True})

    assert response.status_code == 200
    assert response.data["detail"] == f"Invite sent to {other_user.username}"

@pytest.mark.django_db
def test_private_self_invite(authenticated_client, task):
    response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": task.owner.username, "can_edit": True})

    assert response.status_code == 400
    assert response.data["detail"] == "You cannot invite yourself"

@pytest.mark.django_db
def test_invite_nonexistent_user(authenticated_client, task):
    response = authenticated_client.post(f"/api/tasks/{task.id}/invite/", data={"username": "nonexistent", "can_edit": True})

    assert response.status_code == 404
    assert response.data["detail"] == "User not found"



