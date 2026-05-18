"""
URL configuration for subscription tracker API
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Local dev urls (with /api/ prefix)
    path('api/auth/', include('apps.users.urls')),
    path('api/subscriptions/', include('apps.subscriptions.urls')),
    
    # Production Vercel urls (where /api/ prefix is stripped by Vercel routing)
    path('auth/', include('apps.users.urls')),
    path('subscriptions/', include('apps.subscriptions.urls')),
]
