from rest_framework import serializers

from .models import Report


class ReportSerializer(
    serializers.ModelSerializer
):

    dashboard_name = (
        serializers.CharField(
            source=
            "dashboard.name",
            read_only=True
        )
    )

    class Meta:

        model = Report

        fields = [

            "id",

            "dashboard",

            "dashboard_name",

            "frequency",

            "recipient_email",

            "is_active",

            "created_at",
        ]

        read_only_fields = [

            "id",

            "created_at",

            "is_active",
        ]