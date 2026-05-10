import os
import sys
import django
import traceback

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.users.models import User
from apps.subscriptions.scanner import GmailScanner

def debug():
    try:
        user = User.objects.get(email='test_scan@gmail.com')
        print(f"Testing scan for user: {user.email}")
        scanner = GmailScanner(user)
        result = scanner.scan_emails()
        print(f"Result: {result}")
    except Exception:
        print("TRACEBACK:")
        traceback.print_exc()

if __name__ == "__main__":
    debug()
