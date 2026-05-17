import pytest
from django.urls import reverse
from rest_framework import status
from apps.users.models import User

@pytest.mark.django_db
class TestAuthentication:
    def test_user_registration(self, api_client):
        url = reverse('register')
        data = {
            'email': 'newuser@example.com',
            'username': 'newuser',
            'password': 'StrongPassword123!',
            'password2': 'StrongPassword123!',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED, response.data
        assert User.objects.filter(email='newuser@example.com').exists()
        
        # Verify HttpOnly cookie is set
        assert 'access_token' in response.cookies
        assert response.cookies['access_token']['httponly'] is True

    def test_user_login(self, api_client, test_user):
        url = reverse('token_obtain_pair')
        data = {
            'email': test_user.email,
            'password': 'password123'
        }
        
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK, response.data
        
        # Verify HttpOnly cookie is set
        assert 'access_token' in response.cookies
        assert response.cookies['access_token']['httponly'] is True
        
        # Verify token is not in the response body
        assert 'access' not in response.data

    def test_user_logout(self, authenticated_client):
        url = reverse('logout')
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_200_OK
        
        # Verify cookie is deleted/expired
        assert 'access_token' in response.cookies
        assert response.cookies['access_token']['max-age'] == 0 or response.cookies['access_token'].value == ''
