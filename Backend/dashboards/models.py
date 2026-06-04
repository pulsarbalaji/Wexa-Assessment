from django.db import models

from organizations.models import (Organization)

class Dashboard(models.Model):

    organization = (models.ForeignKey(Organization,on_delete=models.CASCADE,related_name="dashboards"))
    name = (models.CharField(max_length=255))
    description = (models.TextField(blank=True,null=True))
    is_public = (models.BooleanField(default=False))
    created_at = (models.DateTimeField(auto_now_add=True))
    
    def __str__(self):
        return self.name