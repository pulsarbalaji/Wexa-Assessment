from .models import (Dashboard,Widget)


def create_dashboard(user,validated_data):
    return Dashboard.objects.create(organization=user.organization,**validated_data)

def create_widget(validated_data):
    return Widget.objects.create(**validated_data)