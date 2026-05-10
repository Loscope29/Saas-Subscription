from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Custom User model with additional fields for email scanning
    """
    email = models.EmailField(unique=True)
    gmail_access_token = models.TextField(blank=True, null=True)
    gmail_refresh_token = models.TextField(blank=True, null=True)
    gmail_token_expiry = models.DateTimeField(blank=True, null=True)
    is_gmail_connected = models.BooleanField(default=False)
    last_scan_date = models.DateTimeField(blank=True, null=True)
    total_monthly_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
