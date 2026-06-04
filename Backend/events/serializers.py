from rest_framework import (serializers)
from .models import (Event,APIKey)

class EventSerializer(serializers.ModelSerializer):

    class Meta:

        model = Event
        fields = [
            "id",
            "event_name",
            "source",
            "event_data",
            "timestamp"
        ]

class APIKeySerializer(serializers.ModelSerializer):

    class Meta:
        model = APIKey
        fields = [
            "id",
            "name",
            "key",
            "is_active",
            "created_at"
        ]
        read_only_fields = ["key"]