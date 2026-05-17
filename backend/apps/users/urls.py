from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    # JWT Authentication
    path('login/', views.LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Registration & Profile
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.user_profile, name='user_profile'),
    
    # Google OAuth
    path('google/authorize/', views.google_auth_url, name='google_auth_url'),
    path('google/callback/', views.google_auth_callback, name='google_auth_callback'),
    path('google/disconnect/', views.disconnect_gmail, name='disconnect_gmail'),
    path('google/status/', views.gmail_connection_status, name='gmail_status'),
]
