from django.urls import path

from .views import (
    OrganizationAPIView
)

urlpatterns = [

    path(
        "",
        OrganizationAPIView
        .as_view(),
        name=
        "organization"
    ),
]