from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

from .services import (register_user)

from rest_framework_simplejwt.views import (TokenObtainPairView)
from .serializers import (CustomTokenObtainPairSerializer,UserSerializer,RegisterSerializer)
from .models import (User)
from rest_framework.permissions import (
    IsAuthenticated
)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        serializer = (RegisterSerializer(data=request.data))

        serializer.is_valid(raise_exception=True)
        user = register_user(serializer.validated_data)
        return Response({"message":"User registered"},status=status.HTTP_201_CREATED)
    

class LoginAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self,request):

        serializer = (
            CustomTokenObtainPairSerializer(
                data=request.data,
                context={
                    "request":
                    request
                }
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        return Response(
            serializer.validated_data,
            status=
            status.HTTP_200_OK
        )

class ProfileAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        serializer = (
            UserSerializer(
                request.user
            )
        )

        return Response(
            serializer.data
        )

    def patch(
        self,
        request
    ):

        serializer = (
            UserSerializer(
                request.user,
                data=request.data,
                partial=True
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data
        )
    
class ChangePasswordAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request
    ):

        current_password = (
            request.data.get(
                "current_password"
            )
        )

        new_password = (
            request.data.get(
                "new_password"
            )
        )

        if not request.user.check_password(
            current_password
        ):

            return Response(
                {
                    "message":
                    "Wrong password"
                },
                status=400
            )

        request.user.set_password(
            new_password
        )

        request.user.save()

        return Response(
            {
                "message":
                "Password updated"
            }
        )