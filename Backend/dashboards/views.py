from django.db.models.functions import (TruncDate)

from rest_framework.views import (APIView)
from rest_framework.response import (Response)
from rest_framework import (status)
from rest_framework.permissions import (IsAuthenticated)
from authentication.permissions import (IsAdminOrOwner)
from .serializers import (DashboardSerializer,WidgetSerializer)
from .services import (create_dashboard,create_widget)
from .selectors import (get_dashboards)
from django.db.models import (Count)
from events.models import(Event)
from alerts.models import (Alert)
from reports.models import (Report)
from .models import (Dashboard)

class DashboardCreateAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self,request):

        serializer = (DashboardSerializer(data=request.data))
        serializer.is_valid(raise_exception=True)

        dashboard = (create_dashboard(request.user,serializer.validated_data))

        return Response(DashboardSerializer(dashboard).data,status=status.HTTP_201_CREATED)
    
class DashboardListAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        dashboards = (get_dashboards(request.user))
        serializer = (DashboardSerializer(dashboards,many=True))

        return Response(serializer.data)
    
class WidgetCreateAPIView(APIView):

    permission_classes = [IsAuthenticated,IsAdminOrOwner]

    def post(self,request):
        
        serializer = (WidgetSerializer(data=request.data))
        serializer.is_valid(raise_exception=True)

        widget = (create_widget(serializer.validated_data))
        
        return Response(WidgetSerializer(widget).data)
    
class KPIAnalyticsAPIView(APIView):

    permission_classes = [IsAuthenticated]
    def get(self,request):

        event_name = (request.GET.get("event_name"))
        start_date = (request.GET.get("start_date"))
        end_date = (request.GET.get("end_date"))

        queryset = (Event.objects.filter(organization=request.user.organization,event_name=event_name))
        
        if start_date:
            queryset = (queryset.filter(timestamp__date__gte=start_date))

        if end_date:
            queryset = (queryset.filter( timestamp__date__lte = end_date))
        total = queryset.count()
        return Response({"event":event_name,"count":total})
    
class LineChartAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        queryset = (

            Event.objects.filter(
                organization=
                request.user
                .organization
            )

            .annotate(
                date=
                TruncDate(
                    "timestamp"
                )
            )

            .values(
                "date"
            )

            .annotate(
                count=
                Count("id")
            )

            .order_by(
                "date"
            )
        )

        return Response(
            list(queryset)
        )
    
class BarChartAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        queryset = (

            Event.objects.filter(
                organization=
                request.user
                .organization
            )

            .values(
                "event_name"
            )

            .annotate(
                value=
                Count("id")
            )

            .order_by(
                "-value"
            )
        )

        result = []

        for item in queryset:

            result.append({

                "name":
                item["event_name"],

                "value":
                item["value"]
            })

        return Response(
            result
        )
    
class PieChartAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        queryset = (
            Event.objects.filter(
                organization=
                request.user
                .organization
            )
            .values(
                "source"
            )
            .annotate(
                total=
                Count("id")
            )
        )

        total_count = sum(
            item["total"]
            for item
            in queryset
        )

        result = []

        for item in queryset:

            percentage = (
                (
                    item["total"]
                    / total_count
                ) * 100
            ) if total_count else 0

            result.append({

                "source":
                item["source"],

                "percentage":
                round(
                    percentage,
                    1
                ),

                "value":
                item["total"]
            })

        return Response(
            result
        )
    
class DashboardStatsAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        organization = (
            request.user
            .organization
        )

        total_events = (
            Event.objects.filter(
                organization=
                organization
            ).count()
        )

        total_purchases = (
            Event.objects.filter(
                organization=
                organization,
                event_name=
                "purchase"
            ).count()
        )

        active_alerts = (
            Alert.objects.filter(
                organization=
                organization,
                status=
                "ACTIVE"
            ).count()
        )

        reports_generated = (
            Report.objects.filter(
                organization=
                organization
            ).count()
        )

        return Response(
            {
                "total_events":
                total_events,

                "total_purchases":
                total_purchases,

                "active_alerts":
                active_alerts,

                "reports_generated":
                reports_generated,
            }
        )

class DashboardDetailAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        dashboard_id
    ):

        dashboard = (
            Dashboard.objects.get(
                id=dashboard_id,
                organization=
                request.user
                .organization
            )
        )

        serializer = (
            DashboardSerializer(
                dashboard
            )
        )

        return Response(
            serializer.data
        )
    
class DashboardAnalyticsAPIView(
    APIView
):

    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        dashboard_id
    ):

        dashboard = (
            Dashboard.objects.get(
                id=dashboard_id,
                organization=
                request.user
                .organization
            )
        )

        trends = (

            Event.objects.filter(
                organization=
                request.user
                .organization
            )

            .annotate(
                date=
                TruncDate(
                    "timestamp"
                )
            )

            .values(
                "date"
            )

            .annotate(
                count=
                Count("id")
            )

            .order_by(
                "date"
            )
        )

        distribution = (

            Event.objects.filter(
                organization=
                request.user
                .organization
            )

            .values(
                "event_name"
            )

            .annotate(
                value=
                Count("id")
            )
        )

        return Response({
            "trends":
            list(trends),

            "distribution":
            list(distribution),
        })