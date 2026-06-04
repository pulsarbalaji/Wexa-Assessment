from rest_framework.views import (APIView)
from rest_framework.response import (Response)
from rest_framework.permissions import (IsAuthenticated)
from rest_framework import (status)
from authentication.permissions import (IsAdminOrOwner)
from .serializers import (AlertSerializer)
from .services import (create_alert)
from .models import (Alert)

class AlertCreateAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self,request):

        serializer = (AlertSerializer(data=request.data))
        serializer.is_valid(raise_exception=True)

        alert = (
            create_alert(request.user,serializer.validated_data))

        return Response(
            AlertSerializer(alert).data,status=status.HTTP_201_CREATED)
    
class AlertListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        alerts = (
            Alert.objects.filter(
                organization=
                request.user.
                organization))

        serializer = AlertSerializer(alerts,many=True)

        return Response(
            serializer.data
        )