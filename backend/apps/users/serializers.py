from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 
                  'is_gmail_connected', 'last_scan_date', 'total_monthly_cost', 
                  'created_at')
        read_only_fields = ('id', 'is_gmail_connected', 'last_scan_date', 
                           'total_monthly_cost', 'created_at')


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, required=True, 
                                    validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 
                  'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Les mots de passe ne correspondent pas."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class GoogleAuthSerializer(serializers.Serializer):
    """Serializer for Google OAuth callback"""
    code = serializers.CharField(required=True)
    
    
class GmailConnectionStatusSerializer(serializers.Serializer):
    """Serializer for Gmail connection status"""
    is_connected = serializers.BooleanField()
    email = serializers.EmailField(required=False)
    last_scan_date = serializers.DateTimeField(required=False)
