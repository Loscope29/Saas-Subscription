from django.contrib import admin
from .models import Subscription, EmailScanLog


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'user', 'monthly_cost', 'currency', 'status', 'category', 'created_at')
    list_filter = ('status', 'category', 'currency')
    search_fields = ('service_name', 'user__email', 'email_sender')
    ordering = ('-created_at',)


@admin.register(EmailScanLog)
class EmailScanLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'scan_start', 'status', 'emails_scanned', 'subscriptions_found')
    list_filter = ('status',)
    search_fields = ('user__email',)
    ordering = ('-scan_start',)
