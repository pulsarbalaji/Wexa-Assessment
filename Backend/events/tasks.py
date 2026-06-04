import pandas as pd

from celery import shared_task

from .models import Event


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={
        "max_retries": 3
    }
)
def process_csv_task(
    self,
    file_path,
    organization_id
):

    df = pd.read_csv(file_path)

    events = []

    for _, row in df.iterrows():

        events.append(
            Event(
                organization_id=organization_id,

                event_name=row["event_name"],

                source=row["source"],

                event_data={}
            )
        )

    Event.objects.bulk_create(events)

    return "CSV processed"