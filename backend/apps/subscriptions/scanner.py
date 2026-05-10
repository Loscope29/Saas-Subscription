"""
Gmail Email Scanner Service
Scans Gmail for subscription and billing emails
"""
import re
from datetime import datetime, timedelta
from decimal import Decimal
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.conf import settings
from django.utils import timezone
from django.db.models import Sum

from .models import Subscription, EmailScanLog


class GmailScanner:
    """Service to scan Gmail for subscriptions"""
    
    # Keywords to identify billing/subscription emails
    BILLING_KEYWORDS = [
        'invoice', 'receipt', 'payment', 'billing', 'subscription',
        'facture', 'paiement', 'abonnement', 'reçu',
        'stripe', 'paypal', 'charged', 'débité'
    ]
    
    # Common SaaS/subscription services
    KNOWN_SERVICES = {
        'stripe.com': 'Stripe',
        'paypal.com': 'PayPal',
        'netflix.com': 'Netflix',
        'spotify.com': 'Spotify',
        'adobe.com': 'Adobe',
        'microsoft.com': 'Microsoft',
        'google.com': 'Google',
        'amazon.com': 'Amazon',
        'apple.com': 'Apple',
        'notion.so': 'Notion',
        'figma.com': 'Figma',
        'canva.com': 'Canva',
        'mailchimp.com': 'Mailchimp',
        'hubspot.com': 'HubSpot',
    }
    
    def __init__(self, user):
        self.user = user
        self.service = None
        self.scan_log = None
        
    def _get_credentials(self):
        """Get user's Gmail credentials"""
        if not self.user.is_gmail_connected:
            raise Exception("Gmail not connected")
            
        return Credentials(
            token=self.user.gmail_access_token,
            refresh_token=self.user.gmail_refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_OAUTH_CLIENT_ID,
            client_secret=settings.GOOGLE_OAUTH_CLIENT_SECRET,
        )
    
    def _init_gmail_service(self):
        """Initialize Gmail API service"""
        credentials = self._get_credentials()
        self.service = build('gmail', 'v1', credentials=credentials)
    
    def _build_search_query(self):
        """Build Gmail search query"""
        # Search for emails from the last X months
        months_ago = timezone.now() - timedelta(days=settings.EMAIL_SCAN_MONTHS * 30)
        after_date = months_ago.strftime('%Y/%m/%d')
        
        # Build query with billing keywords
        keywords = ' OR '.join(self.BILLING_KEYWORDS)
        query = f'({keywords}) after:{after_date}'
        
        return query
    
    def _extract_price_from_text(self, text):
        """Extract price from email text"""
        if not text:
            return None, None
            
        # Patterns for price detection
        patterns = [
            r'(?:€|EUR)\s*(\d+(?:[.,]\d{2})?)',  # €50.00 or EUR 50.00
            r'(\d+(?:[.,]\d{2})?)\s*(?:€|EUR)',  # 50.00€ or 50.00 EUR
            r'\$\s*(\d+(?:[.,]\d{2})?)',         # $50.00
            r'(\d+(?:[.,]\d{2})?)\s*\$',         # 50.00$
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                price_str = match.group(1).replace(',', '.')
                try:
                    price = Decimal(price_str)
                    # Determine currency
                    if '€' in match.group(0) or 'EUR' in match.group(0):
                        currency = 'EUR'
                    elif '$' in match.group(0):
                        currency = 'USD'
                    else:
                        currency = 'EUR'
                    return price, currency
                except:
                    continue
        
        return None, None
    
    def _categorize_service(self, service_name, sender_email):
        """Categorize service based on name and email"""
        service_lower = service_name.lower()
        email_lower = sender_email.lower()
        
        # Simple categorization logic
        if any(word in service_lower for word in ['netflix', 'spotify', 'youtube', 'prime', 'hulu']):
            return 'streaming'
        elif any(word in service_lower for word in ['notion', 'trello', 'asana', 'slack']):
            return 'productivity'
        elif any(word in service_lower for word in ['figma', 'adobe', 'canva', 'sketch']):
            return 'design'
        elif any(word in service_lower for word in ['mailchimp', 'hubspot', 'sendgrid']):
            return 'marketing'
        elif any(word in service_lower for word in ['aws', 'azure', 'heroku', 'vercel', 'netlify']):
            return 'hosting'
        elif 'newsletter' in service_lower or 'digest' in service_lower:
            return 'newsletter'
        else:
            return 'saas'
    
    def _parse_email(self, message):
        """Parse email and extract subscription info"""
        headers = message['payload']['headers']
        
        # Extract sender and subject
        sender = next((h['value'] for h in headers if h['name'].lower() == 'from'), '')
        subject = next((h['value'] for h in headers if h['name'].lower() == 'subject'), '')
        date_str = next((h['value'] for h in headers if h['name'].lower() == 'date'), '')
        
        # Extract email address from sender
        email_match = re.search(r'<(.+?)>', sender)
        sender_email = email_match.group(1) if email_match else sender
        
        # Get email body snippet
        snippet = message.get('snippet', '')
        
        # Try to identify service name
        service_name = None
        for domain, name in self.KNOWN_SERVICES.items():
            if domain in sender_email.lower():
                service_name = name
                break
        
        if not service_name:
            # Extract from sender or subject
            service_name = sender.split('<')[0].strip() or subject.split()[0]
        
        # Extract price
        price, currency = self._extract_price_from_text(snippet + ' ' + subject)
        
        # Parse date
        try:
            email_date = datetime.strptime(date_str.split('(')[0].strip(), '%a, %d %b %Y %H:%M:%S %z')
            email_date = email_date.date()
        except:
            email_date = timezone.now().date()
        
        return {
            'service_name': service_name[:255],
            'email_sender': sender_email,
            'monthly_cost': price or Decimal('0.00'),
            'currency': currency or 'EUR',
            'first_detected_date': email_date,
            'last_billing_date': email_date,
            'category': self._categorize_service(service_name, sender_email),
        }
    
    def scan_emails(self):
        """Main method to scan emails"""
        try:
            # Create scan log
            self.scan_log = EmailScanLog.objects.create(
                user=self.user,
                status='in_progress'
            )
            
            # Initialize Gmail service
            self._init_gmail_service()
            
            # Build search query
            query = self._build_search_query()
            
            # Search for emails
            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=settings.MAX_EMAILS_TO_SCAN
            ).execute()
            
            messages = results.get('messages', [])
            self.scan_log.emails_scanned = len(messages)
            self.scan_log.save()
            
            subscriptions_found = 0
            
            # Process each email
            for msg in messages:
                try:
                    # Get full message
                    message = self.service.users().messages().get(
                        userId='me',
                        id=msg['id'],
                        format='full'
                    ).execute()
                    
                    # Parse email
                    sub_data = self._parse_email(message)
                    
                    # Only create if price was found (likely a billing email)
                    if sub_data['monthly_cost'] > 0:
                        # Check if subscription already exists
                        existing = Subscription.objects.filter(
                            user=self.user,
                            service_name=sub_data['service_name'],
                            email_sender=sub_data['email_sender']
                        ).first()
                        
                        if not existing:
                            Subscription.objects.create(
                                user=self.user,
                                **sub_data
                            )
                            subscriptions_found += 1
                        
                except Exception as e:
                    print(f"Error processing message {msg['id']}: {str(e)}")
                    continue
            
            # Update scan log
            self.scan_log.scan_end = timezone.now()
            self.scan_log.subscriptions_found = subscriptions_found
            self.scan_log.status = 'completed'
            self.scan_log.save()
            
            # Update user's last scan date and total cost
            self.user.last_scan_date = timezone.now()
            total_cost = Subscription.objects.filter(
                user=self.user,
                status='active'
            ).aggregate(total=Sum('monthly_cost'))['total'] or 0
            self.user.total_monthly_cost = total_cost
            self.user.save()
            
            return {
                'success': True,
                'emails_scanned': self.scan_log.emails_scanned,
                'subscriptions_found': subscriptions_found
            }
            
        except HttpError as error:
            # Handle Gmail API errors
            error_msg = f'Gmail API error: {error}'
            if self.scan_log:
                self.scan_log.status = 'failed'
                self.scan_log.error_message = error_msg
                self.scan_log.scan_end = timezone.now()
                self.scan_log.save()
            
            return {
                'success': False,
                'error': error_msg
            }
            
        except Exception as e:
            error_msg = f'Scan error: {str(e)}'
            if self.scan_log:
                self.scan_log.status = 'failed'
                self.scan_log.error_message = error_msg
                self.scan_log.scan_end = timezone.now()
                self.scan_log.save()
            
            return {
                'success': False,
                'error': error_msg
            }
