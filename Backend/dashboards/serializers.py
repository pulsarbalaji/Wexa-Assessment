from rest_framework import (serializers)
from .models import (Dashboard,Widget)


class DashboardSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Dashboard

        fields = [

            "id",

            "name",

            "description",

            "created_at",
        ]

class WidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Widget
        fields = "__all__"