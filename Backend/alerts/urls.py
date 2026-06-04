from django.urls import path

from .views import *

urlpatterns = [

    path(
        "",
        AlertCreateAPIView
        .as_view()
    ),

    path(
        "list/",
        AlertListAPIView
        .as_view()
    ),
]