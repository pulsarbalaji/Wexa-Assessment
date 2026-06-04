from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.serializers import (TokenObtainPairSerializer)
from rest_framework_simplejwt.tokens import (RefreshToken)
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password

class RegisterSerializer(serializers.Serializer):

    company_name = serializers.CharField()
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


User = get_user_model()


class UserSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = User

        fields = [
            "id",
            "username",
            "email",
            "role",
            "organization",
        ]

        read_only_fields = [
            "id",
            "role",
        ]

class CustomTokenObtainPairSerializer(
    serializers.Serializer
):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )

    def validate(
        self,
        attrs
    ):

        email = attrs.get(
            "email"
        )

        password = attrs.get(
            "password"
        )

        try:

            user = (
                User.objects.get(
                    email=email
                )
            )

        except User.DoesNotExist:

            raise serializers.ValidationError(
                {
                    "detail":
                    "Invalid email or password"
                }
            )

        if not check_password(
            password,
            user.password
        ):

            raise serializers.ValidationError(
                {
                    "detail":
                    "Invalid email or password"
                }
            )

        refresh = (
            RefreshToken
            .for_user(user)
        )

        return {

            "refresh":
            str(refresh),

            "access":
            str(
                refresh.access_token
            ),

            "user": {

                "id":
                user.id,

                "email":
                user.email,

                "username":
                user.username,

                "role":
                user.role,
            }
        }
    
