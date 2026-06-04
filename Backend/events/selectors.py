from events.models import Event


def get_events(user):

    queryset = (Event.objects.filter(organization=user.organization).order_by("-timestamp"))
    return queryset