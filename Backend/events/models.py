from django.db import models
import secrets

from organizations.models import (Organization)


class Event(models.Model):

    organization = (models.ForeignKey(Organization,on_delete=models.CASCADE,related_name="events"))
    event_name = (models.CharField(max_length=255))
    source = (models.CharField(max_length=100))
    event_data = (models.JSONField(default=dict))
    timestamp = (models.DateTimeField(auto_now_add=True))

    class Meta:
        indexes = [models.Index(fields=["organization","timestamp"])]
        
    def __str__(self):

        return self.event_name
    
class APIKey(models.Model):

    organization = models.ForeignKey(Organization,on_delete=models.CASCADE,related_name="api_keys")
    name = models.CharField(max_length=255)
    key = models.CharField(max_length=255,unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self,*args,**kwargs):
        if not self.key:
            self.key = (secrets.token_urlsafe(32))

        super().save(*args,**kwargs)

    def __str__(self):
        return self.name