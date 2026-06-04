from .models import (Dashboard)

def get_dashboards(user):
    return (Dashboard.objects.filter(organization=user.organization))