from os import truncate

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
    
class LineChartAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        event_name = (request.GET.get("event_name"))

        queryset = (
            Event.objects.filter(organization=request.user.organization,event_name=event_name)
            .annotate(day=truncate("timestamp")).values("day").annotate(count=Count("id"))
            .order_by("day"))
        
        return Response(queryset)
    
class BarChartAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        queryset = (Event.objects.filter(organization=request.user.organization)
            .values("event_name")
            .annotate(total=Count("id"))
            .order_by("-total"))
        
        return Response(queryset)
    
class PieChartAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        queryset = (Event.objects.filter(organization=request.user.organization)
            .values("source").annotate(total=Count("id")))
        return Response(queryset)