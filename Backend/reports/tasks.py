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
def generate_reports(
    report_id
):

    report = (
        Report.objects
        .select_related(
            "dashboard"
        )
        .get(
            id=report_id
        )
    )

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

    c.drawString(
        100,
        780,
        f"Dashboard: "
        f"{report.dashboard.name}"
    )

    count = (
        Event.objects.filter(
            organization=
            report.organization
        ).count()
    )

    c.drawString(
        100,
        740,
        f"Total Events: "
        f"{count}"
    )

    c.save()

    email = EmailMessage(

        subject=
        "Analytics Report",

        body=
        "Attached report",

        to=[
            report.
            recipient_email
        ],
    )

    email.attach_file(
        file_path
    )

    email.send()

    ReportHistory.objects.create(

        report=report,

        file_path=
        file_name
    )

    return {
        "success": True
    }