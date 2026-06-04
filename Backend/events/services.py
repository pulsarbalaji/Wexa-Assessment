from .models import (Event,APIKey)

from asgiref.sync import ( async_to_sync )

from channels.layers import ( get_channel_layer )

def create_event(user,validated_data):

    event = (
        Event.objects.create( organization=user.organization,**validated_data ))

    channel_layer = (get_channel_layer())

    async_to_sync(channel_layer.group_send)( "dashboard_updates",{
            "type":
            "dashboard_update",
            "data": {

                "message":
                "New event created",

                "event":
                event.event_name
            }
        }
    )

    return event


def create_batch_events(user,validated_data):

    events = [

        Event(organization=user.organization,**event)
        for event in validated_data
    ]

    return Event.objects.bulk_create(events)

def create_api_key(user,validated_data):

    return APIKey.objects.create(
        organization=user.organization,**validated_data)


def revoke_api_key(user,key_id):

    api_key = APIKey.objects.get(id=key_id,organization=user.organization)

    api_key.is_active = False

    api_key.save()

    return api_key


def rotate_api_key(user,key_id):

    api_key = APIKey.objects.get(id=key_id,organization=user.organization)

    api_key.delete()

    return APIKey.objects.create(organization=user.organization,name=api_key.name)