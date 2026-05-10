from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from decimal import Decimal

from .models import Subscription, EmailScanLog
from .serializers import (
    SubscriptionSerializer,
    SubscriptionListSerializer,
    SubscriptionUpdateSerializer,
    EmailScanLogSerializer,
    SubscriptionStatsSerializer
)
from .scanner import GmailScanner


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Subscription CRUD operations
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return SubscriptionListSerializer
        elif self.action in ['update', 'partial_update']:
            return SubscriptionUpdateSerializer
        return SubscriptionSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get subscription statistics"""
        user = request.user
        subscriptions = Subscription.objects.filter(user=user)
        
        # Calculate stats
        total = subscriptions.count()
        active = subscriptions.filter(status='active').count()
        
        # Calculate costs
        active_subs = subscriptions.filter(status='active')
        monthly_cost = active_subs.aggregate(
            total=Sum('monthly_cost')
        )['total'] or Decimal('0.00')
        
        yearly_cost = monthly_cost * 12
        
        # Subscriptions by category
        by_category = {}
        for category_code, category_name in Subscription.CATEGORY_CHOICES:
            count = active_subs.filter(category=category_code).count()
            if count > 0:
                by_category[category_name] = count
        
        to_review = subscriptions.filter(status='to_review').count()
        
        stats = {
            'total_subscriptions': total,
            'active_subscriptions': active,
            'total_monthly_cost': monthly_cost,
            'total_yearly_cost': yearly_cost,
            'subscriptions_by_category': by_category,
            'subscriptions_to_review': to_review
        }
        
        serializer = SubscriptionStatsSerializer(stats)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_active(self, request, pk=None):
        """Mark subscription as active"""
        subscription = self.get_object()
        subscription.status = 'active'
        subscription.save()
        return Response({'status': 'Abonnement marqué comme actif'})
    
    @action(detail=True, methods=['post'])
    def mark_cancelled(self, request, pk=None):
        """Mark subscription as cancelled"""
        subscription = self.get_object()
        subscription.status = 'cancelled'
        subscription.save()
        return Response({'status': 'Abonnement marqué comme annulé'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def scan_emails(request):
    """
    Trigger email scan for subscriptions
    """
    user = request.user
    
    if not user.is_gmail_connected:
        return Response(
            {'error': 'Gmail n\'est pas connecté. Veuillez d\'abord connecter votre compte Gmail.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create scanner instance
        scanner = GmailScanner(user)
        
        # Run scan
        result = scanner.scan_emails()
        
        if result['success']:
            return Response({
                'message': 'Scan terminé avec succès',
                'emails_scanned': result['emails_scanned'],
                'subscriptions_found': result['subscriptions_found']
            })
        else:
            return Response(
                {'error': result['error']},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
    except Exception as e:
        return Response(
            {'error': f'Erreur lors du scan: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def scan_history(request):
    """Get user's scan history"""
    logs = EmailScanLog.objects.filter(user=request.user)
    serializer = EmailScanLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def export_subscriptions(request):
    """Export subscriptions to CSV/JSON"""
    user = request.user
    export_format = request.data.get('format', 'json')
    
    subscriptions = Subscription.objects.filter(user=user)
    
    if export_format == 'json':
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)
    
    # CSV export would be implemented here
    return Response({'message': 'CSV export à implémenter'})
