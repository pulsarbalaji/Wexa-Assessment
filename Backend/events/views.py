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
from .models import (Event,APIKey)
from rest_framework.pagination import (PageNumberPagination)
from django.db.models import Q


class EventPagination(PageNumberPagination):

    page_size = 10


class EventListAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        search = (
            request.GET.get(
                "search",
                ""
            )
        )

        source = (
            request.GET.get(
                "source",
                ""
            )
        )

        queryset = (
            Event.objects.filter(
                organization=
                request.user
                .organization
            )
        )

        if search:

            queryset = (
                queryset.filter(

                    Q(
                        event_name__icontains=
                        search
                    )

                    |

                    Q(
                        source__icontains=
                        search
                    )
                )
            )

        if source:

            queryset = (
                queryset.filter(
                    source=source
                )
            )

        queryset = (
            queryset.order_by(
                "-timestamp"
            )
        )

        paginator = (
            EventPagination()
        )

        paginated_qs = (
            paginator.paginate_queryset(
                queryset,
                request
            )
        )

        serializer = (
            EventSerializer(
                paginated_qs,
                many=True))
        return paginator.get_paginated_response(serializer.data)


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
    
class APIKeyListAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrOwner
    ]

    def get(
        self,
        request
    ):

        api_keys = (

            APIKey.objects.filter(

                organization=
                request.user
                .organization
            )

            .order_by(
                "-created_at"
            )
        )

        serializer = (
            APIKeySerializer(
                api_keys,
                many=True
            )
        )

        return Response(
            serializer.data
        )