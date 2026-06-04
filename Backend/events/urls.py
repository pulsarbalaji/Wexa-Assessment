from django.urls import path

from .views import (EventListAPIView,EventCreateAPIView,BatchEventAPIView,CSVUploadAPIView,
                    APIKeyCreateAPIView,RevokeAPIKeyAPIView,RotateAPIKeyAPIView,APIKeyListAPIView)

urlpatterns = [

    path("create/",EventCreateAPIView.as_view(),name="create-event"),
    path("",EventListAPIView.as_view(),name="event-list"),
    path("batch/",BatchEventAPIView.as_view(),name="batch-event"),
    path("upload/",CSVUploadAPIView.as_view(),name="csv-upload"),
    path("apikey/generate/",APIKeyCreateAPIView.as_view(),name="api-key-generate"),
    path("apikey/revoke/<int:key_id>/",RevokeAPIKeyAPIView.as_view(),name="api-key-revoke"),
    path("apikey/rotate/<int:key_id>/",RotateAPIKeyAPIView.as_view(),name="api-key-rotate"),
    path("apikey/",APIKeyListAPIView.as_view(),name="api-key-list"),
]   