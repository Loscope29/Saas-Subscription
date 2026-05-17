import pytest
from rest_framework.test import APIClient
from apps.users.models import User
from apps.subscriptions.models import Subscription

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.fixture
def test_user(db):
    return User.objects.create_user(
        email="test@example.com",
        username="testuser",
        password="password123",
        first_name="Test",
        last_name="User"
    )
