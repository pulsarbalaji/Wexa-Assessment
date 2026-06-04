from django.urls import path

from .views import *

urlpatterns = [

    path(
        "",
        ReportCreateAPIView.
        as_view()
    ),
]