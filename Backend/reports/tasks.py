import os

from celery import (
    shared_task
)

from django.conf import (
    settings
)

from django.core.mail import (
    EmailMessage
)

from reportlab.pdfgen import (
    canvas
)

from .models import (
    Report,
    ReportHistory
)

from events.models import (
    Event
)


@shared_task
def generate_reports():

    reports = (
        Report.objects.filter(
            is_active=True
        )
    )

    for report in reports:

        file_name = (
            f"report_"
            f"{report.id}.pdf"
        )

        file_path = os.path.join(
            settings.MEDIA_ROOT,
            file_name
        )

        c = canvas.Canvas(
            file_path
        )

        c.drawString(
            100,
            800,
            "Analytics Report"
        )

        count = (
            Event.objects.filter(
                organization=
                report.
                organization
            ).count()
        )

        c.drawString(
            100,
            760,
            f"Total Events: {count}"
        )

        c.save()

        EmailMessage(

            subject=
            "Analytics Report",

            body=
            "Attached report",

            to=[
                report.
                recipient_email
            ],

        ).attach_file(
            file_path
        ).send()

        ReportHistory.objects.create(
            report=report,
            file_path=file_name
        )