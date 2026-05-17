import pytest
from django.urls import reverse
from rest_framework import status
from apps.subscriptions.models import Subscription
from apps.subscriptions.factories import SubscriptionFactory

@pytest.mark.django_db
class TestSubscriptionAPI:
    def test_list_subscriptions(self, authenticated_client, test_user):
        SubscriptionFactory.create_batch(3, user=test_user)
        # Create a subscription for another user to ensure we only get our own
        SubscriptionFactory()
        
        url = reverse('subscription-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 3

    def test_create_subscription(self, authenticated_client, test_user):
        url = reverse('subscription-list')
        data = {
            'service_name': 'Netflix',
            'email_sender': 'billing@netflix.com',
            'monthly_cost': '13.99',
            'billing_frequency': 'monthly',
            'category': 'streaming',
            'first_detected_date': '2026-01-01',
            'next_billing_date': '2026-06-15'
        }
        
        response = authenticated_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED, response.data
        assert Subscription.objects.filter(user=test_user, service_name='Netflix').exists()

    def test_update_subscription(self, authenticated_client, test_user):
        subscription = SubscriptionFactory(user=test_user, status='active')
        url = reverse('subscription-detail', kwargs={'pk': subscription.pk})
        data = {'status': 'cancelled'}
        
        response = authenticated_client.patch(url, data, format='json')
        assert response.status_code == status.HTTP_200_OK, response.data
        subscription.refresh_from_db()
        assert subscription.status == 'cancelled'

    def test_delete_subscription(self, authenticated_client, test_user):
        subscription = SubscriptionFactory(user=test_user)
        url = reverse('subscription-detail', kwargs={'pk': subscription.pk})
        
        response = authenticated_client.delete(url)
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Subscription.objects.filter(pk=subscription.pk).exists()

    def test_unauthenticated_access(self, api_client):
        url = reverse('subscription-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
class TestEmailScanner:
    def test_scan_emails_not_connected(self, authenticated_client, test_user):
        test_user.is_gmail_connected = False
        test_user.save()
        url = reverse('scan_emails')
        
        response = authenticated_client.post(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'Gmail n\'est pas connecté' in response.data['error']

    from unittest.mock import patch
    @patch('apps.subscriptions.views.GmailScanner')
    def test_scan_emails_success(self, MockScanner, authenticated_client, test_user):
        test_user.is_gmail_connected = True
        test_user.save()
        
        # Configure mock
        mock_instance = MockScanner.return_value
        mock_instance.scan_emails.return_value = {
            'success': True,
            'emails_scanned': 50,
            'subscriptions_found': 2
        }
        
        url = reverse('scan_emails')
        response = authenticated_client.post(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['emails_scanned'] == 50
        assert response.data['subscriptions_found'] == 2
