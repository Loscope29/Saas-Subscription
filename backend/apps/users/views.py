from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from django.contrib.auth import get_user_model
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import os

from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    GoogleAuthSerializer,
    GmailConnectionStatusSerializer
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """API endpoint for user registration"""
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def google_auth_url(request):
    """
    Generate Google OAuth URL for Gmail access
    """
    try:
        # OAuth2 configuration
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_OAUTH_REDIRECT_URI]
                }
            },
            scopes=[
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/userinfo.email',
                'openid'
            ],
            redirect_uri=settings.GOOGLE_OAUTH_REDIRECT_URI
        )
        
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        
        return Response({
            'authorization_url': authorization_url,
            'state': state
        })
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de la génération de l\'URL OAuth: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def google_auth_callback(request):
    """
    Handle Google OAuth callback and save tokens
    """
    serializer = GoogleAuthSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    code = serializer.validated_data['code']
    
    try:
        # Exchange code for tokens
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
                    "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_OAUTH_REDIRECT_URI]
                }
            },
            scopes=[
                'https://www.googleapis.com/auth/gmail.readonly',
                'https://www.googleapis.com/auth/userinfo.email',
                'openid'
            ],
            redirect_uri=settings.GOOGLE_OAUTH_REDIRECT_URI
        )
        
        flow.fetch_token(code=code)
        credentials = flow.credentials
        
        # Save tokens to user
        user = request.user
        user.gmail_access_token = credentials.token
        user.gmail_refresh_token = credentials.refresh_token
        user.gmail_token_expiry = credentials.expiry
        user.is_gmail_connected = True
        user.save()
        
        return Response({
            'message': 'Gmail connecté avec succès',
            'user': UserSerializer(user).data
        })
        
    except Exception as e:
        return Response(
            {'error': f'Erreur lors de l\'authentification Google: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def disconnect_gmail(request):
    """Disconnect Gmail account"""
    user = request.user
    user.gmail_access_token = None
    user.gmail_refresh_token = None
    user.gmail_token_expiry = None
    user.is_gmail_connected = False
    user.save()
    
    return Response({
        'message': 'Gmail déconnecté avec succès',
        'user': UserSerializer(user).data
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gmail_connection_status(request):
    """Check Gmail connection status"""
    user = request.user
    serializer = GmailConnectionStatusSerializer({
        'is_connected': user.is_gmail_connected,
        'email': user.email if user.is_gmail_connected else None,
        'last_scan_date': user.last_scan_date
    })
    return Response(serializer.data)
