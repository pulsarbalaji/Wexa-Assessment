from rest_framework import (serializers)

from .models import (Alert)



class AlertSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Alert

        fields = [

            "id",

            "name",

            "event_name",

            "threshold",

            "time_window",

            "status",

            "email",

            "created_at",
        ]

        read_only_fields = [

            "id",

            "status",

            "created_at",
        ]