from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.SubscriptionViewSet, basename='subscription')

urlpatterns = [
    path('scan/', views.scan_emails, name='scan_emails'),
    path('scan/history/', views.scan_history, name='scan_history'),
    path('export/', views.export_subscriptions, name='export_subscriptions'),
    path('', include(router.urls)),
]
