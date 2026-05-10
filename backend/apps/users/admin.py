from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'username', 'is_gmail_connected', 'total_monthly_cost', 'created_at')
    list_filter = ('is_gmail_connected', 'is_staff', 'is_active')
    search_fields = ('email', 'username')
    ordering = ('-created_at',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Gmail Integration', {'fields': ('is_gmail_connected', 'last_scan_date', 'total_monthly_cost')}),
    )
