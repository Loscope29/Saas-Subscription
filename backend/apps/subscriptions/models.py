from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Subscription(models.Model):
    """
    Model to store detected subscriptions from emails
    """
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('cancelled', 'Annulé'),
        ('to_review', 'À vérifier'),
    ]
    
    CATEGORY_CHOICES = [
        ('saas', 'SaaS / Logiciel'),
        ('streaming', 'Streaming'),
        ('newsletter', 'Newsletter'),
        ('hosting', 'Hébergement'),
        ('marketing', 'Marketing'),
        ('design', 'Design'),
        ('productivity', 'Productivité'),
        ('other', 'Autre'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    
    # Basic info
    service_name = models.CharField(max_length=255)
    email_sender = models.EmailField()
    
    # Financial info
    monthly_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='EUR')
    billing_frequency = models.CharField(max_length=50, default='monthly')  # monthly, yearly, etc.
    
    # Metadata
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='to_review')
    
    # Dates
    first_detected_date = models.DateField()
    last_billing_date = models.DateField(blank=True, null=True)
    next_billing_date = models.DateField(blank=True, null=True)
    
    # Additional info
    notes = models.TextField(blank=True)
    cancellation_url = models.URLField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.service_name} - {self.user.email} ({self.monthly_cost}{self.currency})"

    class Meta:
        db_table = 'subscriptions'
        ordering = ['-monthly_cost', '-created_at']
        unique_together = ['user', 'service_name', 'email_sender']


class EmailScanLog(models.Model):
    """
    Log of email scans performed
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scan_logs')
    
    scan_start = models.DateTimeField(auto_now_add=True)
    scan_end = models.DateTimeField(blank=True, null=True)
    
    emails_scanned = models.IntegerField(default=0)
    subscriptions_found = models.IntegerField(default=0)
    
    status = models.CharField(max_length=20, default='in_progress')  # in_progress, completed, failed
    error_message = models.TextField(blank=True)
    
    def __str__(self):
        return f"Scan {self.user.email} - {self.scan_start.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        db_table = 'email_scan_logs'
        ordering = ['-scan_start']
