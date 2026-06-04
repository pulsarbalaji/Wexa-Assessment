from django.contrib import admin
from django.urls import path, include
from django.conf import (
    settings
)

from django.conf.urls.static import (
    static
)

urlpatterns = [

    path("admin/",admin.site.urls),
    path("api/auth/",include("authentication.urls")),
    path("api/events/",include("events.urls")),
    path("api/reports/",include("reports.urls")),
    path("api/dashboard/",include("dashboards.urls")),
    path("api/alerts/",include("alerts.urls")),
    path("api/organization/",include("organizations.urls")),

]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=
    settings.MEDIA_ROOT
)