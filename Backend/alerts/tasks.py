from celery import (shared_task)
from django.utils.timezone import (now)
from datetime import (timedelta)
from django.core.mail import (send_mail)
from events.models import (Event)
from .models import (Alert,AlertHistory)


@shared_task
def evaluate_alerts():

    alerts = (Alert.objects.filter(status="ACTIVE"))
    for alert in alerts:
        start_time = (now() - timedelta(minutes=alert.time_window))
        count = (

            Event.objects.filter(organization=alert.organization,event_name=alert.event_name,timestamp__gte=start_time).count())

        if (count >=alert.threshold):

            alert.status = ("TRIGGERED")
            alert.save()
            AlertHistory.objects.create(alert=alert,triggered_value=count)

            if alert.email:

                send_mail(subject="Alert Triggered",

                    message=
                    f"{alert.name} triggered with {count}",

                    from_email=
                    "admin@test.com",

                    recipient_list=[
                        alert.email
                    ]
                )