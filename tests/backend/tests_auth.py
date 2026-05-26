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

@pytest.mark.django_db
def test_user_authentication(api_client, user):

    response = api_client.post('/api/token/', {
        'username': 'joao',
        'password': '123456'
    })

    assert response.status_code == 200
    assert 'access' in response.data

@pytest.mark.django_db
def test_user_authentication_invalid_credentials(api_client):

    response = api_client.post('/api/token/', {
        'username': 'invalid_user',
        'password': 'invalid_password'
    })

    assert response.status_code == 401
    assert 'access' not in response.data