from .models import (Alert)


def create_alert(user,validated_data):

    return Alert.objects.create(
        organization=
        user.organization,
        **validated_data
    )