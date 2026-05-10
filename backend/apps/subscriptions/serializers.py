from rest_framework import serializers
from .models import Subscription, EmailScanLog


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for Subscription model"""
    
    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ('user', 'first_detected_date', 'created_at', 'updated_at')


class SubscriptionListSerializer(serializers.ModelSerializer):
    """Simplified serializer for list view"""
    
    class Meta:
        model = Subscription
        fields = ('id', 'service_name', 'monthly_cost', 'currency', 
                  'category', 'status', 'billing_frequency', 
                  'last_billing_date', 'next_billing_date')


class SubscriptionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating subscription status"""
    
    class Meta:
        model = Subscription
        fields = ('status', 'category', 'notes', 'cancellation_url')


class EmailScanLogSerializer(serializers.ModelSerializer):
    """Serializer for EmailScanLog model"""
    
    class Meta:
        model = EmailScanLog
        fields = '__all__'
        read_only_fields = ('user', 'scan_start', 'scan_end')


class SubscriptionStatsSerializer(serializers.Serializer):
    """Serializer for subscription statistics"""
    total_subscriptions = serializers.IntegerField()
    active_subscriptions = serializers.IntegerField()
    total_monthly_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_yearly_cost = serializers.DecimalField(max_digits=10, decimal_places=2)
    subscriptions_by_category = serializers.DictField()
    subscriptions_to_review = serializers.IntegerField()
