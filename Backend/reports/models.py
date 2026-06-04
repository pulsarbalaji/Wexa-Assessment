from django.db import models

from organizations.models import (
    Organization
)

from dashboards.models import (
    Dashboard
)


class Report(models.Model):

    FREQUENCY_CHOICES = (

        ("DAILY", "Daily"),

        ("WEEKLY", "Weekly"),

        ("MONTHLY", "Monthly"),
    )

    organization = (
        models.ForeignKey(
            Organization,
            on_delete=
            models.CASCADE
        )
    )

    dashboard = (
        models.ForeignKey(
            Dashboard,
            on_delete=
            models.CASCADE
        )
    )

    frequency = (
        models.CharField(
            max_length=50,
            choices=
            FREQUENCY_CHOICES
        )
    )

    recipient_email = (
        models.EmailField()
    )

    is_active = (
        models.BooleanField(
            default=True
        )
    )

    created_at = (
        models.DateTimeField(
            auto_now_add=True
        )
    )

class ReportHistory(
    models.Model
):

    report = (
        models.ForeignKey(
            Report,
            on_delete=
            models.CASCADE
        )
    )

    file_path = (
        models.FileField(
            upload_to=
            "reports/"
        )
    )

    created_at = (
        models.DateTimeField(
            auto_now_add=True
        )
    )