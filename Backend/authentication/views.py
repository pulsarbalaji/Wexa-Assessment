from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (RegisterSerializer)
from .services import (register_user)

class RegisterAPIView(APIView):

    def post(self,request):
        serializer = (RegisterSerializer(data=request.data))

        serializer.is_valid(raise_exception=True)
        user = register_user(serializer.validated_data)
        return Response({"message":"User registered"},status=status.HTTP_201_CREATED)