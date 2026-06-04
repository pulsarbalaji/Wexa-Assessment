from django.urls import path

from .views import *

urlpatterns = [

    path(
        "",
        ReportCreateAPIView.
        as_view()
    ),
    path(
        "list/",
        ReportListAPIView
        .as_view()
    ),
    path("<int:report_id>/run/",GenerateReportAPIView.as_view(),name="generate-report"),
    path("reports/<int:report_id>/",DeleteReportAPIView.as_view(),name="delete-report"),
    path("history/",ReportHistoryAPIView.as_view(),name="report-history"),
]