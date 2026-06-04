from rest_framework.views import (
    APIView
)

from rest_framework.response import (
    Response
)

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework import (
    status
)

from authentication.permissions import (
    IsAdminOrOwner
)

from .serializers import (
    ReportSerializer
)
from .models import (
    Report, ReportHistory)
from .tasks import (generate_reports)


class ReportCreateAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated,
        IsAdminOrOwner
    ]

    def post(
        self,
        request
    ):

        serializer = (
            ReportSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save(
            organization=
            request.user.
            organization
        )

        return Response(
            serializer.data,
            status=
            status.
            HTTP_201_CREATED
        )
    
class ReportListAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        reports = (

            Report.objects.filter(

                organization=
                request.user.
                organization
            )

            .select_related(
                "dashboard"
            )
        )

        serializer = (
            ReportSerializer(
                reports,
                many=True
            )
        )

        return Response(
            serializer.data
        )
    

class GenerateReportAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        report_id
    ):

        report = (
            Report.objects.get(
                id=report_id,
                organization=
                request.user
                .organization
            )
        )

        # call celery task
        generate_reports.delay(
            report.id
        )

        return Response(
            {
                "message":
                "Report started"
            }
        )


class DeleteReportAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def delete(
        self,
        request,
        report_id
    ):

        report = (
            Report.objects.get(
                id=report_id,
                organization=
                request.user
                .organization
            )
        )

        report.delete()

        return Response(
            {
                "message":
                "Deleted"
            }
        )


class ReportHistoryAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        history = (

            ReportHistory.objects
            .filter(

                report__organization=
                request.user
                .organization
            )

            .select_related(
                "report"
            )

            .order_by(
                "-created_at"
            )
        )

        data = []

        for item in history:

            data.append({

                "id":
                item.id,

                "report_name":
                item.report.dashboard.name,

                "generated_at":
                item.created_at,

                "format":
                "PDF",

                "download_url":
                f"/media/{item.file_path}",

                "size":
                102400,  # temporary
            })

        return Response(
            data
        )