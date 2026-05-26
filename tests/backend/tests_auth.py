import pytest

from django.contrib.auth.models import User

@pytest.mark.django_db
def test_create_user():
    user = User.objects.create_user(
        username="joao",
        password = "123456"
    )

    assert user.username == "joao"
    assert user.check_password("123456")