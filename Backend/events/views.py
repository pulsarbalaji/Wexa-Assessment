import pandas as pd

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
import os

from django.conf import (settings)
from .tasks import (process_csv_task)
from authentication.permissions import (IsAdminOrOwner,IsAnalystOrAbove)
from .services import (create_event,create_batch_events)
from .selectors import get_events
from .serializers import (EventSerializer,APIKeySerializer)
from .services import (create_api_key,revoke_api_key,rotate_api_key)


class EventListAPIView(APIView):
    """
    List organization events
    """
    permission_classes = [IsAuthenticated,IsAnalystOrAbove]

    def get(self, request):

        events = get_events(request.user)

        serializer = EventSerializer(events,many=True)

        return Response(serializer.data,status=status.HTTP_200_OK)


class EventCreateAPIView(APIView):
    """
    Create single event
    """

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self, request):

        serializer = EventSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        event = create_event(user=request.user,validated_data=serializer.validated_data)

        return Response(EventSerializer(event).data,status=status.HTTP_201_CREATED)

class BatchEventAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self, request):

        serializer = EventSerializer(data=request.data,many=True)

        serializer.is_valid(raise_exception=True)

        create_batch_events(user=request.user,validated_data=serializer.validated_data)

        return Response(
            {
                "message":
                    "Batch uploaded successfully"
            },
            status=status.HTTP_201_CREATED)
    
class CSVUploadAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self,request):

        file = request.FILES.get("file")

        if not file:
            return Response(
                {
                    "error":
                    "CSV required"
                },
                status=status.HTTP_400_BAD_REQUEST)

        upload_path = os.path.join(settings.MEDIA_ROOT,file.name)

        with open(upload_path,"wb+") as destination:

            for chunk in (file.chunks()):
                destination.write(chunk)
        process_csv_task.delay(upload_path,request.user.organization.id)

        return Response(
            {
                "message":
                "CSV processing started"
            },
            status=status.HTTP_202_ACCEPTED)
        
class APIKeyCreateAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self,request):

        serializer = (APIKeySerializer(data=request.data))

        serializer.is_valid(raise_exception=True)

        api_key = (create_api_key(request.user,serializer.validated_data))

        return Response(APIKeySerializer(api_key).data,status=status.HTTP_201_CREATED)
     
class RevokeAPIKeyAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def delete(self,request,key_id):
        revoke_api_key(request.user,key_id)

        return Response({"message":"API key revoked"})
    
class RotateAPIKeyAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self,request,key_id):

        api_key = (rotate_api_key(request.user,key_id))

        return Response(APIKeySerializer(api_key).data)
    
    