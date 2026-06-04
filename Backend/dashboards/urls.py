from django.urls import path

from .views import *

urlpatterns = [
    path("",DashboardCreateAPIView.as_view(),name="dashboard-create"),
    path("stats/",DashboardStatsAPIView.as_view()),
    path("list/",DashboardListAPIView.as_view(),name="dashboard-list"),
    path("widget/",WidgetCreateAPIView.as_view(),name="widget-create"),
    path("kpi/",KPIAnalyticsAPIView.as_view(),name="kpi-analytics"),
    path("line-chart/",LineChartAPIView.as_view(),name="line-chart"),
    path("bar-chart/",BarChartAPIView.as_view(),name="bar-chart"),
    path("pie-chart/",PieChartAPIView.as_view(),name="pie-chart"),
    path("<int:dashboard_id>/",DashboardDetailAPIView.as_view(),name="dashboard-detail"),
    path("<int:dashboard_id>/analytics/",DashboardAnalyticsAPIView.as_view(),name="dashboard-analytics"),
]