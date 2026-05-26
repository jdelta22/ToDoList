import pytest

from django.contrib.auth.models import User
from rest_framework.test import APIClient

from tasks.models import Task, Category, TaskShare


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return User.objects.create_user(
        username="joao",
        password="123456"
    )


@pytest.fixture
def other_user():
    return User.objects.create_user(
        username="maria",
        password="123456"
    )


@pytest.fixture
def authenticated_client(api_client, user):

    api_client.force_authenticate(user=user)

    return api_client


@pytest.fixture
def category(user):

    return Category.objects.create(
        owner=user,
        name="Trabalho",
        color="#3B82F6"
    )


@pytest.fixture
def task(user):

    return Task.objects.create(
        owner=user,
        title="Minha tarefa",
        description="Descrição teste"
    )


@pytest.fixture
def shared_task(task, other_user):

    return TaskShare.objects.create(
        task=task,
        user=other_user,
        can_edit=True,
        accepted=True
    )